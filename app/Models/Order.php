<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'code',
        'buyer_id',
        'seller_id',
        'status',
        'payment_method',
        'total',
        'buyer_note',
        'seller_note',
        'payment_snapshot',
        'payment_proof_path',
        'cancel_reason',
        'cancelled_by',
        'accepted_at',
        'payment_reported_at',
        'paid_at',
        'completed_at',
        'cancelled_at',
    ];

    protected $hidden = [
        'payment_snapshot',
        'payment_proof_path',
    ];

    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'payment_method' => PaymentMethod::class,
            'total' => 'integer',
            'payment_snapshot' => 'encrypted:array',
            'accepted_at' => 'datetime',
            'payment_reported_at' => 'datetime',
            'paid_at' => 'datetime',
            'completed_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'code';
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}