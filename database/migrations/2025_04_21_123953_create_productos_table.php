<?php

use App\Models\Categoria;
use App\Models\ImagenProducto;
use App\Models\Marca;
use App\Models\MarcaProducto;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('order')->default("zzz");
            $table->string('name')->nullable();
            $table->string('code')->nullable();
            $table->foreignIdFor(Categoria::class, 'categoria_id')->nullable()
                ->constrained('categorias')
                ->cascadeOnDelete();
            $table->foreignIdFor(MarcaProducto::class, 'marca_id')->nullable()
                ->constrained('marcas')
                ->cascadeOnDelete();
            $table->string('ficha_tecnica')->nullable();
            $table->string('aplicacion')->nullable();
            $table->string('anio')->nullable();
            $table->string('num_original')->nullable();
            $table->string('tonelaje')->nullable();
            $table->string('espigon')->nullable();
            $table->string('bujes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
