<?php

namespace Tests\Feature\Admin;

use App\Models\Book;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BookControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function makeAdminUser(): User
    {
        $role = Role::create([
            'name' => 'Admin',
            'slug' => 'admin',
        ]);

        return User::factory()->create([
            'role_id' => $role->id,
        ]);
    }

    public function test_admin_cannot_upload_invalid_cover_image_when_updating_book(): void
    {
        Storage::fake('public');

        $admin = $this->makeAdminUser();
        $book = Book::create([
            'title' => 'Judul Lama',
            'slug' => 'judul-lama',
            'status' => 'draft',
        ]);

        $response = $this->actingAs($admin)
            ->from(route('admin.books.edit', $book))
            ->put(route('admin.books.update', $book), [
                'title' => 'Judul Baru',
                'status' => 'published',
                'author_ids' => [],
                'category_ids' => [],
                'cover_image' => UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
            ]);

        $response->assertSessionHasErrors('cover_image');
    }

    public function test_destroying_book_removes_cover_image_from_storage(): void
    {
        Storage::fake('public');

        $admin = $this->makeAdminUser();
        $coverPath = Storage::disk('public')->putFileAs('covers', UploadedFile::fake()->image('cover.jpg'), 'cover.jpg');

        $book = Book::create([
            'title' => 'Judul Buku',
            'slug' => 'judul-buku',
            'status' => 'draft',
            'cover_image' => $coverPath,
        ]);

        $response = $this->actingAs($admin)
            ->delete(route('admin.books.destroy', $book));

        $response->assertRedirect(route('admin.books.index'));
        $this->assertFalse(Storage::disk('public')->exists($coverPath));
        $this->assertDatabaseMissing('books', ['id' => $book->id]);
    }
}
