<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('campus_id')->constrained()->restrictOnDelete();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->unsignedInteger('price');                    // Rupiah utuh, tanpa desimal
            $table->unsignedInteger('original_price')->nullable(); // harga coret
            $table->string('condition', 10);                     // baru | second
            $table->string('status', 10)->default('active');     // draft | active | sold
            $table->string('location_note')->nullable();         // mis. "Kukusan, UI Depok"
            $table->timestamps();
            $table->softDeletes();

            // Index untuk query beranda (filter + sort)
            $table->index(['status', 'campus_id', 'category_id']);
            $table->index(['status', 'price']);
            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
