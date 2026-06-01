<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('marca_productos', function (Blueprint $table) {
            if (!Schema::hasColumn('marca_productos', 'image')) {
                $table->string('image')->nullable()->after('name');
            }
        });

        if (Schema::hasTable('productos')) {
            $marcaIds = DB::table('marca_productos')->pluck('id');
            if ($marcaIds->isEmpty()) {
                DB::table('productos')->update(['marca_id' => null]);
            } else {
                DB::table('productos')
                    ->whereNotNull('marca_id')
                    ->whereNotIn('marca_id', $marcaIds)
                    ->update(['marca_id' => null]);
            }

            Schema::table('productos', function (Blueprint $table) {
                $table->dropForeign(['marca_id']);
                $table->foreign('marca_id')
                    ->references('id')
                    ->on('marca_productos')
                    ->cascadeOnDelete();
            });
        }

        Schema::dropIfExists('marcas');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('marcas', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('order')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });

        if (Schema::hasTable('productos')) {
            Schema::table('productos', function (Blueprint $table) {
                $table->dropForeign(['marca_id']);
                $table->foreign('marca_id')
                    ->references('id')
                    ->on('marcas')
                    ->cascadeOnDelete();
            });
        }

        Schema::table('marca_productos', function (Blueprint $table) {
            if (Schema::hasColumn('marca_productos', 'image')) {
                $table->dropColumn('image');
            }
        });
    }
};
