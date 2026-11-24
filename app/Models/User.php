<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'campus_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'ktm_verified_at' => 'datetime',
            'suspended_at' => 'datetime',
        ];
    }

    // ==========================================
    // RELASI & HELPER METHOD (DARI CLAUDE)
    // ==========================================

    public function campus(): BelongsTo
    {
        return $this->belongsTo(Campus::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'seller_id');
    }

    public function wishlistedProducts(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'wishlists')->withTimestamps();
    }

    public function cartProducts(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'cart_items')->withTimestamps();
    }

    /** Akun diblokir admin: tidak bisa masuk dan iklannya disembunyikan. */
    public function isSuspended(): bool
    {
        return $this->suspended_at !== null;
    }

    /** Pesan untuk akun yang diblokir (dipakai saat login dan saat sesi diputus). */
    public static function suspensionMessage(?string $reason): string
    {
        return 'Akunmu dinonaktifkan oleh admin.'.($reason ? " Alasan: {$reason}" : '');
    }

    public function isKtmVerified(): bool
    {
        return $this->ktm_verified_at !== null;
    }
}