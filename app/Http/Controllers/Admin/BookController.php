<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Author;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{

    public function index(): Response
    {
        return Inertia::render('Admin/Books/Index', [
            'books' => Book::query()
                ->with(['authors:id,name', 'categories:id,name'])
                ->orderBy('title')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Books/Create', [
            'categories' => [
                'Buku Teks/Buku Ajar',
                'Buku Monograf Hasil Penelitian',
                'Buku Referensi Ilmiah',
                'Buku Umum dan Literasi Edukasi',
            ],
        ]);
    }


    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255', 'unique:books,title'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'published_at' => ['nullable', 'date'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],

            'author_name' => ['nullable', 'string', 'max:255'],
            'category_name' => [
                'required',
                Rule::in([
                    'Buku Teks/Buku Ajar',
                    'Buku Monograf Hasil Penelitian',
                    'Buku Referensi Ilmiah',
                    'Buku Umum dan Literasi Edukasi',
                ]),
            ],

            'price' => ['nullable', 'integer', 'min:0'],
            'sold_count' => ['required', 'integer', 'min:0'],
            'availability_status' => ['required', Rule::in(['ready', 'preorder'])],
            'is_best_seller' => ['required', 'boolean'],
        ]);

        $authorName = trim($validated['author_name'] ?? '');
        $categoryName = $validated['category_name'];

        unset($validated['author_name'], $validated['category_name']);

        $validated['slug'] = Str::slug($validated['title']);

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')
                ->store('covers', 'public');
        }

        $book = Book::create($validated);

        // Simpan penulis jika nama diisi.
        if ($authorName !== '') {
            $author = Author::firstOrCreate(
                ['slug' => Str::slug($authorName)],
                ['name' => $authorName]
            );

            $book->authors()->sync([$author->id]);
        }

        // Gunakan kategori yang tersedia atau buat jika belum ada.
        $category = Category::firstOrCreate(
            ['slug' => Str::slug($categoryName)],
            ['name' => $categoryName, 'is_active' => true]
        );

        $book->categories()->sync([$category->id]);

        return redirect()
            ->route('admin.books.index')
            ->with('success', 'Buku berhasil ditambahkan.');
    }

    public function edit(Book $book): Response
    {
        $book->load(['authors:id,name', 'categories:id,name']);

        return Inertia::render('Admin/Books/Edit', [
            'book' => $book,
            'categories' => [
                'Buku Teks/Buku Ajar',
                'Buku Monograf Hasil Penelitian',
                'Buku Referensi Ilmiah',
                'Buku Umum dan Literasi Edukasi',
            ],
        ]);
    }


    public function update(Request $request, Book $book): RedirectResponse
    {
        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
                Rule::unique('books', 'title')->ignore($book->id),
            ],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'published_at' => ['nullable', 'date'],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],

            'author_name' => ['nullable', 'string', 'max:255'],
            'category_name' => [
                'required',
                Rule::in([
                    'Buku Teks/Buku Ajar',
                    'Buku Monograf Hasil Penelitian',
                    'Buku Referensi Ilmiah',
                    'Buku Umum dan Literasi Edukasi',
                ]),
            ],

            'price' => ['nullable', 'integer', 'min:0'],
            'sold_count' => ['required', 'integer', 'min:0'],
            'availability_status' => ['required', Rule::in(['ready', 'preorder'])],
            'is_best_seller' => ['required', 'boolean'],
        ]);

        $authorName = trim($validated['author_name'] ?? '');
        $categoryName = $validated['category_name'];

        unset($validated['author_name'], $validated['category_name']);
        unset($validated['cover_image']);

        $validated['slug'] = Str::slug($validated['title']);

        // Keluarkan cover_image dari data update terlebih dahulu.
        // Dengan begitu, sampul lama tidak tertimpa null atau string kosong.
        unset($validated['cover_image']);

        // Ganti sampul hanya jika pengguna mengunggah file baru.
        if ($request->hasFile('cover_image')) {
            $newCover = $request->file('cover_image')
                ->store('covers', 'public');

            if ($newCover) {
                $oldCover = $book->cover_image;

                $validated['cover_image'] = $newCover;

                // Update data buku dengan sampul baru.
                $book->update($validated);

                // Hapus sampul lama setelah data berhasil diperbarui.
                if (
                    $oldCover &&
                    Storage::disk('public')->exists($oldCover)
                ) {
                    Storage::disk('public')->delete($oldCover);
                }
            } else {
                $book->update($validated);
            }
        } else {
            // Tidak ada file baru: sampul lama tetap dipertahankan.
            $book->update($validated);
        }


        $book->update($validated);

        // Ganti relasi penulis sesuai input terbaru.
        if ($authorName === '') {
            $book->authors()->sync([]);
        } else {
            $author = Author::firstOrCreate(
                ['slug' => Str::slug($authorName)],
                ['name' => $authorName]
            );

            $book->authors()->sync([$author->id]);
        }

        // Ganti kategori buku.
        $category = Category::firstOrCreate(
            ['slug' => Str::slug($categoryName)],
            ['name' => $categoryName, 'is_active' => true]
        );

        $book->categories()->sync([$category->id]);

        return redirect()
            ->route('admin.books.index')
            ->with('success', 'Buku berhasil diperbarui.');
    }

    public function destroy(Book $book): RedirectResponse
    {
        if ($book->cover_image && Storage::disk('public')->exists($book->cover_image)) {
            Storage::disk('public')->delete($book->cover_image);
        }

        $book->delete();

        return redirect()
            ->route('admin.books.index')
            ->with('success', 'Buku berhasil dihapus.');
    }
}
