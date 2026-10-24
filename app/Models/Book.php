<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Book extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'subtitle',
        'description',
        'cover_image',
        'status',
        'published_at',
        'price',
        'sold_count',
        'availability_status',
        'is_best_seller',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'date',
            'price' => 'integer',
            'sold_count' => 'integer',
            'is_best_seller' => 'boolean',
        ];
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class)
            ->withTimestamps();
    }

    public function authors(): BelongsToMany
    {
        return $this->belongsToMany(Author::class)
            ->withTimestamps();
    }
}
