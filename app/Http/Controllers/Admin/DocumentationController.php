<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Documentation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DocumentationController extends Controller
{
    /**
     * Menampilkan daftar dokumentasi.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Documentations/Index', [
            'documentations' => Documentation::query()
                ->orderBy('sort_order')
                ->orderByDesc('created_at')
                ->get(),
        ]);
    }

    /**
     * Menampilkan formulir tambah dokumentasi.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Documentations/Create');
    }

    /**
     * Menyimpan dokumentasi baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', Rule::in(['photo', 'video'])],
            'file' => [
                        'required',
                        'file',
                        'max:51200',
                        Rule::when(
                            $request->input('type') === 'photo',
                            ['image', 'mimes:jpg,jpeg,png,webp'],
                            ['mimetypes:video/mp4,video/webm,video/ogg']
                        ),
                    ],
            'is_active' => ['required', 'boolean'],
            'sort_order' => ['required', 'integer', 'min:0'],
        ]);

        $validated['file_path'] = $request->file('file')
            ->store('documentations', 'public');

        unset($validated['file']);

        Documentation::create($validated);

        return redirect()
            ->route('admin.documentations.index')
            ->with('success', 'Dokumentasi berhasil ditambahkan.');
    }

    /**
     * Menampilkan formulir edit dokumentasi.
     */
    public function edit(Documentation $documentation): Response
    {
        return Inertia::render('Admin/Documentations/Edit', [
            'documentation' => $documentation,
        ]);
    }

    /**
     * Memperbarui dokumentasi.
     */
    public function update(
        Request $request,
        Documentation $documentation
    ): RedirectResponse {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', Rule::in(['photo', 'video'])],
            'file' => [
                        'nullable',
                        'file',
                        'max:51200',
                        Rule::when(
                            $request->input('type') === 'photo',
                            ['image', 'mimes:jpg,jpeg,png,webp'],
                            ['mimetypes:video/mp4,video/webm,video/ogg']
                        ),
                    ],
            'is_active' => ['required', 'boolean'],
            'sort_order' => ['required', 'integer', 'min:0'],
        ]);

        if ($request->hasFile('file')) {
            $newPath = $request->file('file')
                ->store('documentations', 'public');

            if ($documentation->file_path) {
                Storage::disk('public')->delete(
                    $documentation->file_path
                );
            }

            $validated['file_path'] = $newPath;
        }

        unset($validated['file']);

        $documentation->update($validated);

        return redirect()
            ->route('admin.documentations.index')
            ->with('success', 'Dokumentasi berhasil diperbarui.');
    }

    /**
     * Menghapus dokumentasi.
     */
    public function destroy(
        Documentation $documentation
    ): RedirectResponse {
        if ($documentation->file_path) {
            Storage::disk('public')->delete(
                $documentation->file_path
            );
        }

        $documentation->delete();

        return redirect()
            ->route('admin.documentations.index')
            ->with('success', 'Dokumentasi berhasil dihapus.');
    }
}

