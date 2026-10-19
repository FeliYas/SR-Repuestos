<?php

use App\Models\Admin;
use App\Models\Instagram;
use App\Services\InstagramFeedService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function instagramProfileHtml(array $nodes, bool $hasNextPage = false): string
{
    $payload = [
        'require' => [[
            'data' => [
                'xig_user_by_username' => [
                    'pk' => '29230060917',
                    'polaris_ordered_timeline_connection' => [
                        'edges' => array_map(fn (array $node) => ['node' => $node], $nodes),
                        'page_info' => ['has_next_page' => $hasNextPage],
                    ],
                ],
            ],
        ]],
    ];

    return '<html><script type="application/json" data-sjs>'.json_encode($payload).'</script></html>';
}

function instagramNode(string $code, string $type = 'XIGPolarisImageMedia'): array
{
    return [
        'code' => $code,
        '__typename' => $type,
        'display_uri' => "https://scontent.cdninstagram.com/{$code}.png",
        'caption' => ['text' => "Texto {$code}"],
        'user' => ['pk' => '29230060917', 'username' => 'sr.repuestos'],
    ];
}

function instagramPng(): string
{
    $image = imagecreatetruecolor(1, 1);
    ob_start();
    imagepng($image);
    $bytes = ob_get_clean();
    imagedestroy($image);

    return $bytes;
}

function storedInstagramPost(string $code): Instagram
{
    Storage::disk('public')->put("instagram/{$code}.png", instagramPng());

    return Instagram::create([
        'source' => 'instagram_public',
        'external_id' => $code,
        'order' => '1',
        'image' => "instagram/{$code}.png",
        'link' => "https://www.instagram.com/p/{$code}/",
    ]);
}

test('sync reads public profile images reels and carousels and stores their images locally', function () {
    Storage::fake('public');
    $nodes = [
        instagramNode('image-post'),
        instagramNode('reel-post', 'XIGPolarisVideoMedia'),
        instagramNode('carousel-post', 'XIGPolarisCarouselMedia'),
    ];

    Http::fake([
        'https://www.instagram.com/sr.repuestos/' => Http::response(instagramProfileHtml($nodes), 200, ['Content-Type' => 'text/html']),
        'https://scontent.cdninstagram.com/*' => Http::response(instagramPng(), 200, ['Content-Type' => 'image/png']),
    ]);

    $posts = app(InstagramFeedService::class)->syncLatestPosts('sr.repuestos', 12);

    expect($posts->pluck('external_id')->all())->toBe(['image-post', 'reel-post', 'carousel-post']);
    expect(Instagram::where('external_id', 'reel-post')->value('link'))->toBe('https://www.instagram.com/reel/reel-post/');
    expect(Instagram::where('external_id', 'carousel-post')->value('link'))->toBe('https://www.instagram.com/p/carousel-post/');
    foreach (['image-post', 'reel-post', 'carousel-post'] as $code) {
        Storage::disk('public')->assertExists("instagram/{$code}.png");
    }
});

test('public data provider imports photos reels and carousels without using Meta API', function () {
    Storage::fake('public');
    config()->set('services.instagram.scrapecreators_key', 'test-key');

    Http::fake([
        'https://api.scrapecreators.com/v2/instagram/user/posts*' => Http::response([
            'success' => true, 'more_available' => true, 'items' => [
                ['code' => 'photo-code', 'media_type' => 1, 'image_versions2' => ['candidates' => [['url' => 'https://scontent.cdninstagram.com/photo.png']]], 'caption' => ['text' => 'Foto'], 'taken_at' => 1792411200],
                ['code' => 'reel-code', 'media_type' => 2, 'product_type' => 'clips', 'image_versions2' => ['candidates' => [['url' => 'https://scontent.cdninstagram.com/reel.png']]]],
                ['code' => 'carousel-code', 'media_type' => 8, 'carousel_media' => [['image_versions2' => ['candidates' => [['url' => 'https://scontent.cdninstagram.com/carousel.png']]]]]],
            ],
        ]),
        'https://scontent.cdninstagram.com/*' => Http::response(instagramPng(), 200, ['Content-Type' => 'image/png']),
    ]);

    $posts = app(InstagramFeedService::class)->syncLatestPosts('sr.repuestos', 12);

    expect($posts->pluck('external_id')->all())->toBe(['photo-code', 'reel-code', 'carousel-code']);
    expect(Instagram::where('external_id', 'photo-code')->first()->published_at)->not->toBeNull();
    expect(Instagram::where('external_id', 'reel-code')->value('link'))->toBe('https://www.instagram.com/reel/reel-code/');
    foreach (['photo-code', 'reel-code', 'carousel-code'] as $code) {
        Storage::disk('public')->assertExists("instagram/{$code}.png");
    }
    Http::assertSent(fn ($request) => str_contains($request->url(), 'api.scrapecreators.com')
        && $request->hasHeader('x-api-key', 'test-key'));
    Http::assertNotSent(fn ($request) => str_contains($request->url(), 'graph.instagram.com')
        || str_contains($request->url(), 'www.instagram.com/sr.repuestos'));
});

test('public data provider failure preserves locally stored publications', function () {
    Storage::fake('public');
    storedInstagramPost('old-post');
    config()->set('services.instagram.scrapecreators_key', 'test-key');
    Http::fake(['https://api.scrapecreators.com/*' => Http::response(['success' => false], 500)]);

    $posts = app(InstagramFeedService::class)->syncLatestPosts('sr.repuestos', 12);

    expect($posts->pluck('external_id')->all())->toBe(['old-post']);
    expect(app(InstagramFeedService::class)->getSyncStatus()['message'])->toContain('proveedor');
    Http::assertSentCount(1);
});

test('public rate limit delays automatic retries while keeping manual retry available', function () {
    Storage::fake('public');
    storedInstagramPost('old-post');
    Http::fake([
        'https://www.instagram.com/sr.repuestos/' => Http::response('blocked', 429),
        'https://www.instagram.com/api/v1/users/web_profile_info/*' => Http::response([], 429),
        'https://i.instagram.com/api/v1/users/web_profile_info/*' => Http::response([], 429),
    ]);

    $service = app(InstagramFeedService::class);
    $service->getLatestPosts();
    expect($service->getSyncStatus()['message'])->toContain('limitó');

    $this->travel(61)->minutes();
    $service->getLatestPosts();
    Http::assertSentCount(1);

    $service->syncLatestPosts('sr.repuestos');
    Http::assertSentCount(2);
});

test('adding a public data provider key bypasses an earlier rate limit pause', function () {
    Storage::fake('public');
    Cache::store('database')->forever('instagram.feed.status.sr.repuestos', [
        'last_attempt_at' => now()->toIso8601String(),
        'last_success_at' => null,
        'result' => 'failed',
        'message' => 'Instagram limitó temporalmente el acceso público.',
        'count' => 0,
        'retry_after_at' => now()->addHours(6)->toIso8601String(),
        'access_mode' => 'public',
    ]);
    config()->set('services.instagram.scrapecreators_key', 'test-key');
    Http::fake([
        'https://api.scrapecreators.com/*' => Http::response(['success' => true, 'more_available' => false, 'items' => [[
            'code' => 'new-post',
            'media_type' => 1,
            'image_versions2' => ['candidates' => [['url' => 'https://scontent.cdninstagram.com/new.png']]],
        ]]]),
        'https://scontent.cdninstagram.com/*' => Http::response(instagramPng(), 200, ['Content-Type' => 'image/png']),
    ]);

    expect(app(InstagramFeedService::class)->getLatestPosts()->pluck('external_id')->all())->toBe(['new-post']);
});

test('a failed public request keeps the last synced image and feed', function () {
    Storage::fake('public');
    storedInstagramPost('old-post');

    Http::fake([
        'https://www.instagram.com/sr.repuestos/' => Http::response('blocked', 401),
        'https://www.instagram.com/api/v1/users/web_profile_info/*' => Http::response([], 401),
        'https://i.instagram.com/api/v1/users/web_profile_info/*' => Http::response([], 401),
    ]);

    $posts = app(InstagramFeedService::class)->syncLatestPosts('sr.repuestos', 12);

    expect($posts->pluck('external_id')->all())->toBe(['old-post']);
    Storage::disk('public')->assertExists('instagram/old-post.png');
});

test('a partial public page adds new posts without pruning stored posts', function () {
    Storage::fake('public');
    storedInstagramPost('old-post');

    Http::fake([
        'https://www.instagram.com/sr.repuestos/' => Http::response(instagramProfileHtml([instagramNode('new-post')], true)),
        'https://www.instagram.com/api/v1/users/web_profile_info/*' => Http::response([], 401),
        'https://i.instagram.com/api/v1/users/web_profile_info/*' => Http::response([], 401),
        'https://scontent.cdninstagram.com/*' => Http::response(instagramPng(), 200, ['Content-Type' => 'image/png']),
    ]);

    app(InstagramFeedService::class)->syncLatestPosts('sr.repuestos', 12);

    expect(app(InstagramFeedService::class)->getLatestPosts(8)->pluck('external_id')->all())
        ->toBe(['new-post', 'old-post']);
    expect(app(InstagramFeedService::class)->getSyncStatus()['message'])->toContain('feed recibido fue parcial');
});

test('an invalid downloaded image cannot replace the last good feed', function () {
    Storage::fake('public');
    storedInstagramPost('old-post');

    Http::fake([
        'https://www.instagram.com/sr.repuestos/' => Http::response(instagramProfileHtml([instagramNode('new-post')])),
        'https://scontent.cdninstagram.com/*' => Http::response('not an image', 200, ['Content-Type' => 'text/html']),
    ]);

    app(InstagramFeedService::class)->syncLatestPosts('sr.repuestos', 12);

    expect(Instagram::where('source', 'instagram_public')->pluck('external_id')->all())->toBe(['old-post']);
    Storage::disk('public')->assertMissing('instagram/new-post.png');
});

test('one failed image does not block the other new posts or erase the saved feed', function () {
    Storage::fake('public');
    storedInstagramPost('old-post');
    Http::fake([
        'https://www.instagram.com/sr.repuestos/' => Http::response(instagramProfileHtml([
            instagramNode('good-post'),
            instagramNode('bad-post'),
        ])),
        'https://scontent.cdninstagram.com/good-post.png' => Http::response(instagramPng(), 200, ['Content-Type' => 'image/png']),
        'https://scontent.cdninstagram.com/bad-post.png' => Http::response('blocked', 403),
    ]);

    $posts = app(InstagramFeedService::class)->syncLatestPosts('sr.repuestos', 12);

    expect($posts->pluck('external_id')->all())->toBe(['good-post', 'old-post']);
    expect(Instagram::where('external_id', 'bad-post')->exists())->toBeFalse();
    expect(app(InstagramFeedService::class)->getSyncStatus()['message'])->toContain('parcial');
});

test('manual posts remain visible when no usable automatic post exists', function () {
    Storage::fake('public');
    Instagram::create(['source' => 'manual', 'order' => '1', 'image' => 'images/manual.png', 'link' => 'https://www.instagram.com/']);
    Storage::disk('public')->put('images/manual.png', instagramPng());
    Http::fake([
        'https://www.instagram.com/sr.repuestos/' => Http::response('blocked', 401),
        'https://www.instagram.com/api/v1/users/web_profile_info/*' => Http::response([], 401),
        'https://i.instagram.com/api/v1/users/web_profile_info/*' => Http::response([], 401),
    ]);

    expect(app(InstagramFeedService::class)->getLatestPosts(8)->pluck('source')->all())->toBe(['manual']);
});

test('new manual posts are shown ahead of a stale automatic feed', function () {
    Storage::fake('public');
    storedInstagramPost('old-post');
    Storage::disk('public')->put('images/manual-new.png', instagramPng());
    Storage::disk('public')->put('images/manual-old.png', instagramPng());

    Instagram::create([
        'source' => 'manual',
        'order' => '1',
        'image' => 'images/manual-new.png',
        'link' => 'https://www.instagram.com/p/new-post/',
    ]);
    Instagram::create([
        'source' => 'manual',
        'order' => '2',
        'image' => 'images/manual-old.png',
        'link' => 'https://www.instagram.com/p/old-manual/',
        'created_at' => now()->subDays(2),
    ]);
    Cache::store('database')->forever('instagram.feed.status.sr.repuestos', [
        'last_attempt_at' => now()->toIso8601String(),
        'last_success_at' => now()->subDay()->toIso8601String(),
        'result' => 'failed',
        'message' => 'Instagram no está disponible.',
        'count' => 0,
    ]);

    expect(app(InstagramFeedService::class)->getLatestPosts(8)->pluck('link')->all())->toBe([
        'https://www.instagram.com/p/new-post/',
        'https://www.instagram.com/p/old-post/',
    ]);
});

test('a successful check of an outdated feed keeps newer manual posts visible', function () {
    Storage::fake('public');
    $old = storedInstagramPost('old-post');
    $old->update(['published_at' => now()->subDays(5)]);
    Storage::disk('public')->put('images/manual-new.png', instagramPng());
    Instagram::create([
        'source' => 'manual',
        'order' => '1',
        'image' => 'images/manual-new.png',
        'link' => 'https://www.instagram.com/p/new-post/',
        'created_at' => now()->subHour(),
    ]);
    Cache::store('database')->forever('instagram.feed.status.sr.repuestos', [
        'last_attempt_at' => now()->toIso8601String(),
        'last_success_at' => now()->toIso8601String(),
        'result' => 'success',
        'message' => 'Sin novedades.',
        'count' => 1,
    ]);

    expect(app(InstagramFeedService::class)->getLatestPosts()->pluck('link')->all())->toBe([
        'https://www.instagram.com/p/new-post/',
        'https://www.instagram.com/p/old-post/',
    ]);
});

test('admin can force a sync and inspect its outcome while visitors cannot', function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
    Storage::fake('public');
    Http::fake([
        'https://www.instagram.com/sr.repuestos/' => Http::response(instagramProfileHtml([instagramNode('new-post')])),
        'https://scontent.cdninstagram.com/*' => Http::response(instagramPng(), 200, ['Content-Type' => 'image/png']),
    ]);

    $this->post(route('admin.instagram.sync'))->assertRedirect(route('login'));

    $admin = Admin::create(['name' => 'Administrador', 'password' => Hash::make('password')]);
    $this->actingAs($admin, 'admin')->post(route('admin.instagram.sync'))->assertRedirect();

    $status = app(InstagramFeedService::class)->getSyncStatus();
    expect($status['result'])->toBe('success')
        ->and($status['last_attempt_at'])->not->toBeNull()
        ->and($status['last_success_at'])->not->toBeNull();
    expect(Instagram::where('external_id', 'new-post')->exists())->toBeTrue();
    $this->get(route('admin.instagram'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/instagramAdmin')
            ->where('syncStatus.result', 'success')
            ->where('syncStatus.count', 1));
});

test('homepage retries only after one hour and manual sync bypasses that interval', function () {
    Storage::fake('public');
    Cache::store('database')->flush();
    Http::fake([
        'https://www.instagram.com/sr.repuestos/' => Http::response(instagramProfileHtml([instagramNode('new-post')])),
        'https://scontent.cdninstagram.com/*' => Http::response(instagramPng(), 200, ['Content-Type' => 'image/png']),
    ]);

    $service = app(InstagramFeedService::class);
    $service->getLatestPosts(8);
    $service->getLatestPosts(8);
    Http::assertSentCount(2);

    $this->travel(61)->minutes();
    $service->getLatestPosts(8);
    Http::assertSentCount(3);

    $service->syncLatestPosts('sr.repuestos', 12);
    Http::assertSentCount(4);
});

test('a complete legacy public response remains an alternative when the profile page fails', function () {
    Storage::fake('public');
    Http::fake([
        'https://www.instagram.com/sr.repuestos/' => Http::response('blocked', 401),
        'https://www.instagram.com/api/v1/users/web_profile_info/*' => Http::response([
            'data' => ['user' => ['edge_owner_to_timeline_media' => [
                'edges' => [['node' => [
                    'shortcode' => 'legacy-post',
                    'display_url' => 'https://scontent.cdninstagram.com/legacy-post.png',
                    'edge_media_to_caption' => ['edges' => []],
                ]]],
                'page_info' => ['has_next_page' => false],
            ]]],
        ]),
        'https://scontent.cdninstagram.com/*' => Http::response(instagramPng(), 200, ['Content-Type' => 'image/png']),
    ]);

    $posts = app(InstagramFeedService::class)->syncLatestPosts('sr.repuestos', 12);

    expect($posts->pluck('external_id')->all())->toBe(['legacy-post']);
    Storage::disk('public')->assertExists('instagram/legacy-post.png');
});

test('an empty public feed does not erase the last valid feed', function () {
    Storage::fake('public');
    storedInstagramPost('old-post');
    Http::fake([
        'https://www.instagram.com/sr.repuestos/' => Http::response(instagramProfileHtml([])),
        'https://www.instagram.com/api/v1/users/web_profile_info/*' => Http::response([
            'data' => ['user' => ['edge_owner_to_timeline_media' => ['edges' => []]]],
        ]),
        'https://i.instagram.com/api/v1/users/web_profile_info/*' => Http::response([], 401),
    ]);

    $posts = app(InstagramFeedService::class)->syncLatestPosts('sr.repuestos', 12);

    expect($posts->pluck('external_id')->all())->toBe(['old-post']);
    expect(app(InstagramFeedService::class)->getSyncStatus()['result'])->toBe('failed');
});

test('admin lists synced posts in numeric feed order', function () {
    $admin = Admin::create(['name' => 'Administrador', 'password' => Hash::make('password')]);
    foreach ([10, 2, 1] as $order) {
        Instagram::create([
            'source' => 'instagram_public',
            'external_id' => "post-{$order}",
            'order' => (string) $order,
            'image' => "instagram/post-{$order}.png",
            'link' => "https://www.instagram.com/p/post-{$order}/",
        ]);
    }

    $this->actingAs($admin, 'admin')->get(route('admin.instagram'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('publicaciones.0.order', '1')
            ->where('publicaciones.1.order', '2')
            ->where('publicaciones.2.order', '10'));
});

test('a complete valid feed replaces stale synced posts only after images are stored', function () {
    Storage::fake('public');
    storedInstagramPost('old-post');
    Http::fake([
        'https://www.instagram.com/sr.repuestos/' => Http::response(instagramProfileHtml([instagramNode('new-post')])),
        'https://scontent.cdninstagram.com/*' => Http::response(instagramPng(), 200, ['Content-Type' => 'image/png']),
    ]);

    app(InstagramFeedService::class)->syncLatestPosts('sr.repuestos', 12);

    expect(Instagram::where('source', 'instagram_public')->pluck('external_id')->all())->toBe(['new-post']);
    Storage::disk('public')->assertExists('instagram/new-post.png');
    Storage::disk('public')->assertMissing('instagram/old-post.png');
});

test('a collaborator post shown on the account profile is synchronized', function () {
    Storage::fake('public');
    $collaboration = instagramNode('collab-post');
    $collaboration['user'] = ['pk' => 'another-account', 'username' => 'partner.account'];

    Http::fake([
        'https://www.instagram.com/sr.repuestos/' => Http::response(instagramProfileHtml([$collaboration])),
        'https://scontent.cdninstagram.com/*' => Http::response(instagramPng(), 200, ['Content-Type' => 'image/png']),
    ]);

    app(InstagramFeedService::class)->syncLatestPosts('sr.repuestos', 12);

    expect(Instagram::where('external_id', 'collab-post')->exists())->toBeTrue();
    Storage::disk('public')->assertExists('instagram/collab-post.png');
});

test('failed manual synchronization explains that Instagram was unreachable', function () {
    Storage::fake('public');
    storedInstagramPost('old-post');

    Http::fake(function () {
        throw new \Illuminate\Http\Client\ConnectionException('Connection timed out');
    });

    app(InstagramFeedService::class)->syncLatestPosts('sr.repuestos', 12);

    $status = app(InstagramFeedService::class)->getSyncStatus();
    expect($status['result'])->toBe('failed')
        ->and($status['message'])->toContain('conectar con Instagram')
        ->and(Instagram::where('external_id', 'old-post')->exists())->toBeTrue();
});

test('a successful manual check reports when the public feed has no new post', function () {
    Storage::fake('public');
    storedInstagramPost('old-post');

    Http::fake([
        'https://www.instagram.com/sr.repuestos/' => Http::response(instagramProfileHtml([instagramNode('old-post')])),
    ]);

    app(InstagramFeedService::class)->syncLatestPosts('sr.repuestos', 12);

    $status = app(InstagramFeedService::class)->getSyncStatus();
    expect($status['result'])->toBe('success')
        ->and($status['message'])->toContain('no se encontraron publicaciones nuevas');
});
