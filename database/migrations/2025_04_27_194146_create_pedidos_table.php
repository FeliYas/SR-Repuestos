<?php

use App\Models\User;
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
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class, 'user_id')->constrained()->onDelete('cascade');
            $table->string("tipo_entrega");
            $table->string("mensaje")->nullable();
            $table->string("archivo")->nullable();
            $table->boolean("entregado")->default(false);
            $table->decimal("subtotal", 10, 2)->default(0);
            $table->decimal("iibb", 10, 2)->default(0);
            $table->decimal("iva", 10, 2)->default(0);
            $table->decimal("total", 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};
