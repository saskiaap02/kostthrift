<?php

namespace App\Enums;

enum PaymentAccountType: string
{
    case Bank = 'bank';
    case Ewallet = 'ewallet';

    public function label(): string
    {
        return match ($this) {
            self::Bank => 'Rekening bank',
            self::Ewallet => 'E-wallet',
        };
    }
}
