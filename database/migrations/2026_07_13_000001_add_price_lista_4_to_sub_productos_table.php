<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sub_productos', function (Blueprint $table) {
            $table->decimal('price_lista_4', 10, 2)->default(0)->after('price_dist');
        });
    }

    public function down(): void
    {
        Schema::table('sub_productos', function (Blueprint $table) {
            $table->dropColumn('price_lista_4');
        });
    }
};
