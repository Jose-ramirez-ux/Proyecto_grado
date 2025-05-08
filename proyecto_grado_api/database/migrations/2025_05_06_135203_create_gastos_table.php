<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGastosTable extends Migration
{
    public function up()
{
    Schema::create('gastos', function (Blueprint $table) {
        $table->id(); // Esto crea la columna 'id' como clave primaria
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('nombre');
        $table->decimal('valor', 10, 2);
        $table->date('fecha');
        $table->string('color')->default('#000000');
        $table->timestamps();
    });
}

    public function down()
    {
        Schema::dropIfExists('gastos');
    }
}
