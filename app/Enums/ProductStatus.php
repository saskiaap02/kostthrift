<?php

namespace App\Enums;

enum ProductStatus: string
{
    case Draft = 'draft';
    case Active = 'active';
    case Reserved = 'reserved'; // ditahan oleh pesanan yang sedang berjalan
    case Sold = 'sold';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Active => 'Aktif',
            self::Reserved => 'Dipesan',
            self::Sold => 'Terjual',
        };
    }
}
