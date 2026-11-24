<?php

namespace App\Enums;

enum ReportStatus: string
{
    case Pending = 'pending';       // menunggu ditinjau admin
    case Resolved = 'resolved';     // terbukti melanggar, iklan diturunkan
    case Dismissed = 'dismissed';   // tidak terbukti, laporan ditutup

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Menunggu ditinjau',
            self::Resolved => 'Iklan diturunkan',
            self::Dismissed => 'Ditolak',
        };
    }
}
