<?php

namespace App\Enums;

enum ReportReason: string
{
    case Fraud = 'fraud';               // penipuan
    case Prohibited = 'prohibited';     // barang terlarang
    case Spam = 'spam';
    case Misleading = 'misleading';     // foto / deskripsi menyesatkan
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Fraud => 'Penipuan',
            self::Prohibited => 'Barang terlarang',
            self::Spam => 'Spam atau iklan berulang',
            self::Misleading => 'Foto atau deskripsi menyesatkan',
            self::Other => 'Lainnya',
        };
    }

    /** Pilihan untuk form laporan: [['value' => 'fraud', 'label' => 'Penipuan'], ...] */
    public static function options(): array
    {
        return array_map(
            fn (self $reason) => ['value' => $reason->value, 'label' => $reason->label()],
            self::cases(),
        );
    }
}
