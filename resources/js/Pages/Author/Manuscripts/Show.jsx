
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
        submitted: 'bg-amber-100 text-amber-800 ring-amber-200',
        under_review: 'bg-blue-100 text-blue-800 ring-blue-200',
        revision: 'bg-orange-100 text-orange-800 ring-orange-200',
        accepted: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
        rejected: 'bg-red-100 text-red-800 ring-red-200',
        published: 'bg-indigo-100 text-indigo-800 ring-indigo-200',
    };

    return colors[status] ?? 'bg-gray-100 text-gray-700 ring-gray-200';
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

function formatDate(date, includeTime = false) {
    if (!date) return '-';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return '-';

    return parsedDate.toLocaleString(
        'id-ID',
        includeTime
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

const statusSteps = [
    {
        key: 'submitted',
        label: 'Naskah Dikirim',
        description: 'Pengajuan berhasil dikirim ke penerbit.',
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

function DocumentCard({ title, filename, href, buttonText, available = true }) {
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

                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">
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
                    {buttonText}
                </a>
            )}
        </div>
    );
}

export default function Show({ manuscript }) {
    const currentStatus = manuscript.status;

    const {
    data,
    setData,
    post,
    processing,
    errors,
    reset,
    } = useForm({
        manuscript_file: null,
        _method: 'put',
    });

    const submitRevision = (event) => {
        event.preventDefault();

        post(route('author.manuscripts.revision', manuscript.id), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const currentStepIndex = statusSteps.findIndex(
        (step) => step.key === currentStatus
    );

    const rejected = currentStatus === 'rejected';

    function isCompleted(index) {
        if (currentStepIndex < 0) return false;

        // Status ditolak bukan bagian dari urutan penerbitan normal.
        if (rejected) return index === 0;

        return index < currentStepIndex;
    }

    function isCurrent(index) {
        return !rejected && currentStepIndex === index;
    }

    function isUpcoming(index) {
        if (rejected) return index > 0;
        if (currentStepIndex < 0) return true;

        return index > currentStepIndex;
    }

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-sm text-gray-500">
                        Area Penulis
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-gray-900">
                        Detail Pengajuan Naskah
                    </h2>
                </div>
            }
        >
            <Head title={`Detail Naskah - ${manuscript.title}`} />

            <div className="min-h-screen bg-slate-50 py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {/* Tombol kembali */}
                    <Link
                        href={route('author.manuscripts.index')}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-indigo-700"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-4 w-4"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m15 18-6-6 6-6"
                            />
                        </svg>
                        Kembali ke Pengajuan Naskah
                    </Link>

                    {/* Header */}
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
                                    className={`inline-flex w-fit shrink-0 items-center rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset ${statusColor(
                                        currentStatus
                                    )}`}
                                >
                                    {statusLabel(currentStatus)}
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
                                    {serviceLabel(manuscript.service_type)}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Kategori Buku
                                </p>
                                <p className="mt-1 font-semibold text-gray-900">
                                    {manuscript.category?.name || 'Belum ditentukan'}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Informasi utama dan sidebar */}
                    <div className="grid items-stretch gap-6 lg:grid-cols-3">
                        <div className="flex flex-col gap-6 lg:col-span-2">
                            {/* Informasi naskah */}
                            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                                <SectionTitle
                                    title="Informasi Naskah"
                                    description="Informasi yang kamu kirimkan saat mengajukan naskah."
                                />

                                <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Judul Naskah
                                        </p>
                                        <p className="mt-1 font-semibold leading-6 text-gray-900">
                                            {manuscript.title}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Nomor WhatsApp
                                        </p>
                                        <p className="mt-1 font-medium text-gray-900">
                                            {manuscript.contact_phone || '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Jenis Layanan
                                        </p>
                                        <p className="mt-1 font-medium text-gray-900">
                                            {serviceLabel(manuscript.service_type)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Kategori Buku
                                        </p>
                                        <p className="mt-1 font-medium text-gray-900">
                                            {manuscript.category?.name || '-'}
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

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Status Pengajuan
                                        </p>
                                        <span
                                            className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusColor(
                                                currentStatus
                                            )}`}
                                        >
                                            {statusLabel(currentStatus)}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* Sinopsis */}
                            <section className="flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                                <SectionTitle
                                    title="Sinopsis"
                                    description="Ringkasan isi naskah yang kamu ajukan."
                                />

                                <p className="whitespace-pre-line break-words text-sm leading-7 text-gray-700 sm:text-base">
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
                                    description="Unduh dokumen yang terkait dengan pengajuan ini."
                                />

                                <div className="space-y-3">
                                    <DocumentCard
                                        title="File Naskah"
                                        filename={manuscript.original_filename || 'Dokumen naskah'}
                                        href={route(
                                            'author.manuscripts.download',
                                            manuscript.id
                                        )}
                                        buttonText="Unduh Naskah"
                                    />

                                    <DocumentCard
                                        title="Surat Perjanjian Penerbitan"
                                        href={
                                            manuscript.agreement_file_path
                                                ? route(
                                                      'author.manuscripts.documents.download',
                                                      {
                                                          manuscript: manuscript.id,
                                                          type: 'agreement',
                                                      }
                                                  )
                                                : null
                                        }
                                        buttonText="Unduh Surat"
                                        available={Boolean(
                                            manuscript.agreement_file_path
                                        )}
                                    />

                                    <DocumentCard
                                        title="Surat Pernyataan Keaslian Naskah"
                                        href={
                                            manuscript.originality_file_path
                                                ? route(
                                                      'author.manuscripts.documents.download',
                                                      {
                                                          manuscript: manuscript.id,
                                                          type: 'originality',
                                                      }
                                                  )
                                                : null
                                        }
                                        buttonText="Unduh Surat"
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
                                    description="Pantau perkembangan naskahmu."
                                />

                                {rejected && (
                                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3">
                                        <p className="text-sm font-semibold text-red-800">
                                            Naskah Ditolak
                                        </p>
                                        <p className="mt-1 text-sm leading-5 text-red-700">
                                            Pengajuan belum dapat dilanjutkan ke proses penerbitan.
                                        </p>
                                    </div>
                                )}

                                <div>
                                    {statusSteps.map((step, index) => {
                                        const completed = isCompleted(index);
                                        const current = isCurrent(index);
                                        const upcoming = isUpcoming(index);

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
                                </div>
                            </section>
                        </aside>
                    </div>

                    {/* Catatan editor - lebar penuh */}
                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                        <SectionTitle
                            title="Catatan Editor"
                            description="Masukan dari editor terkait pengajuan naskahmu."
                        />

                        {manuscript.editor_notes ? (
                            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 sm:p-5">
                                <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
                                    {manuscript.editor_notes}
                                </p>
                            </div>
                        ) : (
                            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8 10h8M8 14h5m-7 6-2.5 1 .8-3.4A8.5 8.5 0 1 1 20.5 15"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        Belum ada catatan dari editor
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Catatan akan ditampilkan di sini jika editor memberikan masukan.
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Riwayat review - lebar penuh */}
                    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
                            <SectionTitle
                                title="Riwayat Review"
                                description="Riwayat pemeriksaan dan keputusan editor terhadap naskah."
                            />

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                                    {manuscript.reviews?.length ?? 0} review
                                </span>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8">
                            {manuscript.reviews?.length > 0 ? (
                                <div className="grid gap-4 xl:grid-cols-2">
                                    {manuscript.reviews.map((review, index) => (
                                        <article
                                            key={review.id}
                                            className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-sm"
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
                                                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusColor(
                                                        review.status
                                                    )}`}
                                                >
                                                    {statusLabel(review.status)}
                                                </span>
                                            </div>

                                            <div className="mt-4">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Catatan Editor
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
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
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
                                                d="M8 10h8M8 14h5m-7 6-2.5 1 .8-3.4A8.5 8.5 0 1 1 20.5 15"
                                            />
                                        </svg>
                                    </div>
                                    <p className="mt-3 font-semibold text-gray-800">
                                        Belum ada riwayat review
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Riwayat akan muncul setelah editor mulai meninjau naskah.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Upload revisi */}
                    {currentStatus === 'revision' && (
                        <section className="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm">
                            <div className="border-b border-orange-100 bg-orange-50 px-6 py-5 sm:px-8">
                                <h2 className="text-lg font-bold text-orange-950">
                                    Upload Revisi Naskah
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-orange-800">
                                    Perbaiki naskah sesuai catatan editor, lalu unggah file revisi terbaru.
                                </p>
                            </div>

                            <form
                                onSubmit={submitRevision}
                                className="space-y-5 p-6 sm:p-8"
                            >
                                <div>
                                    <label
                                        htmlFor="manuscript_file"
                                        className="block text-sm font-semibold text-gray-700"
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
                                                event.target.files?.[0] ?? null
                                            )
                                        }
                                        className="mt-2 block w-full rounded-xl border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-indigo-50 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                                    />

                                    <p className="mt-2 text-xs text-gray-500">
                                        Format PDF, DOC, atau DOCX. Maksimal 20 MB.
                                    </p>

                                    {errors.manuscript_file && (
                                        <p className="mt-2 text-sm font-medium text-red-600">
                                            {errors.manuscript_file}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm text-gray-500">
                                        Pastikan file revisi yang dipilih sudah benar.
                                    </p>

                                    <button
                                        type="submit"
                                        disabled={processing || !data.manuscript_file}
                                        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {processing
                                            ? 'Mengirim Revisi...'
                                            : 'Kirim Revisi'}
                                    </button>
                                </div>
                            </form>
                        </section>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
