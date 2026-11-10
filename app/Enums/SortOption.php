<?php

namespace App\Enums;

enum SortOption: string
{
    case Termurah = 'termurah';
    case Terbaru = 'terbaru';
    case TerdekatCod = 'terdekat_cod';

    public static function default(): self
    {
        return self::Terbaru;
    }

    public function label(): string
    {
        return match ($this) {
            self::Termurah => 'Termurah',
            self::Terbaru => 'Terbaru',
            self::TerdekatCod => 'Terdekat COD',
        };
    }
}
