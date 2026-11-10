<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('campus_id')->nullable()->after('email')
                ->constrained()->nullOnDelete();
            // Terisi setelah KTM diverifikasi -> badge "Terverifikasi KTM"
            $table->timestamp('ktm_verified_at')->nullable()->after('campus_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('campus_id');
            $table->dropColumn('ktm_verified_at');
        });
    }
};
