import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ documentations = [] }) {
    function deleteDocumentation(documentation) {
        if (
            confirm(
                `Hapus dokumentasi "${documentation.title}"? File terkait juga akan dihapus.`,
            )
        ) {
            router.delete(
                route(
                    'admin.documentations.destroy',
                    documentation.id,
                ),
            );
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Dokumentasi
                </h2>
            }
        >
            <Head title="Dokumentasi" />

            <div className="p-6">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Dokumentasi
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Kelola foto dan video kegiatan penerbit.
                        </p>
                    </div>

                    <Link
                        href={route('admin.documentations.create')}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        + Tambah Dokumentasi
                    </Link>
                </div>

                {documentations.length === 0 ? (
                    <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
                        <p className="font-medium">
                            Belum ada dokumentasi.
                        </p>

                        <p className="mt-1 text-sm">
                            Silakan tambahkan foto atau video kegiatan.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border bg-white">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="px-4 py-3">Pratinjau</th>
                                    <th className="px-4 py-3">Judul</th>
                                    <th className="px-4 py-3">Jenis</th>
                                    <th className="px-4 py-3">Urutan</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Aksi</th>
                                </tr>
                            </thead>

                            <tbody>
                                {documentations.map((documentation) => (
                                    <tr
                                        key={documentation.id}
                                        className="border-t"
                                    >
                                        <td className="px-4 py-3">
                                            {documentation.type === 'photo' ? (
                                                <img
                                                    src={`/storage/${documentation.file_path}`}
                                                    alt={documentation.title}
                                                    className="h-16 w-24 rounded-md border object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-16 w-24 items-center justify-center rounded-md border bg-gray-100 text-xs text-gray-600">
                                                    Video
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            <div>{documentation.title}</div>

                                            {documentation.description && (
                                                <p className="mt-1 max-w-xs truncate text-xs font-normal text-gray-500">
                                                    {documentation.description}
                                                </p>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            {documentation.type === 'photo'
                                                ? 'Foto'
                                                : 'Video'}
                                        </td>

                                        <td className="px-4 py-3 text-gray-600">
                                            {documentation.sort_order}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs ${
                                                    documentation.is_active
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {documentation.is_active
                                                    ? 'Aktif'
                                                    : 'Nonaktif'}
                                            </span>
                                        </td>

                                        <td className="space-x-3 whitespace-nowrap px-4 py-3">
                                            <Link
                                                href={route(
                                                    'admin.documentations.edit',
                                                    documentation.id,
                                                )}
                                                className="font-medium text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deleteDocumentation(
                                                        documentation,
                                                    )
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
