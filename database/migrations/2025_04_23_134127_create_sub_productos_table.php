<?php

use App\Models\Producto;
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
        Schema::create('sub_productos', function (Blueprint $table) {
            $table->id();
            $table->string('code')->nullable();
            $table->foreignIdFor(Producto::class, 'producto_id')->nullable()->constrained('productos')->onDelete('cascade');
            $table->string('description')->nullable();
            $table->string('order')->default("zzz");
            $table->string('image')->nullable();
            $table->string('medida')->nullable();
            $table->string('componente')->nullable();
            $table->string('caracteristicas')->nullable();
            $table->decimal('price_mayorista', 10, 2)->default(0);
            $table->decimal('price_minorista', 10, 2)->default(0);
            $table->decimal('price_dist', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_productos');
    }
};
