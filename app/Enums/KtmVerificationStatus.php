<?php

namespace App\Enums;

enum KtmVerificationStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Menunggu pemeriksaan',
            self::Approved => 'Disetujui',
            self::Rejected => 'Ditolak',
        };
    }
}
