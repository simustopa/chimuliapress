
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Index({ categories = [] }) {
    const [search, setSearch] = useState('');
    const { flash } = usePage().props;

    const filteredCategories = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) return categories;

        return categories.filter((category) =>
            [
                category.name,
                category.slug,
                category.description,
            ].some((value) => value?.toLowerCase().includes(keyword)),
        );
    }, [categories, search]);

    const activeCount = categories.filter(
        (category) => category.is_active,
    ).length;

    const inactiveCount = categories.length - activeCount;

    function deleteCategory(category) {
        if (
            (category.books_count ?? 0) > 0 ||
            (category.manuscripts_count ?? 0) > 0
        ) {
            window.alert(
                'Kategori ini masih digunakan oleh buku atau naskah sehingga tidak dapat dihapus.',
            );
            return;
        }

        if (
            window.confirm(
                `Apakah kamu yakin ingin menghapus kategori "${category.name}"?`,
            )
        ) {
            router.delete(
                route('admin.categories.destroy', category.id),
            );
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg font-semibold text-slate-800">
                    Manajemen Kategori
                </h2>
            }
        >
            <Head title="Manajemen Kategori Buku" />

            <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span>Admin</span>
                                <span>/</span>
                                <span className="text-indigo-600">
                                    Kategori Buku
                                </span>
                            </div>

                            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Manajemen Kategori Buku
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Kelola pengelompokan koleksi buku CHIMULIA.
                            </p>
                        </div>

                        <Link
                            href={route('admin.categories.create')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            <span className="text-lg leading-none">+</span>
                            Tambah Kategori
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
                            label="Total Kategori"
                            value={categories.length}
                            description="Seluruh kategori terdaftar"
                            symbol="▤"
                        />

                        <StatCard
                            label="Kategori Aktif"
                            value={activeCount}
                            description="Tersedia untuk katalog publik"
                            symbol="✓"
                        />

                        <StatCard
                            label="Kategori Nonaktif"
                            value={inactiveCount}
                            description="Tidak ditampilkan pada katalog"
                            symbol="○"
                        />
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="font-semibold text-slate-900">
                                    Daftar Kategori
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    {filteredCategories.length} kategori
                                    ditemukan
                                </p>
                            </div>

                            <div className="relative w-full sm:max-w-sm">
                                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                                    <SearchIcon />
                                </span>

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nama atau slug kategori..."
                                    aria-label="Cari kategori"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                                />
                            </div>
                        </div>

                        {filteredCategories.length === 0 ? (
                            <div className="px-6 py-16 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                    <TagIcon />
                                </div>

                                <h3 className="mt-4 font-semibold text-slate-900">
                                    {categories.length === 0
                                        ? 'Belum ada kategori'
                                        : 'Kategori tidak ditemukan'}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    {categories.length === 0
                                        ? 'Tambahkan kategori pertama untuk mengelompokkan buku.'
                                        : 'Coba gunakan kata kunci pencarian yang berbeda.'}
                                </p>

                                {categories.length === 0 && (
                                    <Link
                                        href={route('admin.categories.create')}
                                        className="mt-5 inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                    >
                                        Tambah Kategori
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[850px] text-left text-sm">
                                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                        <tr>
                                            <th className="px-5 py-4 font-semibold">
                                                Kategori
                                            </th>
                                            <th className="px-5 py-4 font-semibold">
                                                Slug
                                            </th>
                                            <th className="px-5 py-4 font-semibold">
                                                Koleksi
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
                                        {filteredCategories.map((category) => (
                                            <tr
                                                key={category.id}
                                                className="transition hover:bg-slate-50/80"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                            <TagIcon />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-slate-800">
                                                                {category.name}
                                                            </p>
                                                            <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
                                                                {category.description ||
                                                                    'Belum ada deskripsi'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-mono text-xs text-slate-600">
                                                        {category.slug}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-slate-800">
                                                        {category.books_count ??
                                                            0}{' '}
                                                        <span className="font-normal text-slate-500">
                                                            buku
                                                        </span>
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {category.manuscripts_count ??
                                                            0}{' '}
                                                        naskah
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                                            category.is_active
                                                                ? 'bg-emerald-50 text-emerald-700'
                                                                : 'bg-slate-100 text-slate-600'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`h-1.5 w-1.5 rounded-full ${
                                                                category.is_active
                                                                    ? 'bg-emerald-500'
                                                                    : 'bg-slate-400'
                                                            }`}
                                                        />
                                                        {category.is_active
                                                            ? 'Aktif'
                                                            : 'Nonaktif'}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={route(
                                                                'admin.categories.edit',
                                                                category.id,
                                                            )}
                                                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteCategory(
                                                                    category,
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
                        Kategori yang masih digunakan oleh buku atau naskah
                        tidak dapat dihapus. Periksa koleksi terkait sebelum
                        menghapus kategori.
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

function SearchIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
        >
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 4 4" />
        </svg>
    );
}

function TagIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-5 w-5"
        >
            <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3.4 13.4a2 2 0 0 1 0-2.8l7.2-7.2A2 2 0 0 1 12 2.8H19a2 2 0 0 1 2 2V12a2 2 0 0 1-.4 1.4Z" />
            <circle cx="16.5" cy="7.5" r="1" />
        </svg>
    );
}
