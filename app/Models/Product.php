<?php

namespace App\Models;

use App\Enums\ProductCondition;
use App\Enums\ProductStatus;
use App\Enums\SortOption;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'seller_id',
        'campus_id',
        'category_id',
        'title',
        'slug',
        'description',
        'price',
        'original_price',
        'condition',
        'status',
        'location_note',
    ];

    protected function casts(): array
    {
        return [
            'condition' => ProductCondition::class,
            'status' => ProductStatus::class,
            'price' => 'integer',
            'original_price' => 'integer',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    // ---------- Relasi ----------

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function campus(): BelongsTo
    {
        return $this->belongsTo(Campus::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function primaryImage(): HasOne
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    // ---------- Accessor ----------

    /** Persentase hemat, null kalau tidak ada harga coret. */
    protected function discountPercent(): Attribute
    {
        return Attribute::get(function (): ?int {
            if (! $this->original_price || $this->original_price <= $this->price) {
                return null;
            }

            return (int) round((1 - $this->price / $this->original_price) * 100);
        });
    }

    // ---------- Scope (dipakai ProductQueryService di langkah 4) ----------

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', ProductStatus::Active);
    }

    public function scopeOfCondition(Builder $query, ?ProductCondition $condition): Builder
    {
        return $condition ? $query->where('condition', $condition) : $query;
    }

    public function scopeInCampus(Builder $query, ?string $campusSlug): Builder
    {
        return $campusSlug ? $query->whereRelation('campus', 'slug', $campusSlug) : $query;
    }

    public function scopeInCategory(Builder $query, ?string $categorySlug): Builder
    {
        return $categorySlug ? $query->whereRelation('category', 'slug', $categorySlug) : $query;
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        $term = trim((string) $term);

        if ($term === '') {
            return $query;
        }

        $like = '%'.addcslashes($term, '%_\\').'%';

        return $query->where(fn (Builder $q) => $q
            ->where('title', 'like', $like)
            ->orWhere('description', 'like', $like));
    }

    public function scopeSortedBy(Builder $query, SortOption $sort): Builder
    {
        return match ($sort) {
            SortOption::Termurah => $query->orderBy('price')->orderByDesc('id'),
            SortOption::Terbaru => $query->orderByDesc('created_at')->orderByDesc('id'),
            // TODO langkah 4: urutkan berdasarkan kedekatan dengan kampus pengguna.
            SortOption::TerdekatCod => $query->orderByDesc('created_at')->orderByDesc('id'),
        };
    }
}
