<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('code', 12)->unique();                       // mis. KT-A3F9XK
            $table->foreignId('buyer_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('seller_id')->constrained('users')->restrictOnDelete();
            $table->string('status', 20)->default('pending');
            $table->string('payment_method', 10);                       // cod | transfer
            $table->unsignedInteger('total');
            $table->string('buyer_note', 300)->nullable();
            $table->string('seller_note', 300)->nullable();             // titik temu / waktu dari penjual
            $table->text('payment_snapshot')->nullable();               // salinan rekening saat disetujui (TERENKRIPSI)
            $table->string('cancel_reason', 200)->nullable();
            $table->foreignId('cancelled_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('payment_reported_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();

            $table->index(['buyer_id', 'status']);
            $table->index(['seller_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
