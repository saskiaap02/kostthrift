<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporter_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('reason', 20);                   // fraud | prohibited | spam | misleading | other
            $table->string('detail', 300)->nullable();      // keterangan tambahan dari pelapor
            $table->string('status', 12)->default('pending'); // pending | resolved | dismissed
            $table->foreignId('handled_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('handled_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'id']);
            $table->index(['product_id', 'status']);
            $table->index(['reporter_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
