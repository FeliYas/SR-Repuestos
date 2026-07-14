<?php

namespace App\Http\Controllers;

use App\Models\Instagram;
use App\Services\InstagramFeedService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class InstagramController extends Controller
{
    public function proxyImage(string $encoded)
    {
        $url = $this->decodeBase64Url($encoded);
        if (!$url || !$this->isAllowedInstagramHost($url)) {
            abort(404);
        }

        $response = Http::timeout(10)
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
            ->get($url);

        if (!$response->successful()) {
            abort(404);
        }

        $contentType = $response->header('Content-Type', 'image/jpeg');

        return response($response->body(), 200)
            ->header('Content-Type', $contentType)
            ->header('Cache-Control', 'public, max-age=900');
    }

    private function decodeBase64Url(string $value): ?string
    {
        $padding = strlen($value) % 4;
        if ($padding > 0) {
            $value .= str_repeat('=', 4 - $padding);
        }

        $decoded = base64_decode(strtr($value, '-_', '+/'), true);

        return is_string($decoded) ? $decoded : null;
    }

    private function isAllowedInstagramHost(string $url): bool
    {
        $parts = parse_url($url);
        $scheme = $parts['scheme'] ?? null;
        $host = strtolower($parts['host'] ?? '');

        if ($scheme !== 'https' || $host === '') {
            return false;
        }

        return str_ends_with($host, '.fbcdn.net')
            || str_ends_with($host, '.cdninstagram.com')
            || $host === 'scontent.cdninstagram.com';
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $instagrams = Instagram::orderBy('order', 'asc')->get();

        return Inertia::render('admin/instagramAdmin', ['publicaciones' => $instagrams]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'order' => 'sometimes|string|max:255',
            'image' => 'required|file',
            'link' => 'required|string|max:255',
        ]);

        // Handle file upload if image exists
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('images', 'public');
        }

        Instagram::create($data);

        app(InstagramFeedService::class)->clearLatestPostsCache();

        return redirect()->back()->with('success', 'Instagram created successfully.');
    }





    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $instagram = Instagram::findOrFail($request->id);

        // Check if the Instagram entry exists
        if (!$instagram) {
            return redirect()->back()->with('error', 'Instagram not found.');
        }

        // Validate the request data
        $data = $request->validate([
            'order' => 'sometimes|string|max:255',
            'image' => 'sometimes|file',
            'link' => 'sometimes|string|max:255',
        ]);

        // Handle file upload if image exists
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($instagram->image) {
                $absolutePath = public_path('storage/' . $instagram->image);
                if (file_exists($absolutePath)) {
                    unlink($absolutePath);
                }
            }
            $data['image'] = $request->file('image')->store('images', 'public');
        }

        $instagram->update($data);

        app(InstagramFeedService::class)->clearLatestPostsCache();

        return redirect()->back()->with('success', 'Instagram updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $instagram = Instagram::findOrFail($request->id);

        // Check if the Instagram entry exists
        if (!$instagram) {
            return redirect()->back()->with('error', 'Instagram not found.');
        }
        // Delete the image if it exists
        if ($instagram->image) {
            $absolutePath = public_path('storage/' . $instagram->image);
            if (file_exists($absolutePath)) {
                unlink($absolutePath);
            }
        }

        $instagram->delete();

        app(InstagramFeedService::class)->clearLatestPostsCache();

        return redirect()->back()->with('success', 'Instagram deleted successfully.');
    }
}
