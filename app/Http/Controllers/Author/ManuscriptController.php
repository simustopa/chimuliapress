<?php

namespace App\Http\Controllers\Author;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Manuscript;
use App\Models\DocumentLink;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ManuscriptController extends Controller
{

    public function dashboard(Request $request): Response
    {
        $userId = $request->user()->id;

        $query = Manuscript::query()->where('user_id', $userId);

        $stats = [
            'total' => (clone $query)->count(),
            'submitted' => (clone $query)
                ->where('status', 'submitted')
                ->count(),
            'under_review' => (clone $query)
                ->where('status', 'under_review')
                ->count(),
            'revision' => (clone $query)
                ->where('status', 'revision')
                ->count(),
            'accepted' => (clone $query)
                ->whereIn('status', ['accepted', 'published'])
                ->count(),
        ];

        $recentManuscripts = (clone $query)
            ->with('category:id,name')
            ->latest()
            ->take(5)
            ->get([
                'id',
                'title',
                'category_id',
                'status',
                'created_at',
            ]);

        return Inertia::render('Author/Dashboard', [
            'stats' => $stats,
            'recentManuscripts' => $recentManuscripts,

            'documentLinks' => DocumentLink::whereIn('key', [
                'surat_perjanjian',
                'surat_keaslian',
            ])
                ->whereNotNull('url')
                ->get(['key', 'title', 'url'])
                ->values(),
        ]);
    }
    public function index(Request $request): \Inertia\Response
        {
            $manuscripts = Manuscript::query()
                ->where('user_id', $request->user()->id)
                ->with('category:id,name')
                ->latest()
                ->paginate(10);

            return Inertia::render('Author/Manuscripts/Index', [
                'manuscripts' => $manuscripts,
                'flash' => [
                    'success' => session('success'),
                ],
            ]);
        }

    public function create(): \Inertia\Response
    {
        return Inertia::render('Author/Manuscripts/Create', [
            'categories' => Category::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'contact_phone' => ['required', 'string', 'max:30'],
            'service_type' => [
                'required',
                \Illuminate\Validation\Rule::in([
                    'book_textbook',
                    'school_book',
                    'reference_book',
                    'journal_article',
                    'haki_certificate',
                ]),
            ],
            'category_id' => [
                'nullable',
                'integer',
                'exists:categories,id',
            ],
            'synopsis' => ['required', 'string', 'max:10000'],
            'manuscript_file' => [
                'required',
                'file',
                'mimes:pdf,doc,docx',
                'max:20480',
            ],
        ]);

    $file = $request->file('manuscript_file');
    $filePath = $file->store('manuscripts');

            Manuscript::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'contact_phone' => $validated['contact_phone'],
            'service_type' => $validated['service_type'],
            'category_id' => $validated['category_id'] ?? null,
            'synopsis' => $validated['synopsis'],
            'file_path' => $filePath,
            'original_filename' => $file->getClientOriginalName(),
            'status' => 'submitted',
        ]);

        return redirect()
            ->route('author.manuscripts.index')
            ->with('success', 'Pengajuan naskah berhasil dikirim.');
    }

    public function show(Request $request, Manuscript $manuscript): Response
    {
        abort_unless(
            $manuscript->user_id === $request->user()->id,
            403
        );

        $manuscript->load([
            'category:id,name',
            'reviews' => function ($query) {
                $query
                    ->with('reviewer:id,name,email')
                    ->latest('reviewed_at');
            },
        ]);

        return Inertia::render('Author/Manuscripts/Show', [
            'manuscript' => $manuscript,
        ]);
    }

    public function submitRevision(
    Request $request,
    Manuscript $manuscript
    ): RedirectResponse {
        // Pastikan naskah memang milik author yang sedang login
        abort_unless(
            $manuscript->user_id === $request->user()->id,
            403
        );

        // Revisi hanya boleh dikirim jika statusnya memang revision
        abort_unless(
            $manuscript->status === 'revision',
            403
        );

        $validated = $request->validate([
            'manuscript_file' => [
                'required',
                'file',
                'mimes:pdf,doc,docx',
                'max:20480',
            ],
        ]);

        $file = $request->file('manuscript_file');

        // Simpan file baru terlebih dahulu
        $newFilePath = $file->store('manuscripts');

        // Simpan path file lama
        $oldFilePath = $manuscript->file_path;

        // Update manuscript yang sama
        $manuscript->update([
            'file_path' => $newFilePath,
            'original_filename' => $file->getClientOriginalName(),
            'status' => 'submitted',
        ]);

        // Setelah file baru berhasil tersimpan dan database berhasil di-update,
        // hapus file lama
        if ($oldFilePath && Storage::exists($oldFilePath)) {
            Storage::delete($oldFilePath);
        }

        return redirect()
            ->route('author.manuscripts.show', $manuscript)
            ->with('success', 'Revisi naskah berhasil dikirim.');
    }

    public function download(Request $request, Manuscript $manuscript)
    {
        abort_unless(
            $manuscript->user_id === $request->user()->id,
            403
        );

        abort_unless(
            $manuscript->file_path && Storage::exists($manuscript->file_path),
            404
        );

        return Storage::download(
            $manuscript->file_path,
            $manuscript->original_filename
        );
    }
}
