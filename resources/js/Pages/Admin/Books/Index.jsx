
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Index({ auth, books = [] }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [availabilityFilter, setAvailabilityFilter] = useState('all');
    const { flash = {} } = usePage().props;

    const publishedCount = books.filter((book) => book.status === 'published').length;
    const draftCount = books.length - publishedCount;
    const bestSellerCount = books.filter((book) => book.is_best_seller).length;

    const filteredBooks = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return books.filter((book) => {
            const matchesSearch = !keyword || [
                book.title,
                book.subtitle,
                book.slug,
                ...(book.authors ?? []).map((author) => author.name),
                ...(book.categories ?? []).map((category) => category.name),
            ].some((value) => value?.toLowerCase().includes(keyword));

            const matchesStatus =
                statusFilter === 'all' || book.status === statusFilter;

            const matchesAvailability =
                availabilityFilter === 'all' ||
                book.availability_status === availabilityFilter;

            return matchesSearch && matchesStatus && matchesAvailability;
        });
    }, [books, search, statusFilter, availabilityFilter]);

    function deleteBook(book) {
        if (confirm(`Hapus buku "${book.title}"? Tindakan ini tidak dapat dibatalkan.`)) {
            router.delete(route('admin.books.destroy', book.id));
        }
    }

    function formatRupiah(value) {
        if (value === null || value === undefined || value === '') return '-';

        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);
    }

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <div>
                    <p className="text-sm font-medium text-indigo-600">Administrasi CHIMULIA</p>
                    <h2 className="mt-1 text-xl font-bold text-slate-800">Manajemen Buku</h2>
                </div>
            }
        >
            <Head title="Manajemen Buku" />

            <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
                <div className="mx-auto max-w-[1600px] space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Koleksi Buku
                            </h1>
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                                Kelola katalog, informasi penerbitan, harga, ketersediaan,
                                dan label Best Seller buku CHIMULIA.
                            </p>
                        </div>

                        <Link
                            href={route('admin.books.create')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <span className="text-lg leading-none">+</span>
                            Tambah Buku
                        </Link>
                    </div>

                    {flash.success && (
                        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                            {flash.success}
                        </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard label="Total Buku" value={books.length} description="Seluruh koleksi buku" tone="indigo" />
                        <StatCard label="Telah Terbit" value={publishedCount} description="Buku berstatus terbit" tone="emerald" />
                        <StatCard label="Draft" value={draftCount} description="Buku yang belum diterbitkan" tone="slate" />
                        <StatCard label="Best Seller" value={bestSellerCount} description="Buku dengan label unggulan" tone="amber" />
                    </div>

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="space-y-4 border-b border-slate-100 p-5 sm:p-6">
                            <div>
                                <h3 className="font-bold text-slate-900">Daftar Buku</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Menampilkan {filteredBooks.length} dari {books.length} buku.
                                </p>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                <div className="xl:col-span-2">
                                    <label htmlFor="book-search" className="sr-only">Cari buku</label>
                                    <input
                                        id="book-search"
                                        type="search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari judul, penulis, atau kategori..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="book-status" className="sr-only">Filter publikasi</label>
                                    <select
                                        id="book-status"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                    >
                                        <option value="all">Semua publikasi</option>
                                        <option value="published">Terbit</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="book-availability" className="sr-only">Filter ketersediaan</label>
                                    <select
                                        id="book-availability"
                                        value={availabilityFilter}
                                        onChange={(e) => setAvailabilityFilter(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                    >
                                        <option value="all">Semua ketersediaan</option>
                                        <option value="ready">Ready</option>
                                        <option value="preorder">Preorder</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1250px] text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                                    <tr>
                                        <th className="px-5 py-4 font-semibold">Buku</th>
                                        <th className="px-5 py-4 font-semibold">Penulis / Kategori</th>
                                        <th className="px-5 py-4 font-semibold">Harga</th>
                                        <th className="px-5 py-4 font-semibold">Terjual</th>
                                        <th className="px-5 py-4 font-semibold">Ketersediaan</th>
                                        <th className="px-5 py-4 font-semibold">Publikasi</th>
                                        <th className="px-5 py-4 font-semibold">Tanggal Terbit</th>
                                        <th className="px-5 py-4 text-right font-semibold">Aksi</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {filteredBooks.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-16 text-center">
                                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-500">
                                                    {search ? '⌕' : '▤'}
                                                </div>
                                                <p className="mt-4 font-semibold text-slate-800">
                                                    {books.length === 0 ? 'Belum ada data buku' : 'Buku tidak ditemukan'}
                                                </p>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {books.length === 0
                                                        ? 'Tambahkan buku pertama untuk mulai membangun katalog.'
                                                        : 'Ubah kata kunci atau filter untuk melihat hasil lainnya.'}
                                                </p>
                                                {books.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSearch('');
                                                            setStatusFilter('all');
                                                            setAvailabilityFilter('all');
                                                        }}
                                                        className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                                                    >
                                                        Reset filter
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ) : filteredBooks.map((book) => (
                                        <tr key={book.id} className="align-top transition hover:bg-slate-50/80">
                                            <td className="px-5 py-4">
                                                <div className="flex min-w-[250px] items-start gap-3">
                                                    {book.cover_image ? (
                                                        <img
                                                            src={`/storage/${book.cover_image}`}
                                                            alt={`Sampul ${book.title}`}
                                                            className="h-24 w-16 shrink-0 rounded-lg border border-slate-200 bg-slate-50 object-cover shadow-sm"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="flex h-24 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-1 text-center text-[10px] text-slate-400">
                                                            Tanpa sampul
                                                        </div>
                                                    )}

                                                    <div className="min-w-0">
                                                        <p className="font-semibold leading-5 text-slate-900">{book.title}</p>
                                                        {book.subtitle && <p className="mt-1 text-xs leading-5 text-slate-500">{book.subtitle}</p>}
                                                        <p className="mt-1 break-all text-[11px] text-slate-400">{book.slug}</p>
                                                        {book.is_best_seller && (
                                                            <span className="mt-2 inline-flex rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                                                                ★ Best Seller
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="max-w-[220px] font-medium text-slate-700">
                                                    {book.authors?.length ? book.authors.map((author) => author.name).join(', ') : '-'}
                                                </p>
                                                <p className="mt-2 max-w-[220px] text-xs leading-5 text-slate-500">
                                                    {book.categories?.length ? book.categories.map((category) => category.name).join(', ') : 'Tanpa kategori'}
                                                </p>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">
                                                {formatRupiah(book.price)}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 tabular-nums text-slate-600">
                                                {Number(book.sold_count ?? 0).toLocaleString('id-ID')}
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge value={book.availability_status} />
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge value={book.status} />
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                                                {book.published_at ? String(book.published_at).slice(0, 10) : '-'}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route('admin.books.edit', book.id)}
                                                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteBook(book)}
                                                        className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
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

                        <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3 text-xs text-slate-500 sm:px-6">
                            Katalog buku CHIMULIA
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ label, value, description, tone }) {
    const tones = {
        indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
        emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
        slate: 'bg-slate-100 text-slate-600 ring-slate-200',
        amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
                    <p className="mt-1 text-xs text-slate-500">{description}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold ring-1 ${tones[tone]}`}>
                    {tone === 'amber' ? '★' : tone === 'emerald' ? '✓' : tone === 'slate' ? '▤' : '#'}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ value }) {
    const config = {
        published: { label: 'Terbit', className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
        draft: { label: 'Draft', className: 'bg-slate-100 text-slate-600 ring-slate-500/20' },
        ready: { label: 'Ready', className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
        preorder: { label: 'Preorder', className: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
    };

    const status = config[value] ?? { label: value || '-', className: 'bg-slate-100 text-slate-600 ring-slate-500/20' };

    return (
        <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${status.className}`}>
            {status.label}
        </span>
    );
}
