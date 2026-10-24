import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const statusLabels = {
    submitted: 'Dikirim',
    under_review: 'Sedang Ditinjau',
    revision: 'Perlu Revisi',
    accepted: 'Diterima',
    rejected: 'Ditolak',
    published: 'Diterbitkan',
};

const statusColors = {
    submitted: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    revision: 'bg-orange-100 text-orange-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    published: 'bg-purple-100 text-purple-800',
};

const serviceLabels = {
    book_textbook: 'Buku / Buku Ajar',
    school_book: 'Buku Sekolah',
    reference_book: 'Buku Referensi',
    journal_article: 'Artikel Jurnal',
    haki_certificate: 'Sertifikasi HAKI',
};

export default function Index({
    manuscripts = { data: [], links: [] },
    filters = {},
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const submitSearch = (event) => {
        event.preventDefault();

        router.get(
            route('editor.manuscripts.index'),
            {
                search,
                status,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const resetFilter = () => {
        setSearch('');
        setStatus('');

        router.get(
            route('editor.manuscripts.index'),
            {},
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Daftar Naskah
                </h2>
            }
        >
            <Head title="Daftar Naskah" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Semua Naskah
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Kelola dan review naskah yang masuk dari penulis.
                            </p>
                        </div>

                        <Link
                            href={route('editor.dashboard')}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                        >
                            ← Dashboard
                        </Link>
                    </div>

                    {/* Filter */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <form
                            onSubmit={submitSearch}
                            className="grid gap-4 md:grid-cols-[1fr_220px_auto_auto]"
                        >
                            <div>
                                <label
                                    htmlFor="search"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Cari
                                </label>

                                <input
                                    id="search"
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Judul atau nama penulis..."
                                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="status"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Status
                                </label>

                                <select
                                    id="status"
                                    value={status}
                                    onChange={(event) =>
                                        setStatus(event.target.value)
                                    }
                                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">
                                        Semua Status
                                    </option>

                                    <option value="submitted">
                                        Dikirim
                                    </option>

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
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                                >
                                    Cari
                                </button>
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={resetFilter}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Naskah
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Penulis
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Layanan
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Tanggal
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {manuscripts.data?.length > 0 ? (
                                        manuscripts.data.map((manuscript) => (
                                            <tr key={manuscript.id}>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">
                                                        {manuscript.title}
                                                    </div>

                                                    <div className="mt-1 text-sm text-gray-500">
                                                        {manuscript.category?.name ?? 'Tanpa kategori'}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {manuscript.user?.name ?? '-'}
                                                    </div>

                                                    <div className="text-sm text-gray-500">
                                                        {manuscript.user?.email ?? '-'}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {serviceLabels[manuscript.service_type] ??
                                                        manuscript.service_type ??
                                                        '-'}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                                            statusColors[manuscript.status] ??
                                                            'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {statusLabels[manuscript.status] ??
                                                            manuscript.status}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {new Date(
                                                        manuscript.created_at
                                                    ).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={route(
                                                            'editor.manuscripts.show',
                                                            manuscript.id
                                                        )}
                                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                                    >
                                                        Review →
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-12 text-center"
                                            >
                                                <p className="text-sm text-gray-500">
                                                    Tidak ada naskah yang ditemukan.
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {manuscripts.links?.length > 0 && (
                            <div className="border-t border-gray-200 px-6 py-4">
                                <div className="flex flex-wrap gap-2">
                                    {manuscripts.links.map((link, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            disabled={!link.url}
                                            onClick={() => {
                                                if (link.url) {
                                                    router.visit(link.url);
                                                }
                                            }}
                                            className={`rounded-lg px-3 py-2 text-sm ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            } ${
                                                !link.url
                                                    ? 'cursor-not-allowed opacity-50'
                                                    : ''
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
