<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use App\Models\DocumentLink;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicBookController extends Controller
{

    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $categoryId = $request->input('category');
        $bestSeller = $request->input('best_seller') == '1';

        $books = Book::query()
            ->where('status', 'published')
            ->with(['authors:id,name', 'categories:id,name,slug'])

            // Pencarian judul dan subtitle
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'ilike', "%{$search}%")
                        ->orWhere('subtitle', 'ilike', "%{$search}%");
                });
            })

            // Filter kategori
            ->when($categoryId, function ($query, $categoryId) {
                $query->whereHas('categories', function ($q) use ($categoryId) {
                    $q->where('categories.id', $categoryId);
                });
            })

            // Filter Best Seller
            ->when($bestSeller, function ($query) {
                $query->where('is_best_seller', true);
            })

            ->orderByDesc('published_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Public/Books/Index', [
            'books' => $books,

            'categories' => Category::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name']),

            'filters' => [
                'search' => $search ?? '',
                'category' => $categoryId ?? '',
                'best_seller' => $bestSeller ? '1' : '',
            ],
        ]);
    }


    public function show(string $slug): Response
    {
        $book = Book::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->with(['authors:id,name,email,bio', 'categories:id,name,slug'])
            ->firstOrFail();

        $bookingFormUrl = DocumentLink::where(
            'key',
            'book_order_form'
        )->value('url');

        return Inertia::render('Public/Books/Show', [
            'book' => $book,
            'bookingFormUrl' => $bookingFormUrl,
        ]);
    }
}
