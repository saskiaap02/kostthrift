<?php

namespace App\Console\Commands;

use App\Services\OrderService;
use Illuminate\Console\Command;

class ExpireOrders extends Command
{
    protected $signature = 'orders:expire {--hours=24 : Batas waktu kedaluwarsa dalam jam}';

    protected $description = 'Batalkan otomatis pesanan yang melewati batas waktu dan buka kembali stok barang';

    public function handle(OrderService $orders): int
    {
        $hours = max(1, (int) $this->option('hours'));
        $count = $orders->expireStaleOrders($hours);

        $this->info("Selesai: {$count} pesanan kedaluwarsa dibatalkan.");

        return self::SUCCESS;
    }
}