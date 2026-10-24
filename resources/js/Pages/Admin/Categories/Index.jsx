import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ categories }) {
    function deleteCategory(category) {
        if (confirm(`Hapus kategori "${category.name}"?`)) {
            router.delete(route('admin.categories.destroy', category.id));
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Kategori Buku
                </h2>
            }
        >
            <Head title="Kategori Buku" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Kategori Buku
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Kelola kategori buku penerbit.
                        </p>
                    </div>

                    <Link
                        href={route('admin.categories.create')}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        + Tambah Kategori
                    </Link>
                </div>

                {categories.length === 0 ? (
                    <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
                        Belum ada kategori. Silakan tambahkan kategori baru.
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border bg-white">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="px-4 py-3">Nama</th>
                                    <th className="px-4 py-3">Slug</th>
                                    <th className="px-4 py-3">Deskripsi</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id} className="border-t">
                                        <td className="px-4 py-3 font-medium">
                                            {category.name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {category.slug}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {category.description || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs ${
                                                    category.is_active
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {category.is_active
                                                    ? 'Aktif'
                                                    : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="space-x-3 whitespace-nowrap px-4 py-3">
                                            <Link
                                                href={route(
                                                    'admin.categories.edit',
                                                    category.id,
                                                )}
                                                className="font-medium text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    deleteCategory(category)
                                                }
                                                className="font-medium text-red-600 hover:underline"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
