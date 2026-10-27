<?php

use App\Models\Book;
use App\Models\Category;
use App\Models\Documentation;
use App\Models\Event;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicBookController;
use App\Http\Controllers\Author\ManuscriptController;
use App\Http\Controllers\Editor\ManuscriptController as EditorManuscriptController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ManuscriptController as AdminManuscriptController;
use App\Http\Controllers\Admin\DocumentationController;
use App\Http\Controllers\Admin\DocumentLinkController;
use App\Http\Controllers\Admin\EventController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Halaman publik


Route::get('/', function () {
    $books = Book::query()
        ->where('status', 'published')
        ->with([
            'authors:id,name',
            'categories:id,name,slug',
        ])
        ->orderByDesc('published_at')
        ->get();

    $bookCategories = Category::query()
        ->where('is_active', true)
        ->orderBy('name')
        ->get(['id', 'name']);

    // Ambil dokumentasi aktif untuk ditampilkan di halaman utama
    $documentations = Documentation::query()
        ->where('is_active', true)
        ->orderBy('sort_order')
        ->orderByDesc('created_at')
        ->get([
            'id',
            'title',
            'description',
            'type',
            'file_path',
            'sort_order',
        ]);

    // Ambil Event & News aktif untuk ditampilkan di halaman utama
    $events = Event::query()
    ->where('is_active', true)
    ->orderBy('sort_order')
    ->orderByDesc('event_date')
    ->orderByDesc('created_at')
    ->get([
        'id',
        'title',
        'description',
        'type',
        'cover_image',
        'event_date',
        'registration_url',
        'is_active',
        'sort_order',
    ]);

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'authUser' => request()->user()?->only('id', 'name', 'email'),
        'books' => $books,
        'bookCategories' => $bookCategories,
        'documentations' => $documentations,
        'events' => $events,
    ]);
})->name('home');



Route::get('/katalog-buku', [PublicBookController::class, 'index'])
    ->name('public.books.index');

Route::get('/katalog-buku/{book:slug}', [PublicBookController::class, 'show'])
    ->name('public.books.show');

// Dashboard berdasarkan role
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        $role = auth()->user()->role?->slug;

        return match ($role) {
            'admin' => redirect()->route('admin.dashboard'),
            'editor' => redirect()->route('editor.dashboard'),
            'author' => redirect()->route('author.dashboard'),
            default => abort(403, 'Role pengguna belum diatur.'),
        };
    })->name('dashboard');

    // Dashboard Admin
    Route::middleware('role:admin')
        ->prefix('admin')
        ->name('admin.')
        ->group(function () {
            Route::get('/dashboard', [AdminDashboardController::class, 'index'])
                ->name('dashboard');

            Route::get('/manuscripts', [AdminManuscriptController::class, 'index'])
            ->name('manuscripts.index');

            Route::get('/manuscripts/{manuscript}/download', [AdminManuscriptController::class, 'download'])
            ->name('manuscripts.download');

            Route::get('/manuscripts/{manuscript}', [AdminManuscriptController::class, 'show'])
            ->name('manuscripts.show');

            Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class)
                ->except(['show']);

            Route::resource('books', \App\Http\Controllers\Admin\BookController::class)
            ->except(['show']);

            Route::resource('authors', \App\Http\Controllers\Admin\AuthorController::class
            )->except(['show']);

            Route::get('/document-links', [
                DocumentLinkController::class,
                'edit',
            ])->name('document-links.edit');

            Route::put('/document-links', [
                DocumentLinkController::class,
                'update',
            ])->name('document-links.update');

            // Manajemen Dokumentasi
            Route::resource('documentations', DocumentationController::class)
            ->except(['show']);

            Route::resource('events', EventController::class)
            ->except(['show']);
        });

    // Dashboard Editor
    Route::middleware('role:editor')
        ->prefix('editor')
        ->name('editor.')
        ->group(function () {

            Route::get('/dashboard', [EditorManuscriptController::class, 'dashboard'])
            ->name('dashboard');

            Route::get('/manuscripts', [EditorManuscriptController::class, 'index'])
            ->name('manuscripts.index');

            Route::get('/manuscripts/{manuscript}', [EditorManuscriptController::class, 'show'])
            ->name('manuscripts.show');

            Route::get('/manuscripts/{manuscript}/download', [EditorManuscriptController::class, 'download'])
            ->name('manuscripts.download');

            Route::put('/manuscripts/{manuscript}', [EditorManuscriptController::class, 'update'])
            ->name('manuscripts.update');
        });

    // Dashboard Author
    Route::middleware('role:author')
        ->prefix('author')
        ->name('author.')
        ->group(function () {
            Route::get('/dashboard', [
                ManuscriptController::class,
                'dashboard',
            ])->name('dashboard');

            Route::get('/manuscripts', [
                ManuscriptController::class,
                'index',
            ])->name('manuscripts.index');

            Route::get('/manuscripts/create', [
                ManuscriptController::class,
                'create',
            ])->name('manuscripts.create');

            Route::post('/manuscripts', [
                ManuscriptController::class,
                'store',
            ])->name('manuscripts.store');

            Route::get('/manuscripts/{manuscript}', [
                ManuscriptController::class,
                'show'
            ])->name('manuscripts.show');

            Route::put(
                '/manuscripts/{manuscript}/revision',
                [ManuscriptController::class,
                'submitRevision'
            ])->name('manuscripts.revision');

            Route::get('/manuscripts/{manuscript}/download', [
                ManuscriptController::class,
                'download'
            ])->name('manuscripts.download');

            Route::get(
                '/manuscripts/{manuscript}/documents/{type}/download',
                [ManuscriptController::class, 'downloadDocument']
            )->name('manuscripts.documents.download');
                    });
});

// Pengaturan profil Breeze
Route::middleware('auth')->group(function () {
    Route::get('/profile', [
        ProfileController::class,
        'edit',
    ])->name('profile.edit');

    Route::patch('/profile', [
        ProfileController::class,
        'update',
    ])->name('profile.update');

    Route::delete('/profile', [
        ProfileController::class,
        'destroy',
    ])->name('profile.destroy');
});



require __DIR__.'/auth.php';
