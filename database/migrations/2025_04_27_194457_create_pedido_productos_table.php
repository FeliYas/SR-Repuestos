<?php

use App\Models\Pedido;
use App\Models\Productos;
use App\Models\SubProducto;
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
        Schema::create('pedido_productos', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Pedido::class, 'pedido_id')->constrained()->onDelete('cascade');
            $table->foreignIdFor(SubProducto::class, 'subproducto_id')->constrained()->onDelete('cascade');
            $table->integer("cantidad");
            $table->decimal("subtotal_prod", 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedido_producto');
    }
};
