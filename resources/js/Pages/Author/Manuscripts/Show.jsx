import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

function statusLabel(status) {
    const labels = {
        submitted: 'Menunggu Peninjauan',
        under_review: 'Sedang Ditinjau',
        revision: 'Perlu Revisi',
        accepted: 'Diterima',
        rejected: 'Ditolak',
        published: 'Diterbitkan',
    };

    return labels[status] ?? status;
}

function statusColor(status) {
    const colors = {
        submitted: 'bg-amber-100 text-amber-800',
        under_review: 'bg-blue-100 text-blue-800',
        revision: 'bg-orange-100 text-orange-800',
        accepted: 'bg-emerald-100 text-emerald-800',
        rejected: 'bg-red-100 text-red-800',
        published: 'bg-indigo-100 text-indigo-800',
    };

    return colors[status] ?? 'bg-gray-100 text-gray-700';
}

function serviceLabel(service) {
    const services = {
        book_textbook: 'Buku Teks / Buku Ajar',
        school_book: 'Buku Sekolah',
        reference_book: 'Buku Referensi',
        journal_article: 'Artikel Jurnal',
        haki_certificate: 'Sertifikasi HAKI',
    };

    return services[service] ?? service;
}

const statusSteps = [
    {
        key: 'submitted',
        label: 'Naskah Dikirim',
        description: 'Naskah berhasil dikirim ke penerbit.',
    },
    {
        key: 'under_review',
        label: 'Sedang Ditinjau',
        description: 'Naskah sedang ditinjau oleh tim editor.',
    },
    {
        key: 'revision',
        label: 'Perlu Revisi',
        description: 'Naskah membutuhkan revisi dari penulis.',
    },
    {
        key: 'accepted',
        label: 'Diterima',
        description: 'Naskah telah diterima untuk proses penerbitan.',
    },
    {
        key: 'published',
        label: 'Diterbitkan',
        description: 'Naskah telah diterbitkan.',
    },
];

export default function Show({ manuscript }) {
    const currentStatus = manuscript.status;

    const {
        data,
        setData,
        put,
        processing,
        errors,
        reset,
    } = useForm({
        manuscript_file: null,
    });

    const submitRevision = (event) => {
    event.preventDefault();

        put(
            route('author.manuscripts.revision', manuscript.id),
            {
                forceFormData: true,
                onSuccess: () => {
                    reset();
                },
            }
        );
    };

    const currentStepIndex = statusSteps.findIndex(
        (step) => step.key === currentStatus
    );

    function isCompleted(index) {
    return currentStepIndex >= 0 && index < currentStepIndex;
    }

    function isCurrent(index) {
        return currentStepIndex === index;
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Detail Pengajuan Naskah
                </h2>
            }
        >
            <Head title="Detail Pengajuan Naskah" />

            <div className="py-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

                    {/* Tombol kembali */}
                    <div className="mb-6">
                        <Link
                            href={route('author.manuscripts.index')}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                            ← Kembali ke Pengajuan Naskah
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="mb-2 text-sm text-gray-500">
                                    Pengajuan Naskah
                                </p>

                                <h1 className="text-2xl font-bold text-gray-900">
                                    {manuscript.title}
                                </h1>
                            </div>

                            <span
                                className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium ${statusColor(
                                    manuscript.status
                                )}`}
                            >
                                <p className="mt-1 text-sm font-medium text-gray-800">
                                    {statusLabel(manuscript.status)}
                                </p>
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">

                        {/* Informasi utama */}
                        <div className="lg:col-span-2">
                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <h2 className="mb-6 text-lg font-semibold text-gray-900">
                                    Informasi Naskah
                                </h2>

                                <div className="space-y-5">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Judul
                                        </p>

                                        <p className="mt-1 font-medium text-gray-900">
                                            {manuscript.title}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Nomor WhatsApp
                                        </p>

                                        <p className="mt-1 text-gray-900">
                                            {manuscript.contact_phone || '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Jenis Layanan
                                        </p>

                                        <p className="mt-1 text-gray-900">
                                            {serviceLabel(manuscript.service_type)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Kategori Buku
                                        </p>

                                        <p className="mt-1 text-gray-900">
                                            {manuscript.category?.name || '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Tanggal Pengajuan
                                        </p>

                                        <p className="mt-1 text-gray-900">
                                            {new Date(
                                                manuscript.created_at
                                            ).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Sinopsis */}
                            <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                    Sinopsis
                                </h2>

                                <p className="whitespace-pre-line leading-7 text-gray-700">
                                    {manuscript.synopsis}
                                </p>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">

                            {/* Dokumen Pengajuan */}
                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                    Dokumen Pengajuan
                                </h2>

                                {/* File Naskah Utama */}
                                <div className="mb-4 rounded-lg bg-gray-50 p-4">
                                    <p className="text-sm font-semibold text-gray-900">
                                        📄 File Naskah
                                    </p>

                                    <p className="mt-1 break-all text-sm text-gray-600">
                                        {manuscript.original_filename || 'Dokumen naskah'}
                                    </p>

                                    <a
                                        href={route('author.manuscripts.download', manuscript.id)}
                                        className="mt-3 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                                    >
                                        Download Naskah
                                    </a>
                                </div>

                                {/* Surat Perjanjian */}
                                <div className="mb-4 rounded-lg bg-gray-50 p-4">
                                    <p className="text-sm font-semibold text-gray-900">
                                        📄 Surat Perjanjian Penerbitan
                                    </p>

                                    {manuscript.agreement_file_path ? (
                                        <a
                                            href={route(
                                                'author.manuscripts.documents.download',
                                                {
                                                    manuscript: manuscript.id,
                                                    type: 'agreement',
                                                }
                                            )}
                                            className="mt-3 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                                        >
                                            Download Surat Perjanjian
                                        </a>
                                    ) : (
                                        <p className="mt-2 text-sm text-gray-500">
                                            Surat perjanjian belum tersedia.
                                        </p>
                                    )}
                                </div>

                                {/* Surat Pernyataan Keaslian */}
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="text-sm font-semibold text-gray-900">
                                        📄 Surat Pernyataan Keaslian Naskah
                                    </p>

                                    {manuscript.originality_file_path ? (
                                        <a
                                            href={route(
                                                'author.manuscripts.documents.download',
                                                {
                                                    manuscript: manuscript.id,
                                                    type: 'originality',
                                                }
                                            )}
                                            className="mt-3 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                                        >
                                            Download Surat Keaslian
                                        </a>
                                    ) : (
                                        <p className="mt-2 text-sm text-gray-500">
                                            Surat pernyataan keaslian belum tersedia.
                                        </p>
                                    )}
                                </div>
                            </div>


                            {/* Status Pengajuan */}
                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <h2 className="mb-6 text-lg font-semibold text-gray-900">
                                    Status Pengajuan
                                </h2>

                                <div className="space-y-0">
                                    {statusSteps.map((step, index) => {
                                        const completed = isCompleted(index);
                                        const current = isCurrent(index);

                                        return (
                                            <div
                                                key={step.key}
                                                className="relative flex gap-4"
                                            >
                                                {/* Garis */}
                                                {index < statusSteps.length - 1 && (
                                                    <div
                                                        className={`absolute left-[15px] top-8 h-full w-0.5 ${
                                                            completed
                                                                ? 'bg-indigo-500'
                                                                : 'bg-gray-200'
                                                        }`}
                                                    />
                                                )}

                                                {/* Bulatan */}
                                                <div className="relative z-10 flex-shrink-0">
                                                    <div
                                                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                                                            completed
                                                                ? 'bg-indigo-600 text-white'
                                                                : current
                                                                ? 'bg-indigo-100 text-indigo-700 ring-4 ring-indigo-50'
                                                                : 'bg-gray-100 text-gray-400'
                                                        }`}
                                                    >
                                                        {completed ? '✓' : index + 1}
                                                    </div>
                                                </div>

                                                {/* Isi */}
                                                <div className="pb-8">
                                                    <p
                                                        className={`font-semibold ${
                                                            current || completed
                                                                ? 'text-gray-900'
                                                                : 'text-gray-400'
                                                        }`}
                                                    >
                                                        {step.label}
                                                    </p>

                                                    <p
                                                        className={`mt-1 text-sm ${
                                                            current || completed
                                                                ? 'text-gray-600'
                                                                : 'text-gray-400'
                                                        }`}
                                                    >
                                                        {step.description}
                                                    </p>

                                                    {current && (
                                                        <span className="mt-2 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                                                            Status saat ini
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Status ditolak */}
                                {currentStatus === 'rejected' && (
                                    <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-4">
                                        <p className="font-semibold text-red-800">
                                            Naskah Ditolak
                                        </p>

                                        <p className="mt-1 text-sm text-red-700">
                                            Pengajuan naskah belum dapat dilanjutkan ke proses
                                            penerbitan.
                                        </p>
                                    </div>
                                )}
                            </div>
                            {/* Catatan editor */}
                            <div className="rounded-xl bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                    Catatan Editor
                                </h2>

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

                            {/* Riwayat Review */}
                            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <h2 className="font-semibold text-gray-900">
                                        Riwayat Review
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Riwayat hasil review dan catatan dari editor.
                                    </p>
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
                                                            {statusLabel(review.status)}
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

                            {/* Upload Revisi */}
                            {currentStatus === 'revision' && (
                                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                                    <div className="border-b border-gray-200 px-6 py-4">
                                        <h2 className="font-semibold text-gray-900">
                                            Upload Revisi
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Silakan upload file naskah yang sudah diperbaiki sesuai
                                            catatan editor.
                                        </p>
                                    </div>

                                    <form
                                        onSubmit={submitRevision}
                                        className="space-y-5 px-6 py-5"
                                    >
                                        <div>
                                            <label
                                                htmlFor="manuscript_file"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                File Naskah Revisi
                                            </label>

                                            <input
                                                id="manuscript_file"
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(event) =>
                                                    setData(
                                                        'manuscript_file',
                                                        event.target.files[0]
                                                    )
                                                }
                                                className="mt-2 block w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                                            />

                                            <p className="mt-2 text-xs text-gray-500">
                                                Format: PDF, DOC, atau DOCX. Maksimal 20 MB.
                                            </p>

                                            {errors.manuscript_file && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors.manuscript_file}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={
                                                    processing || !data.manuscript_file
                                                }
                                                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {processing
                                                    ? 'Mengirim Revisi...'
                                                    : 'Kirim Revisi'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
