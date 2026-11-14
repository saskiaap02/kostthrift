<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Satu universitas bisa punya banyak kampus/area (mis. Unsri: Indralaya dan Bukit).
        Schema::create('campuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('university_id')->constrained()->cascadeOnDelete();
            $table->string('name');               // "Indralaya", "Bukit"
            $table->string('slug')->unique();     // "unsri-indralaya"
            $table->string('city');               // kota/kabupaten lokasi kampus
            $table->string('province');
            $table->timestamps();

            $table->index(['province', 'city']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campuses');
    }
};
