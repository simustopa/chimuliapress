import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const serviceLabels = {
    book_textbook: 'Buku / Buku Ajar',
    school_book: 'Buku Sekolah',
    reference_book: 'Buku Referensi',
    journal_article: 'Artikel Jurnal',
    haki_certificate: 'Sertifikasi HAKI',
};

const statusLabels = {
    submitted: 'Dikirim',
    under_review: 'Sedang Ditinjau',
    revision: 'Perlu Revisi',
    accepted: 'Diterima',
    rejected: 'Ditolak',
    published: 'Diterbitkan',
};

const statusColors = {
    submitted: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    revision: 'bg-orange-100 text-orange-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    published: 'bg-purple-100 text-purple-800',
};

export default function Show({ manuscript, flash = {} }) {
    const { data, setData, put, processing, errors } = useForm({
    status: manuscript.status ?? 'submitted',
    editor_notes: manuscript.editor_notes ?? '',
    });

    const submitReview = (event) => {
        event.preventDefault();

        put(route('editor.manuscripts.update', manuscript.id));
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Review Naskah
                </h2>
            }
        >
            <Head title={`Review - ${manuscript.title}`} />

            <div className="py-8">
                <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}
                    {/* Tombol kembali */}
                    <div>
                        <Link
                            href={route('editor.dashboard')}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                        >
                            ← Kembali ke Dashboard
                        </Link>
                    </div>

                    {/* Informasi utama */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {manuscript.title}
                                    </h1>

                                    <p className="mt-2 text-sm text-gray-500">
                                        Dikirim pada{' '}
                                        {new Date(
                                            manuscript.created_at
                                        ).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>

                                <span
                                    className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium ${
                                        statusColors[manuscript.status] ??
                                        'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {statusLabels[manuscript.status] ??
                                        manuscript.status}
                                </span>
                            </div>
                        </div>

                        {/* Data penulis */}
                        <div className="grid gap-6 px-6 py-6 md:grid-cols-2">

                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Penulis
                                </p>

                                <p className="mt-1 text-sm text-gray-900">
                                    {manuscript.user?.name ?? '-'}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    {manuscript.user?.email ?? '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Nomor Kontak
                                </p>

                                <p className="mt-1 text-sm text-gray-900">
                                    {manuscript.contact_phone ?? '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Jenis Layanan
                                </p>

                                <p className="mt-1 text-sm text-gray-900">
                                    {serviceLabels[manuscript.service_type] ??
                                        manuscript.service_type ??
                                        '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Kategori
                                </p>

                                <p className="mt-1 text-sm text-gray-900">
                                    {manuscript.category?.name ?? '-'}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Sinopsis */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="font-semibold text-gray-900">
                                Sinopsis
                            </h2>
                        </div>

                        <div className="px-6 py-5">
                            <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
                                {manuscript.synopsis || '-'}
                            </p>
                        </div>
                    </div>

                    {/* File naskah */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="font-semibold text-gray-900">
                                File Naskah
                            </h2>
                        </div>

                        <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {manuscript.original_filename ?? 'Naskah'}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    File yang dikirim oleh penulis
                                </p>
                            </div>

                            <a
                                href={route(
                                    'editor.manuscripts.download',
                                    manuscript.id
                                )}
                                className="inline-flex w-fit items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                            >
                                Download Naskah
                            </a>
                        </div>
                    </div>

                    {/* Catatan editor */}
                    {manuscript.editor_notes && (
                        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                            <div className="border-b border-gray-200 px-6 py-4">
                                <h2 className="font-semibold text-gray-900">
                                    Catatan Editor
                                </h2>
                            </div>

                            <div className="px-6 py-5">
                                <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
                                    {manuscript.editor_notes}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* RIWAYAT REVIEW */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="font-semibold text-gray-900">
                                Riwayat Review
                            </h2>
                        </div>

                        <div className="px-6 py-5">
                            {manuscript.reviews?.length > 0 ? (
                                <div className="space-y-4">
                                    {manuscript.reviews.map((review, index) => (
                                        <div
                                            key={review.id}
                                            className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                                        >
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        Review #{manuscript.reviews.length - index}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Oleh:{' '}
                                                        {review.reviewer?.name ?? 'Editor'}
                                                    </p>
                                                </div>

                                                <span className="text-xs text-gray-500">
                                                    {review.reviewed_at
                                                        ? new Date(
                                                            review.reviewed_at
                                                        ).toLocaleString('id-ID')
                                                        : '-'}
                                                </span>
                                            </div>

                                            <div className="mt-4">
                                                <p className="text-xs font-medium uppercase text-gray-500">
                                                    Status
                                                </p>

                                                <p className="mt-1 text-sm font-medium text-gray-800">
                                                    {statusLabels[review.status] ??
                                                        review.status}
                                                </p>
                                            </div>

                                            <div className="mt-4">
                                                <p className="text-xs font-medium uppercase text-gray-500">
                                                    Catatan
                                                </p>

                                                <p className="mt-1 whitespace-pre-line text-sm leading-6 text-gray-700">
                                                    {review.notes || 'Tidak ada catatan.'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Belum ada riwayat review.
                                </p>
                            )}
                        </div>
                    </div>


                    {/* Form Review Editor */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="font-semibold text-gray-900">
                                Proses Review
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Perbarui status dan berikan catatan untuk penulis.
                            </p>
                        </div>

                        <form onSubmit={submitReview} className="space-y-6 px-6 py-6">

                            {/* Status */}
                            <div>
                                <label
                                    htmlFor="status"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Status Naskah
                                </label>

                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(event) =>
                                        setData('status', event.target.value)
                                    }
                                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="under_review">
                                        Sedang Ditinjau
                                    </option>

                                    <option value="revision">
                                        Perlu Revisi
                                    </option>

                                    <option value="accepted">
                                        Diterima
                                    </option>

                                    <option value="rejected">
                                        Ditolak
                                    </option>

                                    <option value="published">
                                        Diterbitkan
                                    </option>
                                </select>

                                {errors.status && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.status}
                                    </p>
                                )}
                            </div>

                            {/* Catatan */}
                            <div>
                                <label
                                    htmlFor="editor_notes"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Catatan Editor
                                </label>

                                <textarea
                                    id="editor_notes"
                                    value={data.editor_notes}
                                    onChange={(event) =>
                                        setData('editor_notes', event.target.value)
                                    }
                                    rows={6}
                                    placeholder="Tuliskan hasil review, catatan revisi, atau keputusan terhadap naskah..."
                                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />

                                {errors.editor_notes && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.editor_notes}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Review'}
                                </button>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
