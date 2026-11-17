<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    protected $fillable = ['order_id', 'product_id', 'title', 'price'];

    protected function casts(): array
    {
        return ['price' => 'integer'];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /** withTrashed: pesanan tetap bisa menampilkan barang yang iklannya sudah diturunkan. */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }
}
