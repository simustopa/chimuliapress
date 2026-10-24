
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, authors = [] }) {
    function deleteAuthor(author) {
        if (confirm(`Yakin ingin menghapus penulis "${author.name}"?`)) {
            router.delete(route('admin.authors.destroy', author.id));
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Manajemen Penulis
                </h2>
            }
        >
            <Head title="Manajemen Penulis" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="flex flex-col gap-3 border-b p-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Daftar Penulis
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Kelola data penulis yang bekerja sama dengan penerbit.
                                </p>
                            </div>

                            <Link
                                href={route('admin.authors.create')}
                                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                            >
                                + Tambah Penulis
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="px-6 py-4">No.</th>
                                        <th className="px-6 py-4">Nama Penulis</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {authors.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-10 text-center text-gray-500"
                                            >
                                                Belum ada data penulis. Klik
                                                "Tambah Penulis" untuk memulai.
                                            </td>
                                        </tr>
                                    ) : (
                                        authors.map((author, index) => (
                                            <tr key={author.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">{index + 1}</td>

                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {author.name}
                                                    {author.bio && (
                                                        <p className="mt-1 max-w-md truncate text-xs font-normal text-gray-500">
                                                            {author.bio}
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    {author.email || '-'}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                            author.is_active
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                        }`}
                                                    >
                                                        {author.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={route('admin.authors.edit', author.id)}
                                                            className="rounded-md border border-indigo-200 px-3 py-1.5 font-medium text-indigo-700 hover:bg-indigo-50"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => deleteAuthor(author)}
                                                            className="rounded-md border border-red-200 px-3 py-1.5 font-medium text-red-700 hover:bg-red-50"
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
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
