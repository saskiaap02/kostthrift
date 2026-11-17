<?php

namespace App\Models;

use App\Enums\PaymentAccountType;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentAccount extends Model
{
    protected $fillable = ['user_id', 'type', 'provider', 'account_name', 'account_number'];

    /** Nomor lengkap tidak boleh ikut terserialisasi ke browser lewat model. */
    protected $hidden = ['account_number'];

    protected function casts(): array
    {
        return [
            'type' => PaymentAccountType::class,
            'account_number' => 'encrypted',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** "******7890": hanya 4 digit terakhir yang terlihat. */
    protected function maskedNumber(): Attribute
    {
        return Attribute::get(function (): string {
            $number = (string) $this->account_number;

            return str_repeat('*', max(strlen($number) - 4, 0)).substr($number, -4);
        });
    }
}
