<?php

namespace App\Services;

use App\Models\Instagram;
use Carbon\Carbon;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Throwable;

class InstagramFeedService
{
    private const MAX_SYNCED_POSTS = 12;
    private const SYNC_LOCK_SECONDS = 360;
    private const IMAGE_TYPES = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];

    public function getLatestPosts(int $limit = 8): Collection
    {
        $username = (string) config('services.instagram.public_username', 'sr.repuestos');
        $minimumMinutes = max((int) config('services.instagram.cache_minutes', 60), 60);

        try {
            $lastAttempt = $this->getSyncStatus()['last_attempt_at'];
            if (!$lastAttempt || Carbon::parse($lastAttempt)->addMinutes($minimumMinutes)->isPast()) {
                $this->syncLatestPosts($username, self::MAX_SYNCED_POSTS);
            }
        } catch (Throwable $exception) {
            Log::warning('No se pudo comprobar la actualización de Instagram.', [
                'reason' => get_class($exception),
            ]);
        }

        return $this->getStoredPosts($limit);
    }

    public function getSyncStatus(): array
    {
        $username = (string) config('services.instagram.public_username', 'sr.repuestos');

        return Cache::store('database')->get($this->statusKey($username), [
            'last_attempt_at' => null,
            'last_success_at' => null,
            'result' => null,
            'message' => null,
            'count' => 0,
        ]);
    }

    public function syncLatestPosts(string $username, int $limit = self::MAX_SYNCED_POSTS): Collection
    {
        $limit = min(max($limit, 1), self::MAX_SYNCED_POSTS);
        $cache = Cache::store('database');
        $lock = $cache->lock("instagram.feed.sync.{$username}", self::SYNC_LOCK_SECONDS);

        if (!$lock->get()) {
            return $this->getStoredPosts(min($limit, 8));
        }

        try {
            $previous = $cache->get($this->statusKey($username), []);
            $status = [
                'last_attempt_at' => now()->toIso8601String(),
                'last_success_at' => $previous['last_success_at'] ?? null,
                'result' => 'failed',
                'message' => 'Instagram no entregó un feed público completo.',
                'count' => 0,
            ];
            $cache->forever($this->statusKey($username), $status);

            try {
                $feed = $this->fetchPublicFeed($username, $limit);
                $posts = $feed['posts'];
                $existingPostCount = Instagram::where('source', 'instagram_public')
                    ->whereIn('external_id', array_column($posts, 'external_id'))
                    ->count();
                $newPostCount = count($posts) - $existingPostCount;
                $downloadedPaths = [];
                try {
                    $prepared = $this->preparePosts($posts, $downloadedPaths);
                    $oldPosts = DB::transaction(function () use ($prepared, $feed) {
                        $ids = [];
                        foreach ($prepared as $post) {
                            $ids[] = $post['external_id'];
                            Instagram::updateOrCreate(
                                ['source' => 'instagram_public', 'external_id' => $post['external_id']],
                                [
                                    'order' => $post['order'],
                                    'image' => $post['image'],
                                    'link' => $post['link'],
                                    'caption' => $post['caption'],
                                    'published_at' => $post['timestamp']
                                        ? Carbon::createFromTimestamp((int) $post['timestamp'])
                                        : null,
                                ],
                            );
                        }

                        $old = Instagram::where('source', 'instagram_public')
                            ->whereNotIn('external_id', $ids)
                            ->get();
                        if ($feed['complete']) {
                            Instagram::whereIn('id', $old->pluck('id'))->delete();
                        } else {
                            foreach ($old->sortBy(fn (Instagram $post) => (int) $post->order)->values() as $index => $post) {
                                $post->update(['order' => (string) (count($prepared) + $index + 1)]);
                            }

                            return collect();
                        }

                        return $old;
                    });
                } catch (Throwable $exception) {
                    foreach ($downloadedPaths as $path) {
                        Storage::disk('public')->delete($path);
                    }
                    throw $exception;
                }

                foreach ($oldPosts as $post) {
                    $path = $post->getRawOriginal('image');
                    if ($this->isLocalImage($path)) {
                        Storage::disk('public')->delete($path);
                    }
                }

                $status['last_success_at'] = now()->toIso8601String();
                $status['result'] = 'success';
                $status['message'] = $newPostCount > 0
                    ? "Se incorporaron {$newPostCount} publicaciones nuevas."
                    : 'Instagram respondió, pero no se encontraron publicaciones nuevas.';
                if (!$feed['complete']) {
                    $status['message'] .= ' El feed recibido fue parcial; se conservaron las publicaciones anteriores.';
                }
                $status['count'] = count($prepared);
                $cache->forever($this->statusKey($username), $status);
                $this->clearLatestPostsCache();
            } catch (Throwable $exception) {
                $status['message'] = $exception instanceof RuntimeException
                    ? $exception->getMessage()
                    : 'No se pudo completar la actualización de Instagram.';
                $cache->forever($this->statusKey($username), $status);
                Log::warning('Falló la sincronización pública de Instagram.', [
                    'username' => $username,
                    'reason' => get_class($exception),
                ]);
            }

            return $this->getStoredPosts(min($limit, 8));
        } finally {
            $lock->release();
        }
    }

    public function clearLatestPostsCache(?int $maxLimit = null): void
    {
        $username = (string) config('services.instagram.public_username', 'sr.repuestos');
        $maxLimit = max($maxLimit ?? self::MAX_SYNCED_POSTS, 1);

        for ($limit = 1; $limit <= $maxLimit; $limit++) {
            Cache::store('database')->forget("instagram.feed.latest.{$username}.{$limit}");
        }
    }

    private function statusKey(string $username): string
    {
        return "instagram.feed.status.{$username}";
    }

    private function fetchPublicFeed(string $username, int $limit): array
    {
        $connectionFailures = 0;
        $accessDenials = 0;
        $profileEndpoint = "https://www.instagram.com/{$username}/";
        try {
            $response = Http::timeout(12)->withHeaders($this->profileHeaders())->get($profileEndpoint);
            if ($response->successful()) {
                $posts = $this->parseProfileHtml($response->body(), $username, $limit);
                if ($posts !== null) {
                    return $posts;
                }
                $this->logFetchFailure($profileEndpoint, $response->status(), 'invalid_or_incomplete');
            } else {
                $accessDenials += in_array($response->status(), [401, 403], true) ? 1 : 0;
                $this->logFetchFailure($profileEndpoint, $response->status(), 'http_error');
            }
        } catch (Throwable $exception) {
            $connectionFailures += $exception instanceof ConnectionException ? 1 : 0;
            $this->logFetchFailure($profileEndpoint, null, get_class($exception));
        }

        foreach ([
            'https://www.instagram.com/api/v1/users/web_profile_info/',
            'https://i.instagram.com/api/v1/users/web_profile_info/',
        ] as $endpoint) {
            try {
                $response = Http::timeout(10)->withHeaders([
                    'X-IG-App-ID' => (string) config('services.instagram.public_app_id', '936619743392459'),
                    'User-Agent' => $this->profileHeaders()['User-Agent'],
                    'Accept' => 'application/json',
                    'Referer' => $profileEndpoint,
                ])->get($endpoint, ['username' => $username]);

                if (!$response->successful()) {
                    $accessDenials += in_array($response->status(), [401, 403], true) ? 1 : 0;
                    $this->logFetchFailure($endpoint, $response->status(), 'http_error');
                    continue;
                }

                $posts = $this->parseLegacyFeed($response->json('data.user.edge_owner_to_timeline_media'), $limit);
                if ($posts !== null) {
                    return $posts;
                }
                $this->logFetchFailure($endpoint, $response->status(), 'invalid_or_incomplete');
            } catch (Throwable $exception) {
                $connectionFailures += $exception instanceof ConnectionException ? 1 : 0;
                $this->logFetchFailure($endpoint, null, get_class($exception));
            }
        }

        if ($connectionFailures === 3) {
            throw new RuntimeException('No se pudo conectar con Instagram. Se conserva el contenido guardado.');
        }
        if ($accessDenials === 3) {
            throw new RuntimeException('Instagram rechazó el acceso público a sus publicaciones. Se conserva el contenido guardado.');
        }

        throw new RuntimeException('Instagram no entregó un feed público completo.');
    }

    private function profileHeaders(): array
    {
        return [
            'User-Agent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
            'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language' => 'en-US,en;q=0.9',
            'Sec-Fetch-Dest' => 'document',
            'Sec-Fetch-Mode' => 'navigate',
            'Sec-Fetch-Site' => 'none',
            'Sec-Fetch-User' => '?1',
            'Upgrade-Insecure-Requests' => '1',
            'sec-ch-ua' => '"Not-A.Brand";v="24", "Chromium";v="146"',
            'sec-ch-ua-mobile' => '?0',
            'sec-ch-ua-platform' => '"Linux"',
        ];
    }

    private function parseProfileHtml(string $html, string $username, int $limit): ?array
    {
        preg_match_all('~<script\b([^>]*)>(.*?)</script>~si', $html, $scripts, PREG_SET_ORDER);

        foreach ($scripts as $script) {
            if (!str_contains($script[1], 'application/json')
                || !str_contains($script[2], 'polaris_ordered_timeline_connection')) {
                continue;
            }

            $data = json_decode($script[2], true);
            if (!is_array($data)) {
                continue;
            }

            $user = $this->findProfileUser($data);
            $connection = $user['polaris_ordered_timeline_connection'] ?? null;
            $edges = $connection['edges'] ?? null;
            if (!is_array($edges) || $edges === []) {
                continue;
            }

            $posts = [];
            foreach (array_slice($edges, 0, $limit) as $index => $edge) {
                $node = $edge['node'] ?? null;
                $code = $node['code'] ?? null;
                $imageUrl = $node['display_uri'] ?? null;
                if (!is_array($node) || !is_string($code)
                    || !preg_match('/^[A-Za-z0-9_-]+$/', $code)
                    || !is_string($imageUrl) || !$this->isAllowedImageUrl($imageUrl)) {
                    continue 2;
                }

                $isReel = ($node['__typename'] ?? '') === 'XIGPolarisVideoMedia'
                    || ($node['product_type'] ?? '') === 'clips';
                $posts[] = [
                    'external_id' => $code,
                    'order' => (string) ($index + 1),
                    'image_url' => $imageUrl,
                    'link' => 'https://www.instagram.com/'.($isReel ? 'reel' : 'p')."/{$code}/",
                    'caption' => $node['caption']['text'] ?? null,
                    'timestamp' => null,
                ];
            }

            if (count(array_unique(array_column($posts, 'external_id'))) === count($posts)) {
                return [
                    'posts' => $posts,
                    'complete' => !($connection['page_info']['has_next_page'] ?? false) || count($edges) >= $limit,
                ];
            }
        }

        return null;
    }

    private function findProfileUser(array $data): ?array
    {
        if (isset($data['xig_user_by_username']) && is_array($data['xig_user_by_username'])) {
            return $data['xig_user_by_username'];
        }

        foreach ($data as $value) {
            if (is_array($value)) {
                $found = $this->findProfileUser($value);
                if ($found !== null) {
                    return $found;
                }
            }
        }

        return null;
    }

    private function parseLegacyFeed(mixed $connection, int $limit): ?array
    {
        if (!is_array($connection) || !isset($connection['edges']) || !is_array($connection['edges']) || $connection['edges'] === []) {
            return null;
        }

        $edges = $connection['edges'];
        $posts = [];
        foreach (array_slice($edges, 0, $limit) as $index => $edge) {
            $node = $edge['node'] ?? null;
            $code = $node['shortcode'] ?? null;
            $imageUrl = $node['display_url'] ?? $node['thumbnail_src']
                ?? $node['edge_sidecar_to_children']['edges'][0]['node']['display_url'] ?? null;
            if (!is_array($node) || !is_string($code)
                || !preg_match('/^[A-Za-z0-9_-]+$/', $code)
                || !is_string($imageUrl) || !$this->isAllowedImageUrl($imageUrl)) {
                return null;
            }

            $isReel = ($node['is_video'] ?? false) || ($node['product_type'] ?? '') === 'clips';
            $posts[] = [
                'external_id' => $code,
                'order' => (string) ($index + 1),
                'image_url' => $imageUrl,
                'link' => 'https://www.instagram.com/'.($isReel ? 'reel' : 'p')."/{$code}/",
                'caption' => $node['edge_media_to_caption']['edges'][0]['node']['text'] ?? null,
                'timestamp' => $node['taken_at_timestamp'] ?? null,
            ];
        }

        return count(array_unique(array_column($posts, 'external_id'))) === count($posts)
            ? [
                'posts' => $posts,
                'complete' => !($connection['page_info']['has_next_page'] ?? false) || count($edges) >= $limit,
            ]
            : null;
    }

    private function preparePosts(array $posts, array &$downloadedPaths): array
    {
        $prepared = [];
        foreach ($posts as $post) {
            $existing = Instagram::where('source', 'instagram_public')
                ->where('external_id', $post['external_id'])
                ->first();
            $path = $existing?->getRawOriginal('image');

            if (!$this->isLocalImage($path) || !Storage::disk('public')->exists($path)) {
                $path = $this->downloadImage($post['image_url'], $post['external_id']);
                $downloadedPaths[] = $path;
            }

            $post['image'] = $path;
            $prepared[] = $post;
        }

        return $prepared;
    }

    private function downloadImage(string $imageUrl, string $externalId): string
    {
        if (!$this->isAllowedImageUrl($imageUrl)) {
            throw new RuntimeException('Una publicación tiene una imagen no válida.');
        }

        try {
            $response = Http::timeout(15)->withHeaders([
                'User-Agent' => $this->profileHeaders()['User-Agent'],
                'Accept' => 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
                'Referer' => 'https://www.instagram.com/',
            ])->get($imageUrl);
        } catch (Throwable $exception) {
            Log::warning('Falló la descarga de una imagen de Instagram.', [
                'external_id' => $externalId,
                'host' => parse_url($imageUrl, PHP_URL_HOST),
                'reason' => get_class($exception),
            ]);
            throw new RuntimeException('No se pudo descargar una imagen de Instagram.');
        }

        if (!$response->successful()) {
            Log::warning('Falló la descarga de una imagen de Instagram.', [
                'external_id' => $externalId,
                'host' => parse_url($imageUrl, PHP_URL_HOST),
                'status' => $response->status(),
            ]);
            throw new RuntimeException('No se pudo descargar una imagen de Instagram.');
        }

        $body = $response->body();
        $imageInfo = $body !== '' ? @getimagesizefromstring($body) : false;
        $extension = $imageInfo ? (self::IMAGE_TYPES[$imageInfo['mime'] ?? ''] ?? null) : null;
        if (!$extension) {
            throw new RuntimeException('Instagram devolvió una imagen no válida.');
        }

        $path = "instagram/{$externalId}.{$extension}";
        if (!Storage::disk('public')->put($path, $body) || !Storage::disk('public')->exists($path)) {
            throw new RuntimeException('No se pudo guardar una imagen de Instagram.');
        }

        return $path;
    }

    private function isAllowedImageUrl(string $url): bool
    {
        $parts = parse_url($url);
        $host = strtolower((string) ($parts['host'] ?? ''));

        return ($parts['scheme'] ?? null) === 'https'
            && ($host === 'scontent.cdninstagram.com'
                || str_ends_with($host, '.cdninstagram.com')
                || str_ends_with($host, '.fbcdn.net'));
    }

    private function isLocalImage(?string $path): bool
    {
        return is_string($path) && $path !== ''
            && !str_starts_with($path, 'http://') && !str_starts_with($path, 'https://');
    }

    private function getStoredPosts(int $limit): Collection
    {
        $synced = Instagram::where('source', 'instagram_public')->get()
            ->filter(fn (Instagram $post) => $this->hasStoredImage($post))
            ->sortBy(fn (Instagram $post) => (int) $post->order)
            ->take($limit)
            ->values();

        return $synced->isNotEmpty()
            ? $synced
            : Instagram::where('source', 'manual')
                ->orderBy('order')
                ->get()
                ->filter(fn (Instagram $post) => $this->hasStoredImage($post))
                ->take($limit)
                ->values();
    }

    private function hasStoredImage(Instagram $post): bool
    {
        $path = $post->getRawOriginal('image');

        return $this->isLocalImage($path) && Storage::disk('public')->exists($path);
    }

    private function logFetchFailure(string $endpoint, ?int $status, string $reason): void
    {
        Log::warning('No se pudo obtener el feed público de Instagram.', [
            'endpoint' => $endpoint,
            'status' => $status,
            'reason' => $reason,
        ]);
    }
}
