<?php

namespace App\Http\Controllers\Editor;

use App\Http\Controllers\Controller;
use App\Models\Manuscript;
use App\Models\ManuscriptReview;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ManuscriptController extends Controller
{

    public function dashboard(Request $request): Response
    {

        $stats = [
            'total' => Manuscript::count(),

            'submitted' => Manuscript::where('status', 'submitted')
                ->count(),

            'under_review' => Manuscript::where('status', 'under_review')
                ->count(),

            'revision' => Manuscript::where('status', 'revision')
                ->count(),

            'accepted' => Manuscript::where('status', 'accepted')
                ->count(),

            'rejected' => Manuscript::where('status', 'rejected')
                ->count(),
        ];

        $recentManuscripts = Manuscript::query()
            ->with([
                'user:id,name,email',
                'category:id,name',
            ])
            ->latest()
            ->take(10)
            ->get([
                'id',
                'user_id',
                'title',
                'category_id',
                'service_type',
                'status',
                'created_at',
            ]);

        return Inertia::render('Editor/Dashboard', [
            'stats' => $stats,
            'recentManuscripts' => $recentManuscripts,
        ]);
    }

    public function index(Request $request): Response
    {
        $query = Manuscript::query()
            ->with([
                'user:id,name,email',
                'category:id,name',
            ])
            ->latest();

        // Pencarian
        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery
                            ->where('name', 'ilike', "%{$search}%")
                            ->orWhere('email', 'ilike', "%{$search}%");
                    });
            });
        }

        // Filter status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $manuscripts = $query
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Editor/Manuscripts/Index', [
            'manuscripts' => $manuscripts,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
            ],
        ]);
    }


    public function show(Manuscript $manuscript): Response
    {
        $manuscript->load([
            'user:id,name,email',
            'category:id,name',
            'reviews' => function ($query) {
                $query
                    ->with('reviewer:id,name,email')
                    ->latest('reviewed_at');
            },
        ]);

        return Inertia::render('Editor/Manuscripts/Show', [
            'manuscript' => $manuscript,
        ]);
    }

    public function download(Request $request, Manuscript $manuscript)
    {
        abort_unless(
            $manuscript->file_path &&
            Storage::exists($manuscript->file_path),
            404
        );

        return Storage::download(
            $manuscript->file_path,
            $manuscript->original_filename
        );
    }

    public function update(Request $request, Manuscript $manuscript
    ): RedirectResponse {
        $validated = $request->validate([
            'status' => [
                'required',
                Rule::in([
                    'under_review',
                    'revision',
                    'accepted',
                    'rejected',
                    'published',
                ]),
            ],

            'editor_notes' => [
                'nullable',
                'string',
                'max:10000',
            ],
        ]);

        DB::transaction(function () use ($request, $manuscript, $validated) {
            // Simpan riwayat review
            ManuscriptReview::create([
                'manuscript_id' => $manuscript->id,
                'reviewer_id' => $request->user()->id,
                'status' => $validated['status'],
                'notes' => $validated['editor_notes'] ?? null,
                'reviewed_at' => now(),
            ]);

            // Update status dan catatan terbaru pada naskah utama
            $manuscript->update([
                'status' => $validated['status'],
                'editor_notes' => $validated['editor_notes'] ?? null,
                'reviewed_at' => now(),
            ]);
        });

        return redirect()
            ->route('editor.manuscripts.show', $manuscript)
            ->with('success', 'Review naskah berhasil disimpan.');
    }

    public function downloadDocument(
    Request $request,
    Manuscript $manuscript,
    string $type
    ) {
        $documents = [
            'agreement' => [
                'path' => $manuscript->agreement_file_path,
                'name' => 'Surat-Perjanjian-Penerbitan',
            ],
            'originality' => [
                'path' => $manuscript->originality_file_path,
                'name' => 'Surat-Pernyataan-Keaslian',
            ],
        ];

        abort_unless(isset($documents[$type]), 404);

        $document = $documents[$type];

        abort_unless(
            $document['path'] &&
            Storage::exists($document['path']),
            404,
            'Dokumen tidak ditemukan.'
        );

        return Storage::download(
            $document['path'],
            $document['name'] . '.' .
                pathinfo($document['path'], PATHINFO_EXTENSION)
        );
    }

}
