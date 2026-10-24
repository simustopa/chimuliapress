import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const statusLabels = {
    submitted: 'Dikirim',
    under_review: 'Sedang Ditinjau',
    revision: 'Perlu Revisi',
    accepted: 'Diterima',
    rejected: 'Ditolak',
    published: 'Diterbitkan',
};

const serviceLabels = {
    book_textbook: 'Buku / Textbook',
    school_book: 'Buku Sekolah',
    reference_book: 'Buku Referensi',
    journal_article: 'Artikel Jurnal',
    haki_certificate: 'Sertifikat HAKI',
};

const statusClass = (status) => {
    switch (status) {
        case 'submitted':
            return 'bg-blue-100 text-blue-800';

        case 'under_review':
            return 'bg-yellow-100 text-yellow-800';

        case 'revision':
            return 'bg-orange-100 text-orange-800';

        case 'accepted':
            return 'bg-green-100 text-green-800';

        case 'rejected':
            return 'bg-red-100 text-red-800';

        case 'published':
            return 'bg-purple-100 text-purple-800';

        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function Show({ manuscript }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('admin.manuscripts.index')}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        ← Kembali
                    </Link>

                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Detail Naskah
                    </h2>
                </div>
            }
        >
            <Head title={`Detail - ${manuscript.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">

                    {/* Informasi utama */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Judul Naskah
                                </p>

                                <h1 className="mt-1 text-2xl font-bold text-gray-900">
                                    {manuscript.title}
                                </h1>
                            </div>

                            <span
                                className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium ${statusClass(
                                    manuscript.status
                                )}`}
                            >
                                {statusLabels[manuscript.status] ??
                                    manuscript.status}
                            </span>
                        </div>
                    </div>

                    {/* Data Author */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Informasi Author
                        </h3>

                        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Nama
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {manuscript.user?.name ?? '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Email
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {manuscript.user?.email ?? '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Nomor Kontak
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {manuscript.contact_phone ?? '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Tanggal Pengajuan
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {new Date(
                                        manuscript.created_at
                                    ).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Informasi Naskah */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Informasi Naskah
                        </h3>

                        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Jenis Layanan
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {serviceLabels[
                                        manuscript.service_type
                                    ] ??
                                        manuscript.service_type ??
                                        '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Kategori
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {manuscript.category?.name ??
                                        'Tanpa kategori'}
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">
                                    Sinopsis
                                </p>

                                <div className="mt-2 whitespace-pre-line rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                                    {manuscript.synopsis || '-'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* File Naskah */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900">
                            File Naskah
                        </h3>

                        <div className="mt-4 flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {manuscript.original_filename ?? '-'}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    File yang diunggah oleh author
                                </p>
                            </div>

                            <a
                                href={route(
                                    'admin.manuscripts.download',
                                    manuscript.id
                                )}
                                className="inline-flex w-fit items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                            >
                                Download Naskah
                            </a>
                        </div>
                    </div>

                    {/* Catatan Editor */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Catatan Editor
                        </h3>

                        <div className="mt-4 rounded-lg bg-gray-50 p-4">
                            {manuscript.editor_notes ? (
                                <p className="whitespace-pre-line text-sm leading-6 text-gray-700">
                                    {manuscript.editor_notes}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Belum ada catatan dari editor.
                                </p>
                            )}
                        </div>

                        {manuscript.reviewed_at && (
                            <p className="mt-3 text-xs text-gray-500">
                                Terakhir direview:{' '}
                                {new Date(
                                    manuscript.reviewed_at
                                ).toLocaleString('id-ID')}
                            </p>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
