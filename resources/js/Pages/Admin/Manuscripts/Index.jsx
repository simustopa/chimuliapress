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

const serviceLabels = {
    book_textbook: 'Buku / Textbook',
    school_book: 'Buku Sekolah',
    reference_book: 'Buku Referensi',
    journal_article: 'Artikel Jurnal',
    haki_certificate: 'Sertifikat HAKI',
};

function statusClass(status) {
    switch (status) {
        case 'submitted':
            return 'bg-blue-100 text-blue-800';

        case 'under_review':
            return 'bg-yellow-100 text-yellow-800';

        case 'revision':
            return 'bg-orange-100 text-orange-800';

        case 'accepted':
            return 'bg-green-100 text-green-800';

        case 'rejected':
            return 'bg-red-100 text-red-800';

        case 'published':
            return 'bg-purple-100 text-purple-800';

        default:
            return 'bg-gray-100 text-gray-800';
    }
}

export default function Index({
    manuscripts = { data: [], links: [] },
    filters = { search: '', status: '' },
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const submitSearch = (event) => {
        event.preventDefault();

        router.get(
            route('admin.manuscripts.index'),
            {
                search,
                status,
            },
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Manajemen Naskah
                </h2>
            }
        >
            <Head title="Manajemen Naskah" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                        {/* Header */}
                        <div className="border-b border-gray-200 p-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Daftar Naskah
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Monitor seluruh pengajuan naskah dari author.
                                    </p>
                                </div>
                            </div>

                            {/* Filter */}
                            <form
                                onSubmit={submitSearch}
                                className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4"
                            >
                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="search"
                                        className="mb-1 block text-sm font-medium text-gray-700"
                                    >
                                        Pencarian
                                    </label>

                                    <input
                                        id="search"
                                        type="text"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Cari judul, nama author, atau email..."
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="status"
                                        className="mb-1 block text-sm font-medium text-gray-700"
                                    >
                                        Status
                                    </label>

                                    <select
                                        id="status"
                                        value={status}
                                        onChange={(event) =>
                                            setStatus(event.target.value)
                                        }
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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

                                <div className="flex items-end gap-2">
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                                    >
                                        Cari
                                    </button>

                                    <button
                                        type="button"
                                        onClick={resetFilter}
                                        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Naskah
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Author
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Layanan
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Tanggal
                                        </th>

                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {manuscripts.data.length > 0 ? (
                                        manuscripts.data.map((manuscript) => (
                                            <tr key={manuscript.id}>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {manuscript.title}
                                                    </div>

                                                    <div className="mt-1 text-xs text-gray-500">
                                                        {manuscript.category?.name ??
                                                            'Tanpa kategori'}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {manuscript.user?.name ??
                                                            '-'}
                                                    </div>

                                                    <div className="mt-1 text-xs text-gray-500">
                                                        {manuscript.user?.email ??
                                                            '-'}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {serviceLabels[
                                                        manuscript.service_type
                                                    ] ??
                                                        manuscript.service_type ??
                                                        '-'}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                                                            manuscript.status
                                                        )}`}
                                                    >
                                                        {statusLabels[
                                                            manuscript.status
                                                        ] ??
                                                            manuscript.status}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(
                                                        manuscript.created_at
                                                    ).toLocaleDateString(
                                                        'id-ID'
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={route(
                                                            'admin.manuscripts.show',
                                                            manuscript.id
                                                        )}
                                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                                    >
                                                        Lihat Detail →
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-12 text-center text-sm text-gray-500"
                                            >
                                                Tidak ada naskah yang ditemukan.
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
                                        <Link
                                            key={index}
                                            href={link.url ?? '#'}
                                            preserveScroll
                                            className={`rounded-lg px-3 py-2 text-sm ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : link.url
                                                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                      : 'cursor-not-allowed bg-gray-50 text-gray-400'
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
