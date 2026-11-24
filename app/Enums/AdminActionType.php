<?php

namespace App\Enums;

enum AdminActionType: string
{
    case KtmApproved = 'ktm_approved';
    case KtmRejected = 'ktm_rejected';
    case ProductTakenDown = 'product_taken_down';
    case ReportDismissed = 'report_dismissed';
    case ReportResolved = 'report_resolved';     // laporan terbukti, iklannya sudah turun lebih dulu
    case UserSuspended = 'user_suspended';
    case UserUnsuspended = 'user_unsuspended';

    public function label(): string
    {
        return match ($this) {
            self::KtmApproved => 'KTM disetujui',
            self::KtmRejected => 'KTM ditolak',
            self::ProductTakenDown => 'Iklan diturunkan',
            self::ReportDismissed => 'Laporan ditolak',
            self::ReportResolved => 'Laporan terbukti',
            self::UserSuspended => 'Akun diblokir',
            self::UserUnsuspended => 'Akun diaktifkan',
        };
    }

    /** @return list<array{value: string, label: string}> */
    public static function options(): array
    {
        return array_map(
            fn (self $type) => ['value' => $type->value, 'label' => $type->label()],
            self::cases(),
        );
    }
}
