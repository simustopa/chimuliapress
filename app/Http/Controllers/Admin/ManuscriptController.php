<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Manuscript;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ManuscriptController extends Controller
{

    public function index(Request $request): Response
    {
        $query = Manuscript::query()
            ->with([
                'user:id,name,email',
                'category:id,name',
            ])
            ->latest();

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

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $manuscripts = $query
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'total' => Manuscript::count(),
            'submitted' => Manuscript::where('status', 'submitted')->count(),
            'under_review' => Manuscript::where('status', 'under_review')->count(),
            'revision' => Manuscript::where('status', 'revision')->count(),
            'accepted' => Manuscript::where('status', 'accepted')->count(),
            'rejected' => Manuscript::where('status', 'rejected')->count(),
            'published' => Manuscript::where('status', 'published')->count(),
        ];

        return Inertia::render('Admin/Manuscripts/Index', [
            'manuscripts' => $manuscripts,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
            ],
            'stats' => $stats,
        ]);
    }


    public function show(Manuscript $manuscript): Response
    {
        $manuscript->load([
            'user:id,name,email',
            'category:id,name',
        ]);

        return Inertia::render('Admin/Manuscripts/Show', [
            'manuscript' => $manuscript,
        ]);
    }

    public function download(Manuscript $manuscript)
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
}
