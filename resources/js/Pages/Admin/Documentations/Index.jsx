
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Index({ documentations = [] }) {
    const [search, setSearch] = useState('');
    const { flash } = usePage().props;

    const filteredDocumentations = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) return documentations;

        return documentations.filter((item) =>
            [item.title, item.description, item.type]
                .some((value) => value?.toLowerCase().includes(keyword)),
        );
    }, [documentations, search]);

    const photoCount = documentations.filter(
        (item) => item.type === 'photo',
    ).length;

    const videoCount = documentations.filter(
        (item) => item.type === 'video',
    ).length;

    const activeCount = documentations.filter(
        (item) => item.is_active,
    ).length;

    function deleteDocumentation(documentation) {
        if (
            !window.confirm(
                `Hapus dokumentasi "${documentation.title}"?\n\nFile terkait juga akan dihapus.`,
            )
        ) {
            return;
        }

        router.delete(
            route('admin.documentations.destroy', documentation.id),
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg font-semibold text-slate-800">
                    Manajemen Dokumentasi
                </h2>
            }
        >
            <Head title="Manajemen Dokumentasi" />

            <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span>Admin</span>
                                <span>/</span>
                                <span className="text-indigo-600">
                                    Dokumentasi
                                </span>
                            </div>

                            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Manajemen Dokumentasi
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Kelola foto dan video kegiatan CHIMULIA.
                            </p>
                        </div>

                        <Link
                            href={route('admin.documentations.create')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            <span className="text-lg leading-none">+</span>
                            Tambah Dokumentasi
                        </Link>
                    </div>

                    {flash?.success && (
                        <div
                            role="status"
                            className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                        >
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div
                            role="alert"
                            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                            {flash.error}
                        </div>
                    )}

                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <StatCard
                            label="Total Dokumentasi"
                            value={documentations.length}
                            description="Seluruh dokumentasi tersimpan"
                            symbol="▤"
                        />
                        <StatCard
                            label="Foto"
                            value={photoCount}
                            description="Dokumentasi berupa gambar"
                            symbol="▧"
                        />
                        <StatCard
                            label="Video"
                            value={videoCount}
                            description="Dokumentasi berupa video"
                            symbol="▷"
                        />
                    </div>

                    <div className="mb-6 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                            {activeCount} dokumentasi aktif
                        </span>
                        <span className="rounded-full bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600">
                            {documentations.length - activeCount} nonaktif
                        </span>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="font-semibold text-slate-900">
                                    Daftar Dokumentasi
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    {filteredDocumentations.length} dokumentasi
                                    ditemukan
                                </p>
                            </div>

                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari judul dokumentasi..."
                                aria-label="Cari dokumentasi"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 sm:max-w-sm"
                            />
                        </div>

                        {filteredDocumentations.length === 0 ? (
                            <div className="px-6 py-16 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-500">
                                    ▧
                                </div>

                                <h3 className="mt-4 font-semibold text-slate-900">
                                    {documentations.length === 0
                                        ? 'Belum ada dokumentasi'
                                        : 'Dokumentasi tidak ditemukan'}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    {documentations.length === 0
                                        ? 'Tambahkan foto atau video kegiatan CHIMULIA.'
                                        : 'Coba gunakan kata kunci pencarian lain.'}
                                </p>

                                {documentations.length === 0 && (
                                    <Link
                                        href={route(
                                            'admin.documentations.create',
                                        )}
                                        className="mt-5 inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                                    >
                                        Tambah Dokumentasi
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[850px] text-left text-sm">
                                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                        <tr>
                                            <th className="px-5 py-4 font-semibold">
                                                Pratinjau
                                            </th>
                                            <th className="px-5 py-4 font-semibold">
                                                Dokumentasi
                                            </th>
                                            <th className="px-5 py-4 font-semibold">
                                                Jenis
                                            </th>
                                            <th className="px-5 py-4 font-semibold">
                                                Urutan
                                            </th>
                                            <th className="px-5 py-4 font-semibold">
                                                Status
                                            </th>
                                            <th className="px-5 py-4 text-right font-semibold">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {filteredDocumentations.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="transition hover:bg-slate-50/80"
                                            >
                                                <td className="px-5 py-4">
                                                    {item.type === 'photo' ? (
                                                        <img
                                                            src={`/storage/${item.file_path}`}
                                                            alt={item.title}
                                                            loading="lazy"
                                                            className="h-16 w-24 rounded-xl border border-slate-200 bg-slate-50 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-16 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-100 text-indigo-600">
                                                            <span className="text-xl">
                                                                ▷
                                                            </span>
                                                            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                                                Video
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-slate-800">
                                                        {item.title}
                                                    </p>
                                                    <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                                                        {item.description ||
                                                            'Tidak ada deskripsi'}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                                                        {item.type === 'photo'
                                                            ? 'Foto'
                                                            : 'Video'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 font-medium text-slate-700">
                                                    {item.sort_order}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                                            item.is_active
                                                                ? 'bg-emerald-50 text-emerald-700'
                                                                : 'bg-slate-100 text-slate-600'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`h-1.5 w-1.5 rounded-full ${
                                                                item.is_active
                                                                    ? 'bg-emerald-500'
                                                                    : 'bg-slate-400'
                                                            }`}
                                                        />
                                                        {item.is_active
                                                            ? 'Aktif'
                                                            : 'Nonaktif'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={route(
                                                                'admin.documentations.edit',
                                                                item.id,
                                                            )}
                                                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteDocumentation(
                                                                    item,
                                                                )
                                                            }
                                                            className="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <p className="mt-4 text-xs leading-5 text-slate-400">
                        Dokumentasi aktif akan ditampilkan di halaman publik
                        sesuai urutan tampilan yang ditentukan.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ label, value, description, symbol }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {label}
                    </p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                        {value}
                    </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-lg font-semibold text-indigo-600">
                    {symbol}
                </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">{description}</p>
        </div>
    );
}
