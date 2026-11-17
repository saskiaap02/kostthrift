<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type', 10);            // bank | ewallet
            $table->string('provider', 40);        // BCA, BRI, DANA, GoPay, ...
            $table->string('account_name', 80);    // nama pemilik
            $table->text('account_number');        // TERENKRIPSI (cast "encrypted")
            $table->timestamps();

            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_accounts');
    }
};
