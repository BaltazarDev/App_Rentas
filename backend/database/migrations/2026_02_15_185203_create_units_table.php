<?php

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
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('house_id')->constrained()->onDelete('cascade');
            $table->string('type'); // apartment, commercial
            $table->string('name');
            $table->integer('rooms')->default(0);
            $table->integer('bathrooms')->default(0);
            $table->decimal('base_rent_cost', 10, 2);
            $table->json('features')->nullable();
            $table->string('status')->default('vacant');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
