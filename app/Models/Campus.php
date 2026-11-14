<?php

namespace App\Models;

use Database\Factories\CampusFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Campus extends Model
{
    /** @use HasFactory<CampusFactory> */
    use HasFactory;

    protected $fillable = ['university_id', 'name', 'slug', 'city', 'province'];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Semua kampus + universitasnya, urut per universitas lalu nama kampus.
     * Dipakai dropdown area (Beranda) dan form Jual.
     *
     * @return Collection<int, static>
     */
    public static function selectable(): Collection
    {
        return static::query()
            ->with('university')
            ->get()
            ->sortBy(fn (self $campus) => $campus->university->name.'|'.$campus->name)
            ->values();
    }

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /** "Unsri Indralaya", "Unsri Bukit", "UI Depok" (butuh relasi university). */
    protected function label(): Attribute
    {
        return Attribute::get(fn (): string => trim($this->university->short_name.' '.$this->name));
    }
}
