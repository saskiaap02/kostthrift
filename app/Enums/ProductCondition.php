<?php

namespace App\Enums;

enum ProductCondition: string
{
    case Baru = 'baru';
    case Second = 'second';

    public function label(): string
    {
        return match ($this) {
            self::Baru => 'Baru',
            self::Second => 'Second',
        };
    }
}
