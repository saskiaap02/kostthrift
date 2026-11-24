<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_actions', function (Blueprint $table) {
            $table->id();
            // Admin yang akunnya dihapus tidak menghapus jejaknya: kolom jadi null, ringkasan tetap terbaca.
            $table->foreignId('admin_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action', 30);
            $table->string('summary', 255);               // kalimat siap baca, berisi nama/judul saat kejadian
            $table->string('subject_type', 20)->nullable(); // user | product | report | ktm
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->json('meta')->nullable();             // alasan, jumlah pesanan dibatalkan, dll.
            $table->timestamp('created_at')->useCurrent();

            $table->index('created_at');
            $table->index(['action', 'created_at']);
            $table->index(['subject_type', 'subject_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_actions');
    }
};
