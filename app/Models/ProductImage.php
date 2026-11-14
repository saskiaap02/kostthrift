<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ProductImage extends Model
{
    protected $fillable = ['product_id', 'path', 'is_primary', 'sort_order'];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * URL siap pakai: URL penuh dipakai apa adanya; selain itu dianggap file di disk "public"
     * dan dilayani lewat /storage (butuh `php artisan storage:link`).
     * Sengaja relatif agar tetap benar walau APP_URL tidak sama dengan alamat yang dibuka.
     */
    protected function url(): Attribute
    {
        return Attribute::get(fn () => Str::startsWith($this->path, ['http://', 'https://'])
            ? $this->path
            : '/storage/'.ltrim($this->path, '/'));
    }
}
