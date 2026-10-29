
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const statusConfig = {
    submitted: {
        label: 'Menunggu review',
        className: 'bg-amber-50 text-amber-700 ring-amber-200',
        dot: 'bg-amber-500',
    },
    under_review: {
        label: 'Sedang ditinjau',
        className: 'bg-blue-50 text-blue-700 ring-blue-200',
        dot: 'bg-blue-500',
    },
    revision: {
        label: 'Perlu revisi',
        className: 'bg-orange-50 text-orange-700 ring-orange-200',
        dot: 'bg-orange-500',
    },
    accepted: {
        label: 'Diterima',
        className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        dot: 'bg-emerald-500',
    },
    rejected: {
        label: 'Ditolak',
        className: 'bg-rose-50 text-rose-700 ring-rose-200',
        dot: 'bg-rose-500',
    },
    published: {
        label: 'Diterbitkan',
        className: 'bg-violet-50 text-violet-700 ring-violet-200',
        dot: 'bg-violet-500',
    },
};

function formatDate(date) {
    if (!date) return '-';

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(date));
}

function StatusBadge({ status }) {
    const config = statusConfig[status] ?? {
        label: status ?? 'Tidak diketahui',
        className: 'bg-gray-50 text-gray-600 ring-gray-200',
        dot: 'bg-gray-400',
    };

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${config.className}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}

function StatCard({ icon, label, value, description, accent }) {
    return (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        {label}
                    </p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                        {value ?? 0}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                        {description}
                    </p>
                </div>

                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${accent}`}
                    aria-hidden="true"
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}

function SectionHeading({ eyebrow, title, description, href, linkText }) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                {eyebrow && (
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
                        {eyebrow}
                    </p>
                )}
                <h3 className="text-lg font-bold text-gray-900">
                    {title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    {description}
                </p>
            </div>

            {href && (
                <Link
                    href={href}
                    className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 sm:self-center"
                >
                    {linkText}
                    <span aria-hidden="true">→</span>
                </Link>
            )}
        </div>
    );
}

function EmptyState({ title, description }) {
    return (
        <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                📋
            </div>
            <p className="mt-4 font-semibold text-gray-800">{title}</p>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
                {description}
            </p>
        </div>
    );
}

export default function Dashboard({
    stats = {},
    recentManuscripts = [],
    recentBooks = [],
}) {
    const pendingCount = stats.pending_manuscripts ?? 0;

    return (
        <AuthenticatedLayout>
            <Head title="Ringkasan Admin CHIMULIA" />

            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-[1440px] space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

                    {/* Sambutan */}
                    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-indigo-600">
                                Pusat pengelolaan penerbitan
                            </p>
                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                Selamat datang, Administrator!
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                                Pantau pengajuan naskah dan kelola konten
                                website CHIMULIA dari satu tempat.
                            </p>
                        </div>

                        <Link
                            href={route('admin.document-links.edit')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            <span aria-hidden="true">⚙️</span>
                            Pengaturan dokumen
                        </Link>
                    </section>

                    {/* Pengingat tindakan */}
                    <section
                        className={`rounded-2xl border p-5 sm:p-6 ${
                            pendingCount > 0
                                ? 'border-indigo-200 bg-indigo-50/70'
                                : 'border-emerald-200 bg-emerald-50/70'
                        }`}
                    >
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-4">
                                <div
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
                                        pendingCount > 0
                                            ? 'bg-white text-indigo-600'
                                            : 'bg-white text-emerald-600'
                                    }`}
                                >
                                    {pendingCount > 0 ? '📄' : '✓'}
                                </div>

                                <div>
                                    <h2 className="font-bold text-gray-900">
                                        {pendingCount > 0
                                            ? `Ada ${pendingCount} naskah menunggu review`
                                            : 'Tidak ada naskah baru yang menunggu review'}
                                    </h2>

                                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                                        {pendingCount > 0
                                            ? 'Periksa pengajuan baru untuk melihat informasi penulis dan menentukan tindak lanjut.'
                                            : 'Pengajuan baru akan muncul di sini ketika penulis mengirimkan naskah.'}
                                    </p>
                                </div>
                            </div>

                            <Link
                                href={route('admin.manuscripts.index')}
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                            >
                                Periksa pengajuan
                                <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </section>

                    {/* Statistik */}
                    <section>
                        <div className="mb-4">
                            <h2 className="text-base font-bold text-gray-900">
                                Ringkasan aktivitas
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Gambaran singkat data penerbitan saat ini.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <StatCard
                                icon="📚"
                                label="Total buku"
                                value={stats.books}
                                description="Seluruh data buku"
                                accent="bg-blue-50"
                            />
                            <StatCard
                                icon="📝"
                                label="Pengajuan naskah"
                                value={stats.manuscripts}
                                description="Seluruh pengajuan penulis"
                                accent="bg-indigo-50"
                            />
                            <StatCard
                                icon="⏳"
                                label="Menunggu review"
                                value={stats.pending_manuscripts}
                                description="Perlu diperiksa"
                                accent="bg-amber-50"
                            />
                            <StatCard
                                icon="👥"
                                label="Penulis"
                                value={stats.authors}
                                description="Akun dengan peran penulis"
                                accent="bg-emerald-50"
                            />
                        </div>
                    </section>

                    {/* Naskah terbaru */}
                    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                        <div className="p-5 sm:p-6">
                            <SectionHeading
                                eyebrow="Tindak lanjut"
                                title="Pengajuan naskah terbaru"
                                description="Lihat pengajuan dan statusnya untuk menentukan langkah berikutnya."
                                href={route('admin.manuscripts.index')}
                                linkText="Lihat semua naskah"
                            />
                        </div>

                        {recentManuscripts.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[720px] text-left">
                                    <thead className="border-y border-gray-100 bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Judul naskah
                                            </th>
                                            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Penulis
                                            </th>
                                            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Tanggal
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {recentManuscripts.map((manuscript) => (
                                            <tr
                                                key={manuscript.id}
                                                className="transition hover:bg-slate-50/80"
                                            >
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-gray-900">
                                                        {manuscript.title}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {manuscript.category?.name ??
                                                            'Kategori belum ditentukan'}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {manuscript.user?.name ?? '-'}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <StatusBadge
                                                        status={manuscript.status}
                                                    />
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {formatDate(manuscript.created_at)}
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={route(
                                                            'admin.manuscripts.show',
                                                            manuscript.id
                                                        )}
                                                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:border-indigo-200 hover:bg-indigo-50"
                                                    >
                                                        Lihat detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <EmptyState
                                title="Belum ada pengajuan naskah"
                                description="Pengajuan baru dari penulis akan ditampilkan di bagian ini."
                            />
                        )}
                    </section>

                    {/* Pengelolaan konten */}
                    <section>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-gray-900">
                                Kelola konten website
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Pilih bagian yang ingin kamu kelola.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <Link
                                href={route('admin.books.index')}
                                className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                                        📚
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-gray-900">
                                            Katalog buku
                                        </h3>
                                        <p className="mt-1 text-sm leading-5 text-gray-500">
                                            Tambah, edit, dan kelola buku terbitan.
                                        </p>
                                    </div>
                                    <span className="text-xl text-gray-400 transition group-hover:translate-x-1 group-hover:text-indigo-600">
                                        →
                                    </span>
                                </div>
                            </Link>

                            <Link
                                href={route('admin.categories.index')}
                                className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-2xl">
                                        🗂️
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-gray-900">
                                            Kategori buku
                                        </h3>
                                        <p className="mt-1 text-sm leading-5 text-gray-500">
                                            Atur pengelompokan buku.
                                        </p>
                                    </div>
                                    <span className="text-xl text-gray-400 transition group-hover:translate-x-1 group-hover:text-indigo-600">
                                        →
                                    </span>
                                </div>
                            </Link>

                            <Link
                                href={route('admin.authors.index')}
                                className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                                        👥
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-gray-900">
                                            Manajemen penulis
                                        </h3>
                                        <p className="mt-1 text-sm leading-5 text-gray-500">
                                            Kelola data penulis buku.
                                        </p>
                                    </div>
                                    <span className="text-xl text-gray-400 transition group-hover:translate-x-1 group-hover:text-indigo-600">
                                        →
                                    </span>
                                </div>
                            </Link>

                            <Link
                                href={route('admin.events.index')}
                                className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-2xl">
                                        📅
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-gray-900">
                                            Event & berita
                                        </h3>
                                        <p className="mt-1 text-sm leading-5 text-gray-500">
                                            Publikasikan berita dan kegiatan.
                                        </p>
                                    </div>
                                    <span className="text-xl text-gray-400 transition group-hover:translate-x-1 group-hover:text-indigo-600">
                                        →
                                    </span>
                                </div>
                            </Link>

                            <Link
                                href={route('admin.documentations.index')}
                                className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-2xl">
                                        🖼️
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-gray-900">
                                            Dokumentasi
                                        </h3>
                                        <p className="mt-1 text-sm leading-5 text-gray-500">
                                            Kelola foto, panduan, dan dokumen.
                                        </p>
                                    </div>
                                    <span className="text-xl text-gray-400 transition group-hover:translate-x-1 group-hover:text-indigo-600">
                                        →
                                    </span>
                                </div>
                            </Link>

                            <Link
                                href={route('admin.document-links.edit')}
                                className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                                        🔗
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-gray-900">
                                            Tautan dokumen
                                        </h3>
                                        <p className="mt-1 text-sm leading-5 text-gray-500">
                                            Atur tautan surat dan dokumen pendukung.
                                        </p>
                                    </div>
                                    <span className="text-xl text-gray-400 transition group-hover:translate-x-1 group-hover:text-indigo-600">
                                        →
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </section>

                    {/* Buku terbaru */}
                    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                        <div className="p-5 sm:p-6">
                            <SectionHeading
                                eyebrow="Koleksi"
                                title="Buku terbaru"
                                description="Pantau buku yang baru ditambahkan ke katalog."
                                href={route('admin.books.index')}
                                linkText="Kelola semua buku"
                            />
                        </div>

                        {recentBooks.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[560px] text-left">
                                    <thead className="border-y border-gray-100 bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Judul buku
                                            </th>
                                            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Tanggal ditambahkan
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recentBooks.map((book) => (
                                            <tr
                                                key={book.id}
                                                className="transition hover:bg-slate-50/80"
                                            >
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                    {book.title}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={book.status} />
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {formatDate(book.created_at)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <EmptyState
                                title="Belum ada buku"
                                description="Tambahkan buku pertama melalui menu Katalog Buku."
                            />
                        )}
                    </section>

                    {/* Bantuan */}
                    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
                        <span className="text-lg" aria-hidden="true">💡</span>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">
                                Tips menggunakan dashboard
                            </p>
                            <p className="mt-1 text-sm leading-6 text-gray-500">
                                Mulai dari pemberitahuan pengajuan, lalu gunakan
                                kartu pengelolaan konten untuk membuka bagian
                                yang ingin kamu ubah. Setiap bagian memiliki
                                daftar data dan tindakan tersendiri.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
