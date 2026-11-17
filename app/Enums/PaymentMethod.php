<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Cod = 'cod';
    case Transfer = 'transfer';

    public function label(): string
    {
        return match ($this) {
            self::Cod => 'COD (bayar tunai saat bertemu)',
            self::Transfer => 'Transfer langsung ke penjual',
        };
    }
}
