<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DocumentLink;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentLinkController extends Controller
{
    private array $documents = [
        'surat_perjanjian' => 'Surat Perjanjian',
        'surat_keaslian' => 'Surat Pernyataan Keaslian',
        'book_order_form' => 'Form Pemesanan Buku',
    ];

    public function edit()
    {
        $documents = [];

        foreach ($this->documents as $key => $title) {
            $document = DocumentLink::firstOrCreate(
                ['key' => $key],
                ['title' => $title, 'url' => null]
            );

            $documents[$key] = [
                'title' => $document->title,
                'url' => $document->url ?? '',
            ];
        }

        return Inertia::render('Admin/DocumentLinks', [
            'documents' => $documents,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'documents.surat_perjanjian.url' => [
                'nullable',
                'url',
                function ($attribute, $value, $fail) {
                    if (!$value) {
                        return;
                    }

                    $host = parse_url($value, PHP_URL_HOST);

                    if (!in_array($host, [
                        'drive.google.com',
                        'docs.google.com',
                    ], true)) {
                        $fail('Gunakan tautan Google Drive atau Google Docs.');
                    }
                },
            ],
            'documents.surat_keaslian.url' => [
                'nullable',
                'url',
                function ($attribute, $value, $fail) {
                    if (!$value) {
                        return;
                    }

                    $host = parse_url($value, PHP_URL_HOST);

                    if (!in_array($host, [
                        'drive.google.com',
                        'docs.google.com',
                    ], true)) {
                        $fail('Gunakan tautan Google Drive atau Google Docs.');
                    }
                },
            ],

                        'documents.book_order_form.url' => [
                'nullable',
                'url',
                function ($attribute, $value, $fail) {
                    if (!$value) {
                        return;
                    }

                    $host = parse_url($value, PHP_URL_HOST);

                    if ($host !== 'docs.google.com') {
                        $fail('Gunakan tautan Google Forms dari docs.google.com.');
                    }
                },
            ],
        ]);

        foreach ($this->documents as $key => $title) {
            DocumentLink::updateOrCreate(
                ['key' => $key],
                [
                    'title' => $title,
                    'url' => $validated['documents'][$key]['url'] ?? null,
                ]
            );
        }

        return back()->with(
            'success',
            'Tautan dokumen berhasil diperbarui.'
        );
    }
}
