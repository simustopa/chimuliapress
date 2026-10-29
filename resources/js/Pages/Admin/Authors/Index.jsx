
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Index({ auth, authors = [] }) {
    const [search, setSearch] = useState('');
    const { flash = {} } = usePage().props;

    const activeCount = authors.filter((author) => author.is_active).length;
    const inactiveCount = authors.length - activeCount;

    const filteredAuthors = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) return authors;

        return authors.filter((author) =>
            [author.name, author.email, author.bio]
                .some((value) => value?.toLowerCase().includes(keyword))
        );
    }, [authors, search]);

    function deleteAuthor(author) {
        if (confirm(`Yakin ingin menghapus penulis "${author.name}"?`)) {
            router.delete(route('admin.authors.destroy', author.id));
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <p className="text-sm font-medium text-indigo-600">
                        Administrasi CHIMULIA
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-800">
                        Manajemen Author
                    </h2>
                </div>
            }
        >
            <Head title="Manajemen Author" />

            <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Daftar Author
                            </h1>
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                                Kelola informasi penulis yang bekerja sama dengan
                                penerbit CHIMULIA.
                            </p>
                        </div>

                        <Link
                            href={route('admin.authors.create')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <span className="text-lg leading-none">+</span>
                            Tambah Author
                        </Link>
                    </div>

                    {flash.success && (
                        <div
                            role="status"
                            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
                        >
                            {flash.success}
                        </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <StatCard
                            label="Total Author"
                            value={authors.length}
                            description="Seluruh data penulis"
                            accent="indigo"
                        />
                        <StatCard
                            label="Author Aktif"
                            value={activeCount}
                            description="Penulis berstatus aktif"
                            accent="emerald"
                        />
                        <StatCard
                            label="Author Nonaktif"
                            value={inactiveCount}
                            description="Penulis berstatus nonaktif"
                            accent="slate"
                        />
                    </div>

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Data Penulis
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    {filteredAuthors.length} data ditampilkan
                                    {search.trim() ? ' dari hasil pencarian' : ''}
                                </p>
                            </div>

                            <div className="w-full lg:max-w-sm">
                                <label
                                    htmlFor="author-search"
                                    className="sr-only"
                                >
                                    Cari author
                                </label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                                        ⌕
                                    </span>
                                    <input
                                        id="author-search"
                                        type="search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari nama, email, atau biografi..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">No.</th>
                                        <th className="px-6 py-4 font-semibold">Author</th>
                                        <th className="px-6 py-4 font-semibold">Email</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 text-right font-semibold">Aksi</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {filteredAuthors.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-16 text-center">
                                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-500">
                                                    {search ? '⌕' : '✎'}
                                                </div>
                                                <p className="mt-4 font-semibold text-slate-800">
                                                    {search
                                                        ? 'Author tidak ditemukan'
                                                        : 'Belum ada data author'}
                                                </p>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {search
                                                        ? 'Coba gunakan kata kunci yang berbeda.'
                                                        : 'Tambahkan author pertama untuk mulai mengelola data penulis.'}
                                                </p>
                                                {search && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setSearch('')}
                                                        className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                                                    >
                                                        Hapus pencarian
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredAuthors.map((author, index) => (
                                            <tr
                                                key={author.id}
                                                className="transition hover:bg-slate-50/80"
                                            >
                                                <td className="px-6 py-4 text-slate-400">
                                                    {index + 1}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-700">
                                                            {author.name?.charAt(0)?.toUpperCase() || '?'}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-slate-800">
                                                                {author.name}
                                                            </p>
                                                            <p className="mt-1 max-w-sm truncate text-xs text-slate-500">
                                                                {author.bio || 'Belum ada biografi'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-slate-600">
                                                    {author.email || (
                                                        <span className="text-slate-400">Belum diisi</span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                            author.is_active
                                                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                                                                : 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`h-1.5 w-1.5 rounded-full ${
                                                                author.is_active
                                                                    ? 'bg-emerald-500'
                                                                    : 'bg-slate-400'
                                                            }`}
                                                        />
                                                        {author.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={route('admin.authors.edit', author.id)}
                                                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => deleteAuthor(author)}
                                                            className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3 text-xs text-slate-500 sm:px-6">
                            Data author CHIMULIA
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ label, value, description, accent }) {
    const accents = {
        indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
        emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
        slate: 'bg-slate-100 text-slate-600 ring-slate-200',
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        {value}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{description}</p>
                </div>
                <div className={`rounded-xl p-3 ring-1 ${accents[accent]}`}>
                    <span className="text-lg font-bold">#</span>
                </div>
            </div>
        </div>
    );
}
