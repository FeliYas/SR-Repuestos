<?php

use App\Models\Instagram;
use App\Services\InstagramFeedService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('sync removes instagram_public posts that are no longer present in the latest instagram feed', function () {
    Storage::fake('public');

    Instagram::create([
        'source' => 'instagram_public',
        'external_id' => 'old-post',
        'order' => '1',
        'image' => 'instagram/old-post.jpg',
        'link' => 'https://www.instagram.com/p/old-post/',
        'published_at' => now()->subDay(),
    ]);

    Http::fake([
        'https://www.instagram.com/api/v1/users/web_profile_info/*' => Http::response([
            'data' => [
                'user' => [
                    'edge_owner_to_timeline_media' => [
                        'edges' => [[
                            'node' => [
                                'shortcode' => 'new-post',
                                'display_url' => 'https://cdn.example.com/new-post.jpg',
                                'edge_media_to_caption' => [
                                    'edges' => [],
                                ],
                                'taken_at_timestamp' => now()->timestamp,
                            ],
                        ]],
                    ],
                ],
            ],
        ]),
        'https://cdn.example.com/*' => Http::response('fake-image-bytes', 200, ['Content-Type' => 'image/jpeg']),
    ]);

    $posts = app(InstagramFeedService::class)->syncLatestPosts('sr.repuestos', 12);

    expect($posts)->toHaveCount(1);
    expect(Instagram::where('source', 'instagram_public')->pluck('external_id')->all())
        ->toBe(['new-post']);
    Storage::disk('public')->assertExists('instagram/new-post.jpg');
});
