<?php

namespace App\Services;

use App\Models\Instagram;
use Carbon\Carbon;
use Throwable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class InstagramFeedService
{
    public function getLatestPosts(int $limit = 8): Collection
    {
        $username = (string) config('services.instagram.public_username', 'sr.repuestos');
        $cacheMinutes = max((int) config('services.instagram.cache_minutes', 30), 1);
        $cacheKey = "instagram.feed.latest.{$username}.{$limit}";

        try {
            return Cache::store('database')->remember($cacheKey, now()->addMinutes($cacheMinutes), function () use ($limit, $username) {
                $this->syncLatestPosts($username, max($limit, 12));

                return $this->getStoredPosts($limit);
            });
        } catch (Throwable $e) {
            Log::warning('No se pudo resolver el feed de Instagram.', [
                'message' => $e->getMessage(),
                'username' => $username,
            ]);

            return $this->getStoredPosts($limit);
        }
    }

    public function syncLatestPosts(string $username, int $limit = 12): Collection
    {
        $posts = $this->fetchFromPublicEndpoint($username, $limit);

        if ($posts->isEmpty() && $this->isOfficialConfigured()) {
            $posts = $this->fetchFromOfficialApi($limit);
        }

        if ($posts->isEmpty()) {
            return collect();
        }

        foreach ($posts as $post) {
            $this->persistSyncedPost($post);
        }

        $this->pruneOldSyncedPosts($limit);

        return $this->getStoredPosts(min($limit, 8));
    }

    private function fetchFromPublicEndpoint(string $username, int $limit): Collection
    {
        $headers = [
            'X-IG-App-ID' => (string) config('services.instagram.public_app_id', '936619743392459'),
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
            'Accept' => 'application/json',
            'Accept-Language' => 'en-US,en;q=0.9',
            'Referer' => "https://www.instagram.com/{$username}/",
        ];

        $endpoints = [
            'https://www.instagram.com/api/v1/users/web_profile_info/',
            'https://i.instagram.com/api/v1/users/web_profile_info/',
        ];

        foreach ($endpoints as $endpoint) {
            $response = Http::timeout(10)
                ->withHeaders($headers)
                ->withOptions([
                    'curl' => [
                        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_2_0,
                        CURLOPT_ENCODING => '',
                    ],
                ])
                ->get($endpoint, [
                    'username' => $username,
                ]);

            if (!$response->successful()) {
                Log::warning('No se pudo obtener el feed publico de Instagram.', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'username' => $username,
                    'endpoint' => $endpoint,
                ]);

                continue;
            }

            $posts = $this->extractPublicPosts($response->json('data.user.edge_owner_to_timeline_media.edges', []), $limit);
            if ($posts->isNotEmpty()) {
                return $posts;
            }
        }

        return collect();
    }

    private function extractPublicPosts(array $edges, int $limit): Collection
    {
        return collect($edges)
            ->map(function (array $edge, int $index) {
                $node = $edge['node'] ?? [];
                $shortcode = $node['shortcode'] ?? null;
                $imageUrl = $node['display_url'] ?? $node['thumbnail_src'] ?? null;

                if (!$imageUrl && isset($node['edge_sidecar_to_children']['edges'][0]['node']['display_url'])) {
                    $imageUrl = $node['edge_sidecar_to_children']['edges'][0]['node']['display_url'];
                }

                if (!$shortcode || !$imageUrl) {
                    return null;
                }

                $captionEdges = $node['edge_media_to_caption']['edges'] ?? [];
                $caption = $captionEdges[0]['node']['text'] ?? null;

                return [
                    'external_id' => $shortcode,
                    'order' => (string) ($index + 1),
                    'image_url' => $imageUrl,
                    'link' => "https://www.instagram.com/p/{$shortcode}/",
                    'caption' => $caption,
                    'timestamp' => $node['taken_at_timestamp'] ?? null,
                ];
            })
            ->filter()
            ->take($limit)
            ->values();
    }

    private function fetchFromOfficialApi(int $limit): Collection
    {
        $url = sprintf(
            'https://graph.facebook.com/%s/%s/media',
            config('services.instagram.api_version', 'v22.0'),
            config('services.instagram.user_id')
        );

        $response = Http::timeout(10)->get($url, [
            'fields' => 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,children{media_type,media_url,thumbnail_url}',
            'access_token' => config('services.instagram.access_token'),
            'limit' => $limit,
        ]);

        if (!$response->successful()) {
            Log::warning('No se pudo obtener el feed de Instagram.', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return collect();
        }

        return collect($response->json('data', []))
            ->map(function (array $item, int $index) {
                $imageUrl = $this->resolveImageUrl($item);
                $link = $item['permalink'] ?? null;
                $externalId = $this->extractExternalIdFromLink($link) ?? ($item['id'] ?? null);

                if (!$imageUrl || !$link || !$externalId) {
                    return null;
                }

                return [
                    'external_id' => (string) $externalId,
                    'order' => (string) ($index + 1),
                    'image_url' => $imageUrl,
                    'link' => $link,
                    'caption' => $item['caption'] ?? null,
                    'timestamp' => $item['timestamp'] ?? null,
                ];
            })
            ->filter()
            ->take($limit)
            ->values();
    }

    private function resolveImageUrl(array $item): ?string
    {
        $mediaType = $item['media_type'] ?? null;

        if ($mediaType === 'VIDEO') {
            return $item['thumbnail_url'] ?? null;
        }

        if ($mediaType === 'CAROUSEL_ALBUM') {
            $children = collect($item['children']['data'] ?? []);
            $firstChild = $children->first();

            if (!$firstChild) {
                return $item['media_url'] ?? null;
            }

            return $firstChild['thumbnail_url'] ?? $firstChild['media_url'] ?? $item['media_url'] ?? null;
        }

        return $item['media_url'] ?? null;
    }

    private function getStoredPosts(int $limit): Collection
    {
        $synced = Instagram::where('source', 'instagram_public')
            ->orderByDesc('published_at')
            ->limit($limit)
            ->get();

        if ($synced->isNotEmpty()) {
            return $synced;
        }

        return $this->getManualPosts($limit);
    }

    private function getManualPosts(int $limit): Collection
    {
        return Instagram::where('source', 'manual')
            ->orderBy('order', 'asc')
            ->limit($limit)
            ->get();
    }

    private function persistSyncedPost(array $post): Instagram
    {
        $publishedAt = !empty($post['timestamp']) ? Carbon::createFromTimestamp((int) $post['timestamp']) : null;
        $existing = Instagram::where('source', 'instagram_public')
            ->where('external_id', $post['external_id'])
            ->first();

        if ($existing) {
            $existing->forceFill([
                'order' => $post['order'] ?? $existing->order,
                'link' => $post['link'] ?? $existing->link,
                'caption' => $post['caption'] ?? $existing->caption,
                'published_at' => $publishedAt ?? $existing->published_at,
            ]);

            if (!$existing->image || str_starts_with((string) $existing->image, 'http://') || str_starts_with((string) $existing->image, 'https://')) {
                $existing->image = $this->downloadImageToStorage($post['image_url'], $post['external_id']);
            }

            $existing->save();

            return $existing;
        }

        $instagram = new Instagram();
        $instagram->source = 'instagram_public';
        $instagram->external_id = $post['external_id'];
        $instagram->order = $post['order'] ?? 'zzz';
        $instagram->image = $this->downloadImageToStorage($post['image_url'], $post['external_id']);
        $instagram->link = $post['link'] ?? null;
        $instagram->caption = $post['caption'] ?? null;
        $instagram->published_at = $publishedAt;
        $instagram->save();

        return $instagram;
    }

    private function downloadImageToStorage(string $imageUrl, string $externalId): string
    {
        $response = Http::timeout(20)
            ->withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
                'Accept' => 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Referer' => 'https://www.instagram.com/',
            ])
            ->withOptions([
                'curl' => [
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_2_0,
                    CURLOPT_ENCODING => '',
                ],
            ])
            ->get($imageUrl);

        if (!$response->successful()) {
            Log::warning('No se pudo descargar la imagen de Instagram.', [
                'status' => $response->status(),
                'url' => $imageUrl,
                'external_id' => $externalId,
            ]);

            return $this->fallbackImagePath($externalId);
        }

        $path = "instagram/{$externalId}.jpg";
        Storage::disk('public')->put($path, $response->body());

        return $path;
    }

    private function fallbackImagePath(string $externalId): string
    {
        return "instagram/{$externalId}.jpg";
    }

    private function pruneOldSyncedPosts(int $keepCount): void
    {
        $syncedIds = Instagram::where('source', 'instagram_public')
            ->orderByDesc('published_at')
            ->pluck('id');

        $toDelete = $syncedIds->slice($keepCount)->values();

        if ($toDelete->isNotEmpty()) {
            Instagram::whereIn('id', $toDelete)->delete();
        }
    }

    private function extractExternalIdFromLink(?string $link): ?string
    {
        if (!$link) {
            return null;
        }

        if (preg_match('#instagram\.com/(p|reel)/([^/?]+)#', $link, $matches)) {
            return $matches[2];
        }

        return null;
    }

    private function isOfficialConfigured(): bool
    {
        return filled(config('services.instagram.user_id'))
            && filled(config('services.instagram.access_token'));
    }
}
