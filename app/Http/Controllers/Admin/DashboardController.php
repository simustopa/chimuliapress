<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use App\Models\Manuscript;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'books' => Book::count(),

            'categories' => Category::count(),

            'authors' => User::whereHas('role', function ($query) {
                $query->where('slug', 'author');
            })->count(),

            'manuscripts' => Manuscript::count(),

            'pending_manuscripts' => Manuscript::where('status', 'submitted')->count(),
        ];

        $recentManuscripts = Manuscript::query()
            ->with([
                'user:id,name,email',
                'category:id,name',
            ])
            ->latest()
            ->take(5)
            ->get([
                'id',
                'user_id',
                'category_id',
                'title',
                'status',
                'created_at',
            ]);

        $recentBooks = Book::query()
            ->latest()
            ->take(5)
            ->get([
                'id',
                'title',
                'status',
                'created_at',
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentManuscripts' => $recentManuscripts,
            'recentBooks' => $recentBooks,
        ]);
    }
}
