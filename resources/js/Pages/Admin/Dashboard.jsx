import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({
    stats,
    recentManuscripts = [],
    recentBooks = [],
}) {
    const statusLabels = {
        submitted: 'Dikirim',
        under_review: 'Ditinjau',
        revision: 'Revisi',
        accepted: 'Diterima',
        rejected: 'Ditolak',
        published: 'Diterbitkan',
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard Admin
                </h2>
            }
        >
            <Head title="Dashboard Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">

                    <div className="mb-6">
                    <Link
                        href={route('admin.document-links.edit')}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        Pengaturan Tautan Dokumen
                    </Link>
                </div>
                    {/* Statistik */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">

                        <div className="rounded-xl bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Total Buku
                            </p>
                            <p className="mt-2 text-3xl font-bold text-gray-900">
                                {stats.books}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Kategori
                            </p>
                            <p className="mt-2 text-3xl font-bold text-gray-900">
                                {stats.categories}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Author
                            </p>
                            <p className="mt-2 text-3xl font-bold text-gray-900">
                                {stats.authors}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Total Naskah
                            </p>
                            <p className="mt-2 text-3xl font-bold text-gray-900">
                                {stats.manuscripts}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Menunggu Review
                            </p>
                            <p className="mt-2 text-3xl font-bold text-indigo-600">
                                {stats.pending_manuscripts}
                            </p>
                        </div>

                    </div>

                    {/* Naskah terbaru */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Naskah Terbaru
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Pengajuan naskah terbaru dari author
                                </p>
                            </div>

                            <Link
                                href={route('editor.manuscripts.index')}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                            >
                                Lihat Semua
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                            Judul
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                            Author
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                            Tanggal
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {recentManuscripts.length > 0 ? (
                                        recentManuscripts.map((manuscript) => (
                                            <tr key={manuscript.id}>
                                                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                                    {manuscript.title}
                                                </td>

                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {manuscript.user?.name ?? '-'}
                                                </td>

                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {statusLabels[manuscript.status] ??
                                                        manuscript.status}
                                                </td>

                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {new Date(
                                                        manuscript.created_at
                                                    ).toLocaleDateString('id-ID')}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-4 py-8 text-center text-sm text-gray-500"
                                            >
                                                Belum ada pengajuan naskah.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Buku terbaru */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Buku Terbaru
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Buku yang baru ditambahkan
                                </p>
                            </div>

                            <Link
                                href={route('admin.books.index')}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                            >
                                Lihat Semua
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                            Judul
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                            Tanggal
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {recentBooks.length > 0 ? (
                                        recentBooks.map((book) => (
                                            <tr key={book.id}>
                                                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                                    {book.title}
                                                </td>

                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {book.status}
                                                </td>

                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {new Date(
                                                        book.created_at
                                                    ).toLocaleDateString('id-ID')}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="px-4 py-8 text-center text-sm text-gray-500"
                                            >
                                                Belum ada buku.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
