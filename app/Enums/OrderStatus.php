<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';                   // menunggu persetujuan penjual
    case Accepted = 'accepted';                 // disetujui (COD: atur pertemuan)
    case AwaitingPayment = 'awaiting_payment';  // disetujui (transfer: menunggu pembeli membayar)
    case PaymentReported = 'payment_reported';  // pembeli melapor sudah transfer
    case Paid = 'paid';                         // penjual mengonfirmasi uang masuk
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Menunggu persetujuan penjual',
            self::Accepted => 'Disetujui, atur pertemuan',
            self::AwaitingPayment => 'Menunggu pembayaran',
            self::PaymentReported => 'Pembayaran dilaporkan',
            self::Paid => 'Pembayaran dikonfirmasi',
            self::Completed => 'Selesai',
            self::Cancelled => 'Dibatalkan',
        };
    }
}
