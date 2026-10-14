<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;

uses(RefreshDatabase::class);

it('returns a successful response', function () {
    Http::fake(['*' => Http::response('', 401)]);

    $response = $this->get('/');

    $response->assertStatus(200);
});
