
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'submitted', label: 'Dikirim' },
    { value: 'under_review', label: 'Sedang Ditinjau' },
    { value: 'revision', label: 'Perlu Revisi' },
    { value: 'accepted', label: 'Diterima' },
    { value: 'rejected', label: 'Ditolak' },
    { value: 'published', label: 'Diterbitkan' },
];

const serviceLabels = {
    book_textbook: 'Buku / Textbook',
    school_book: 'Buku Sekolah',
    reference_book: 'Buku Referensi',
    journal_article: 'Artikel Jurnal',
    haki_certificate: 'Sertifikat HAKI',
};

const statusStyles = {
    submitted: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    under_review: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    revision: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    accepted: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    rejected: 'bg-red-50 text-red-700 ring-red-600/20',
    published: 'bg-violet-50 text-violet-700 ring-violet-600/20',
};

const statusLabels = Object.fromEntries(
    statusOptions
        .filter((item) => item.value)
        .map((item) => [item.value, item.label])
);

function formatDate(date) {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function StatCard({ label, value, description, icon, color }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {label}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                        {value ?? 0}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        {description}
                    </p>
                </div>

                <div className={`rounded-xl p-3 ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default function Index({
    manuscripts = { data: [], links: [], from: 0, to: 0, total: 0 },
    filters = { search: '', status: '' },
    stats = {},
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const submitSearch = (event) => {
        event.preventDefault();

        router.get(
            route('admin.manuscripts.index'),
            { search, status },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const resetFilter = () => {
        setSearch('');
        setStatus('');

        router.get(
            route('admin.manuscripts.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        Manajemen Naskah
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Kelola dan pantau seluruh pengajuan naskah CHIMULIA.
                    </p>
                </div>
            }
        >
            <Head title="Manajemen Naskah" />

            <div className="min-h-screen bg-slate-50 py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">

                    {/* Statistik */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            label="Total Naskah"
                            value={stats.total}
                            description="Seluruh pengajuan"
                            color="bg-indigo-50 text-indigo-600"
                            icon={<span className="text-xl">📚</span>}
                        />
                        <StatCard
                            label="Menunggu Ditinjau"
                            value={stats.submitted}
                            description="Pengajuan baru"
                            color="bg-blue-50 text-blue-600"
                            icon={<span className="text-xl">📥</span>}
                        />
                        <StatCard
                            label="Sedang Ditinjau"
                            value={stats.under_review}
                            description="Dalam proses pemeriksaan"
                            color="bg-amber-50 text-amber-600"
                            icon={<span className="text-xl">🔍</span>}
                        />
                        <StatCard
                            label="Perlu Revisi"
                            value={stats.revision}
                            description="Menunggu perbaikan author"
                            color="bg-orange-50 text-orange-600"
                            icon={<span className="text-xl">📝</span>}
                        />
                    </div>

                    {/* Statistik status lanjutan */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <StatCard
                            label="Diterima"
                            value={stats.accepted}
                            description="Naskah disetujui"
                            color="bg-emerald-50 text-emerald-600"
                            icon={<span className="text-xl">✓</span>}
                        />
                        <StatCard
                            label="Ditolak"
                            value={stats.rejected}
                            description="Naskah tidak diterima"
                            color="bg-red-50 text-red-600"
                            icon={<span className="text-xl">×</span>}
                        />
                        <StatCard
                            label="Diterbitkan"
                            value={stats.published}
                            description="Sudah diterbitkan"
                            color="bg-violet-50 text-violet-600"
                            icon={<span className="text-xl">✦</span>}
                        />
                    </div>

                    {/* Daftar Naskah */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 p-5 sm:p-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    Daftar Pengajuan Naskah
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Lihat informasi, status, dan detail setiap pengajuan.
                                </p>
                            </div>

                            <form
                                onSubmit={submitSearch}
                                className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4"
                            >
                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="search"
                                        className="mb-1.5 block text-sm font-medium text-slate-700"
                                    >
                                        Cari Naskah
                                    </label>
                                    <input
                                        id="search"
                                        type="text"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Judul, nama author, atau email..."
                                        className="w-full rounded-xl border-slate-200 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="status"
                                        className="mb-1.5 block text-sm font-medium text-slate-700"
                                    >
                                        Filter Status
                                    </label>
                                    <select
                                        id="status"
                                        value={status}
                                        onChange={(event) =>
                                            setStatus(event.target.value)
                                        }
                                        className="w-full rounded-xl border-slate-200 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {statusOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-end gap-2">
                                    <button
                                        type="submit"
                                        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                    >
                                        Cari
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetFilter}
                                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        {[
                                            'Naskah',
                                            'Author',
                                            'Layanan',
                                            'Status',
                                            'Tanggal Pengajuan',
                                            'Aksi',
                                        ].map((heading) => (
                                            <th
                                                key={heading}
                                                className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {manuscripts.data.length > 0 ? (
                                        manuscripts.data.map((manuscript) => (
                                            <tr
                                                key={manuscript.id}
                                                className="transition hover:bg-slate-50/70"
                                            >
                                                <td className="max-w-xs px-5 py-4">
                                                    <p className="font-semibold text-slate-800">
                                                        {manuscript.title}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {manuscript.category?.name ?? 'Tanpa kategori'}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-medium text-slate-700">
                                                        {manuscript.user?.name ?? '-'}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {manuscript.user?.email ?? '-'}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {serviceLabels[manuscript.service_type] ??
                                                        manuscript.service_type ?? '-'}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                                                            statusStyles[manuscript.status] ??
                                                            'bg-slate-100 text-slate-600 ring-slate-200'
                                                        }`}
                                                    >
                                                        {statusLabels[manuscript.status] ??
                                                            manuscript.status}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                                                    {formatDate(manuscript.created_at)}
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <Link
                                                        href={route(
                                                            'admin.manuscripts.show',
                                                            manuscript.id
                                                        )}
                                                        className="inline-flex items-center rounded-lg border border-indigo-100 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                                                    >
                                                        Lihat Detail
                                                        <span className="ml-2">→</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-5 py-16 text-center"
                                            >
                                                <div className="text-3xl">📄</div>
                                                <p className="mt-3 font-semibold text-slate-700">
                                                    Naskah tidak ditemukan
                                                </p>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    Coba ubah kata kunci atau filter status.
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {manuscripts.links?.length > 3 && (
                            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-slate-500">
                                    Menampilkan {manuscripts.from ?? 0}–{manuscripts.to ?? 0}
                                    {' '}dari {manuscripts.total ?? 0} naskah
                                </p>

                                <div className="flex flex-wrap gap-1.5">
                                    {manuscripts.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url ?? '#'}
                                            preserveScroll
                                            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : link.url
                                                      ? 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                                                      : 'cursor-not-allowed text-slate-300'
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
