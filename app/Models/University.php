<?php

namespace App\Models;

use Database\Factories\UniversityFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class University extends Model
{
    /** @use HasFactory<UniversityFactory> */
    use HasFactory;

    protected $fillable = ['name', 'short_name', 'slug'];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function campuses(): HasMany
    {
        return $this->hasMany(Campus::class);
    }
}
