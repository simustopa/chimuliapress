
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const serviceLabels = {
    book_textbook: 'Buku Teks / Buku Ajar',
    school_book: 'Buku Sekolah',
    reference_book: 'Buku Referensi',
    journal_article: 'Artikel Jurnal',
    haki_certificate: 'Sertifikasi HAKI',
};

const statusLabels = {
    submitted: 'Menunggu Peninjauan',
    under_review: 'Sedang Ditinjau',
    revision: 'Perlu Revisi',
    accepted: 'Diterima',
    rejected: 'Ditolak',
    published: 'Diterbitkan',
};

const statusColors = {
    submitted: 'bg-amber-100 text-amber-800 ring-amber-200',
    under_review: 'bg-blue-100 text-blue-800 ring-blue-200',
    revision: 'bg-orange-100 text-orange-800 ring-orange-200',
    accepted: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
    rejected: 'bg-red-100 text-red-800 ring-red-200',
    published: 'bg-indigo-100 text-indigo-800 ring-indigo-200',
};

const statusSteps = [
    {
        key: 'submitted',
        label: 'Naskah Dikirim',
        description: 'Pengajuan berhasil dikirim oleh penulis.',
    },
    {
        key: 'under_review',
        label: 'Sedang Ditinjau',
        description: 'Naskah sedang ditinjau oleh tim editor.',
    },
    {
        key: 'revision',
        label: 'Perlu Revisi',
        description: 'Naskah membutuhkan perbaikan dari penulis.',
    },
    {
        key: 'accepted',
        label: 'Diterima',
        description: 'Naskah diterima untuk proses penerbitan.',
    },
    {
        key: 'published',
        label: 'Diterbitkan',
        description: 'Naskah telah diterbitkan.',
    },
];

function formatDate(date, withTime = false) {
    if (!date) return '-';

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return '-';

    return parsed.toLocaleString(
        'id-ID',
        withTime
            ? {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
              }
            : {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
              }
    );
}

function DocumentCard({ title, filename, href, available = true }) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="h-6 w-6"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 3.75h6l5 5v11.5H7a2 2 0 0 1-2-2v-12.5a2 2 0 0 1 2-2Z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 3.75v5h5M8.5 13h6M8.5 16.5h6"
                        />
                    </svg>
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold leading-6 text-gray-900">
                        {title}
                    </h3>

                    {filename && (
                        <p className="mt-1 break-all text-xs leading-5 text-gray-500">
                            {filename}
                        </p>
                    )}

                    {!available && (
                        <p className="mt-1 text-xs text-amber-700">
                            Dokumen belum tersedia.
                        </p>
                    )}
                </div>
            </div>

            {available && href && (
                <a
                    href={href}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 3.75v11m0 0 4-4m-4 4-4-4M5 16.5v2.25A1.5 1.5 0 0 0 6.5 20.25h11a1.5 1.5 0 0 0 1.5-1.5V16.5"
                        />
                    </svg>
                    Unduh Dokumen
                </a>
            )}
        </div>
    );
}

function SectionTitle({ title, description }) {
    return (
        <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            {description && (
                <p className="mt-1 text-sm leading-6 text-gray-500">
                    {description}
                </p>
            )}
        </div>
    );
}

export default function Show({ manuscript, flash = {} }) {
    const {
        data,
        setData,
        put,
        processing,
        errors,
    } = useForm({
        status: manuscript.status ?? 'under_review',
        editor_notes: manuscript.editor_notes ?? '',
    });

    const submitReview = (event) => {
        event.preventDefault();

        put(route('editor.manuscripts.update', manuscript.id));
    };

    const currentStatus = manuscript.status;
    const currentStepIndex = statusSteps.findIndex(
        (step) => step.key === currentStatus
    );

    const isRejected = currentStatus === 'rejected';

    function isCompleted(index) {
        if (currentStepIndex < 0) return false;
        if (isRejected) return index === 0;

        return index < currentStepIndex;
    }

    function isCurrent(index) {
        return !isRejected && currentStepIndex === index;
    }

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-sm text-gray-500">Area Editor</p>
                    <h2 className="mt-1 text-xl font-bold text-gray-900">
                        Detail dan Review Naskah
                    </h2>
                </div>
            }
        >
            <Head title={`Review - ${manuscript.title}`} />

            <div className="min-h-screen bg-slate-50 py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {flash.success && (
                        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                            {flash.success}
                        </div>
                    )}

                    <Link
                        href={route('editor.dashboard')}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-indigo-700"
                    >
                        <span aria-hidden="true">←</span>
                        Kembali ke Dashboard
                    </Link>

                    {/* Header naskah */}
                    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-700 px-6 py-7 sm:px-8">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-indigo-200">
                                        Detail Pengajuan Naskah
                                    </p>

                                    <h1 className="mt-2 break-words text-2xl font-bold text-white sm:text-3xl">
                                        {manuscript.title}
                                    </h1>

                                    <p className="mt-2 text-sm text-indigo-100">
                                        Nomor pengajuan #{manuscript.id}
                                    </p>
                                </div>

                                <span
                                    className={`inline-flex w-fit shrink-0 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset ${
                                        statusColors[currentStatus] ??
                                        'bg-gray-100 text-gray-700 ring-gray-200'
                                    }`}
                                >
                                    {statusLabels[currentStatus] ?? currentStatus}
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-5 px-6 py-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Tanggal Pengajuan
                                </p>
                                <p className="mt-1 font-semibold text-gray-900">
                                    {formatDate(manuscript.created_at)}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Jenis Layanan
                                </p>
                                <p className="mt-1 font-semibold text-gray-900">
                                    {serviceLabels[manuscript.service_type] ??
                                        manuscript.service_type ??
                                        '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Kategori Buku
                                </p>
                                <p className="mt-1 font-semibold text-gray-900">
                                    {manuscript.category?.name ?? '-'}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Informasi dan sidebar */}
                    <div className="grid items-stretch gap-6 lg:grid-cols-3">
                        <div className="flex flex-col gap-6 lg:col-span-2">
                            {/* Informasi penulis */}
                            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                                <SectionTitle
                                    title="Informasi Naskah"
                                    description="Informasi penulis dan naskah yang diajukan."
                                />

                                <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Nama Penulis
                                        </p>
                                        <p className="mt-1 font-semibold text-gray-900">
                                            {manuscript.user?.name ?? '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Email Penulis
                                        </p>
                                        <p className="mt-1 break-all font-medium text-gray-900">
                                            {manuscript.user?.email ?? '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Nomor WhatsApp
                                        </p>
                                        <p className="mt-1 font-medium text-gray-900">
                                            {manuscript.contact_phone ?? '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Jenis Layanan
                                        </p>
                                        <p className="mt-1 font-medium text-gray-900">
                                            {serviceLabels[manuscript.service_type] ??
                                                manuscript.service_type ??
                                                '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Kategori Buku
                                        </p>
                                        <p className="mt-1 font-medium text-gray-900">
                                            {manuscript.category?.name ?? '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Tanggal Pengajuan
                                        </p>
                                        <p className="mt-1 font-medium text-gray-900">
                                            {formatDate(manuscript.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Sinopsis */}
                            <section className="flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                                <SectionTitle
                                    title="Sinopsis"
                                    description="Ringkasan isi naskah yang dikirimkan penulis."
                                />

                                <p className="whitespace-pre-line break-words text-sm leading-7 text-gray-700">
                                    {manuscript.synopsis || 'Belum ada sinopsis.'}
                                </p>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-6">
                            {/* Dokumen */}
                            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                                <SectionTitle
                                    title="Dokumen Pengajuan"
                                    description="Unduh file yang dikirim oleh penulis."
                                />

                                <div className="space-y-3">
                                    <DocumentCard
                                        title="File Naskah"
                                        filename={
                                            manuscript.original_filename ?? 'Naskah'
                                        }
                                        href={route(
                                            'editor.manuscripts.download',
                                            manuscript.id
                                        )}
                                    />

                                    <DocumentCard
                                        title="Surat Perjanjian Penerbitan"
                                        href={
                                            manuscript.agreement_file_path
                                                ? route(
                                                      'editor.manuscripts.documents.download',
                                                      {
                                                          manuscript: manuscript.id,
                                                          type: 'agreement',
                                                      }
                                                  )
                                                : null
                                        }
                                        available={Boolean(
                                            manuscript.agreement_file_path
                                        )}
                                    />

                                    <DocumentCard
                                        title="Surat Pernyataan Keaslian Naskah"
                                        href={
                                            manuscript.originality_file_path
                                                ? route(
                                                      'editor.manuscripts.documents.download',
                                                      {
                                                          manuscript: manuscript.id,
                                                          type: 'originality',
                                                      }
                                                  )
                                                : null
                                        }
                                        available={Boolean(
                                            manuscript.originality_file_path
                                        )}
                                    />
                                </div>
                            </section>

                            {/* Timeline status */}
                            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                                <SectionTitle
                                    title="Status Pengajuan"
                                    description="Tahapan proses naskah."
                                />

                                {isRejected && (
                                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3">
                                        <p className="text-sm font-semibold text-red-800">
                                            Naskah Ditolak
                                        </p>
                                        <p className="mt-1 text-sm leading-5 text-red-700">
                                            Pengajuan belum dapat dilanjutkan ke proses penerbitan.
                                        </p>
                                    </div>
                                )}

                                {statusSteps.map((step, index) => {
                                    const completed = isCompleted(index);
                                    const current = isCurrent(index);
                                    const upcoming =
                                        !completed && !current;

                                    return (
                                        <div
                                            key={step.key}
                                            className="relative flex gap-3 pb-6 last:pb-0"
                                        >
                                            {index < statusSteps.length - 1 && (
                                                <div
                                                    className={`absolute left-4 top-8 h-[calc(100%-1rem)] w-0.5 ${
                                                        completed
                                                            ? 'bg-indigo-500'
                                                            : 'bg-gray-200'
                                                    }`}
                                                />
                                            )}

                                            <div
                                                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                                    completed
                                                        ? 'bg-indigo-600 text-white'
                                                        : current
                                                          ? 'bg-indigo-100 text-indigo-700 ring-4 ring-indigo-50'
                                                          : 'bg-gray-100 text-gray-400'
                                                }`}
                                            >
                                                {completed ? '✓' : index + 1}
                                            </div>

                                            <div className="min-w-0 flex-1 pt-1">
                                                <p
                                                    className={`text-sm font-semibold ${
                                                        current || completed
                                                            ? 'text-gray-900'
                                                            : 'text-gray-400'
                                                    }`}
                                                >
                                                    {step.label}
                                                </p>

                                                <p
                                                    className={`mt-1 text-xs leading-5 ${
                                                        upcoming
                                                            ? 'text-gray-400'
                                                            : 'text-gray-500'
                                                    }`}
                                                >
                                                    {step.description}
                                                </p>

                                                {current && (
                                                    <span className="mt-2 inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                                        Status saat ini
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </section>
                        </aside>
                    </div>

                    {/* Catatan editor */}
                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                        <SectionTitle
                            title="Catatan Editor"
                            description="Catatan yang saat ini tersimpan untuk penulis."
                        />

                        {manuscript.editor_notes ? (
                            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 sm:p-5">
                                <p className="whitespace-pre-line break-words text-sm leading-7 text-gray-700">
                                    {manuscript.editor_notes}
                                </p>
                            </div>
                        ) : (
                            <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                                Belum ada catatan dari editor.
                            </p>
                        )}
                    </section>

                    {/* Riwayat review */}
                    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
                            <SectionTitle
                                title="Riwayat Review"
                                description="Riwayat pemeriksaan dan keputusan editor."
                            />
                            <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                                {manuscript.reviews?.length ?? 0} review
                            </span>
                        </div>

                        <div className="p-6 sm:p-8">
                            {manuscript.reviews?.length > 0 ? (
                                <div className="grid gap-4 xl:grid-cols-2">
                                    {manuscript.reviews.map((review, index) => (
                                        <article
                                            key={review.id}
                                            className="rounded-xl border border-gray-200 p-5 transition hover:border-indigo-200 hover:shadow-sm"
                                        >
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <p className="font-bold text-gray-900">
                                                        Review #
                                                        {manuscript.reviews.length - index}
                                                    </p>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Oleh {review.reviewer?.name ?? 'Editor'}
                                                    </p>
                                                </div>

                                                <p className="text-xs text-gray-500">
                                                    {formatDate(review.reviewed_at, true)}
                                                </p>
                                            </div>

                                            <div className="mt-4 border-t border-gray-100 pt-4">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Status Review
                                                </p>
                                                <span
                                                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                        statusColors[review.status] ??
                                                        'bg-gray-100 text-gray-700'
                                                    }`}
                                                >
                                                    {statusLabels[review.status] ??
                                                        review.status}
                                                </span>
                                            </div>

                                            <div className="mt-4">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Catatan
                                                </p>
                                                <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-gray-700">
                                                    {review.notes || 'Tidak ada catatan.'}
                                                </p>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center">
                                    <p className="font-semibold text-gray-800">
                                        Belum ada riwayat review
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Riwayat akan muncul setelah proses review dilakukan.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Form review editor */}
                    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
                            <SectionTitle
                                title="Proses Review"
                                description="Perbarui status dan berikan catatan untuk penulis."
                            />
                        </div>

                        <form
                            onSubmit={submitReview}
                            className="space-y-6 p-6 sm:p-8"
                        >
                            <div>
                                <label
                                    htmlFor="status"
                                    className="block text-sm font-semibold text-gray-700"
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

                            <div>
                                <label
                                    htmlFor="editor_notes"
                                    className="block text-sm font-semibold text-gray-700"
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

                            <div className="flex justify-end border-t border-gray-100 pt-5">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Review'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
