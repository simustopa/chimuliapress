<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Manuscript extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'synopsis',
        'category_id',
        'service_type',
        'contact_phone',
        'file_path',
        'original_filename',
        'status',
        'editor_notes',
        'reviewed_at',
        'agreement_file_path',
        'originality_file_path',
    ];

    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ManuscriptReview::class);
    }
}
