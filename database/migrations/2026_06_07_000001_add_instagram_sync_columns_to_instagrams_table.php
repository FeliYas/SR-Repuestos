<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('instagrams', 'source')) {
            Schema::table('instagrams', function (Blueprint $table) {
                $table->string('source')->default('manual')->index()->after('order');
            });
        }

        if (!Schema::hasColumn('instagrams', 'external_id')) {
            Schema::table('instagrams', function (Blueprint $table) {
                $table->string('external_id')->nullable()->index()->after('source');
            });
        }

        if (!Schema::hasColumn('instagrams', 'caption')) {
            Schema::table('instagrams', function (Blueprint $table) {
                $table->text('caption')->nullable()->after('link');
            });
        }

        if (!Schema::hasColumn('instagrams', 'published_at')) {
            Schema::table('instagrams', function (Blueprint $table) {
                $table->timestamp('published_at')->nullable()->index()->after('caption');
            });
        }

        DB::table('instagrams')
            ->whereNull('source')
            ->update(['source' => 'manual']);
    }

    public function down(): void
    {
        Schema::table('instagrams', function (Blueprint $table) {
            $table->dropIndex(['source']);
            $table->dropIndex(['external_id']);
            $table->dropIndex(['published_at']);
            $table->dropColumn(['source', 'external_id', 'caption', 'published_at']);
        });
    }
};
