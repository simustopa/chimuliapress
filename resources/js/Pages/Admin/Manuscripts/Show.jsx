
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

const statusStyles = {
    submitted: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    under_review: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    revision: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    accepted: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    rejected: 'bg-red-50 text-red-700 ring-red-600/20',
    published: 'bg-violet-50 text-violet-700 ring-violet-600/20',
};

const serviceLabels = {
    book_textbook: 'Buku / Textbook',
    school_book: 'Buku Sekolah',
    reference_book: 'Buku Referensi',
    journal_article: 'Artikel Jurnal',
    haki_certificate: 'Sertifikat HAKI',
};

function formatDate(date, withTime = false) {
    if (!date) return '-';

    return new Date(date).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        ...(withTime && {
            hour: '2-digit',
            minute: '2-digit',
        }),
    });
}

function InfoItem({ label, value }) {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {label}
            </p>
            <p className="mt-1.5 text-sm font-semibold text-slate-800">
                {value || '-'}
            </p>
        </div>
    );
}

function SectionCard({ title, description, children }) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
                <h3 className="text-base font-bold text-slate-900">
                    {title}
                </h3>
                {description && (
                    <p className="mt-1 text-sm text-slate-500">
                        {description}
                    </p>
                )}
            </div>
            {children}
        </section>
    );
}

export default function Show({ manuscript }) {
    const statusStyle =
        statusStyles[manuscript.status] ??
        'bg-slate-100 text-slate-600 ring-slate-200';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Detail Naskah
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Informasi lengkap pengajuan naskah.
                        </p>
                    </div>

                    <Link
                        href={route('admin.manuscripts.index')}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                        ← Kembali ke daftar naskah
                    </Link>
                </div>
            }
        >
            <Head title={`Detail Naskah - ${manuscript.title}`} />

            <div className="min-h-screen bg-slate-50 py-8">
                <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">

                    {/* Judul dan status */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-indigo-600">
                                    Informasi Pengajuan
                                </p>

                                <h1 className="mt-2 text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
                                    {manuscript.title}
                                </h1>

                                <p className="mt-3 text-sm text-slate-500">
                                    Diajukan pada {formatDate(manuscript.created_at)}
                                </p>
                            </div>

                            <span
                                className={`inline-flex w-fit shrink-0 rounded-full px-4 py-2 text-xs font-semibold ring-1 ring-inset ${statusStyle}`}
                            >
                                {statusLabels[manuscript.status] ??
                                    manuscript.status}
                            </span>
                        </div>
                    </section>

                    {/* Author */}
                    <SectionCard
                        title="Informasi Author"
                        description="Identitas pengaju naskah."
                    >
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <InfoItem
                                label="Nama Author"
                                value={manuscript.user?.name}
                            />
                            <InfoItem
                                label="Email"
                                value={manuscript.user?.email}
                            />
                            <InfoItem
                                label="Nomor Kontak"
                                value={manuscript.contact_phone}
                            />
                            <InfoItem
                                label="Tanggal Pengajuan"
                                value={formatDate(manuscript.created_at, true)}
                            />
                        </div>
                    </SectionCard>

                    {/* Detail naskah */}
                    <SectionCard
                        title="Informasi Naskah"
                        description="Jenis layanan dan ringkasan naskah yang diajukan."
                    >
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <InfoItem
                                label="Jenis Layanan"
                                value={
                                    serviceLabels[manuscript.service_type] ??
                                    manuscript.service_type
                                }
                            />
                            <InfoItem
                                label="Kategori"
                                value={manuscript.category?.name ?? 'Tanpa kategori'}
                            />
                        </div>

                        <div className="mt-6 border-t border-slate-100 pt-5">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Sinopsis
                            </p>

                            <div className="mt-3 whitespace-pre-line rounded-xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                                {manuscript.synopsis || 'Belum ada sinopsis.'}
                            </div>
                        </div>
                    </SectionCard>

                    {/* File naskah */}
                    <SectionCard
                        title="File Naskah"
                        description="Berkas utama yang diunggah oleh author."
                    >
                        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-xl">
                                    📄
                                </div>

                                <div className="min-w-0">
                                    <p className="break-all text-sm font-semibold text-slate-800">
                                        {manuscript.original_filename ?? 'File naskah'}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Dokumen naskah utama
                                    </p>
                                </div>
                            </div>

                            {manuscript.file_path ? (
                                <a
                                    href={route(
                                        'admin.manuscripts.download',
                                        manuscript.id
                                    )}
                                    className="inline-flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    Download Naskah
                                    <span className="ml-2">↓</span>
                                </a>
                            ) : (
                                <span className="text-sm text-slate-400">
                                    File belum tersedia
                                </span>
                            )}
                        </div>
                    </SectionCard>

                    {/* Dokumen pendukung */}
                    {(manuscript.agreement_file_path ||
                        manuscript.originality_file_path) && (
                        <SectionCard
                            title="Dokumen Pendukung"
                            description="Dokumen tambahan yang disertakan dalam pengajuan."
                        >
                            <div className="space-y-3">
                                {manuscript.agreement_file_path && (
                                    <div className="rounded-xl border border-slate-200 p-4">
                                        <p className="text-sm font-semibold text-slate-800">
                                            Surat Perjanjian
                                        </p>
                                        <p className="mt-1 break-all text-xs text-slate-500">
                                            {manuscript.agreement_file_path}
                                        </p>
                                    </div>
                                )}

                                {manuscript.originality_file_path && (
                                    <div className="rounded-xl border border-slate-200 p-4">
                                        <p className="text-sm font-semibold text-slate-800">
                                            Surat Pernyataan Orisinalitas
                                        </p>
                                        <p className="mt-1 break-all text-xs text-slate-500">
                                            {manuscript.originality_file_path}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </SectionCard>
                    )}

                    {/* Catatan editor */}
                    <SectionCard
                        title="Catatan Editor"
                        description="Catatan atau hasil pemeriksaan terhadap naskah."
                    >
                        {manuscript.editor_notes ? (
                            <div className="whitespace-pre-line rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                                {manuscript.editor_notes}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                                <p className="text-sm font-medium text-slate-600">
                                    Belum ada catatan editor.
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                    Catatan akan ditampilkan di bagian ini setelah pemeriksaan.
                                </p>
                            </div>
                        )}

                        {manuscript.reviewed_at && (
                            <p className="mt-4 text-xs text-slate-400">
                                Terakhir ditinjau: {formatDate(manuscript.reviewed_at, true)}
                            </p>
                        )}
                    </SectionCard>

                    <div className="flex justify-end">
                        <Link
                            href={route('admin.manuscripts.index')}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Kembali ke Daftar Naskah
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
