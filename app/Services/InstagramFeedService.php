<?php

namespace App\Services;

use App\Models\Instagram;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class InstagramFeedService
{
    public function getLatestPosts(int $limit = 8): Collection
    {
        $username = (string) config('services.instagram.public_username', 'sr.repuestos');

        $cacheMinutes = max((int) config('services.instagram.cache_minutes', 30), 1);
        $cacheKey = "instagram.feed.latest.{$username}.{$limit}";

        return Cache::remember($cacheKey, now()->addMinutes($cacheMinutes), function () use ($limit, $username) {
            $posts = $this->fetchFromPublicEndpoint($username, $limit);

            if ($posts->isNotEmpty()) {
                return $posts;
            }

            if ($this->isOfficialConfigured()) {
                $posts = $this->fetchFromOfficialApi($limit);
                if ($posts->isNotEmpty()) {
                    return $posts;
                }
            }

            return $this->getManualPosts($limit);
        });
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
                Log::warning('No se pudo obtener el feed público de Instagram.', [
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
                $image = $node['display_url'] ?? $node['thumbnail_src'] ?? null;

                if (!$image && isset($node['edge_sidecar_to_children']['edges'][0]['node']['display_url'])) {
                    $image = $node['edge_sidecar_to_children']['edges'][0]['node']['display_url'];
                }

                if (!$shortcode || !$image) {
                    return null;
                }

                $captionEdges = $node['edge_media_to_caption']['edges'] ?? [];
                $caption = $captionEdges[0]['node']['text'] ?? null;

                return [
                    'id' => $node['id'] ?? null,
                    'order' => (string) ($index + 1),
                    'image' => $this->proxiedImageUrl($image),
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

        $items = collect($response->json('data', []))
            ->map(function (array $item, int $index) {
                $image = $this->resolveImageUrl($item);
                $link = $item['permalink'] ?? null;

                if (!$image || !$link) {
                    return null;
                }

                return [
                    'id' => $item['id'] ?? null,
                    'order' => (string) ($index + 1),
                    'image' => $this->proxiedImageUrl($image),
                    'link' => $link,
                    'caption' => $item['caption'] ?? null,
                    'timestamp' => $item['timestamp'] ?? null,
                ];
            })
            ->filter()
            ->values();

        return $items;
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

    private function getManualPosts(int $limit): Collection
    {
        return Instagram::orderBy('order', 'asc')
            ->limit($limit)
            ->get();
    }

    private function isOfficialConfigured(): bool
    {
        return filled(config('services.instagram.user_id'))
            && filled(config('services.instagram.access_token'));
    }

    private function proxiedImageUrl(string $imageUrl): string
    {
        $encoded = rtrim(strtr(base64_encode($imageUrl), '+/', '-_'), '=');

        return route('instagram.image.proxy', ['encoded' => $encoded]);
    }
}
