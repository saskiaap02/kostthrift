<?php

namespace App\Models;

use App\Enums\KtmVerificationStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KtmVerification extends Model
{
    protected $fillable = [
        'user_id',
        'university_id',
        'document_path',
        'status',
        'reviewed_by',
        'reviewed_at',
        'rejection_reason',
    ];

    /** Path file tidak boleh ikut terkirim ke browser dalam keadaan apa pun. */
    protected $hidden = ['document_path'];

    protected function casts(): array
    {
        return [
            'status' => KtmVerificationStatus::class,
            'reviewed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
