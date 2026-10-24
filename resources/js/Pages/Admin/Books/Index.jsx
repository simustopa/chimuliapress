import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ books = [] }) {
    function deleteBook(book) {
        if (
            confirm(
                `Hapus buku "${book.title}"? Tindakan ini tidak dapat dibatalkan.`,
            )
        ) {
            router.delete(route('admin.books.destroy', book.id));
        }
    }

    function formatRupiah(value) {
        if (value === null || value === undefined || value === '') {
            return '-';
        }

        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Manajemen Buku
                </h2>
            }
        >
            <Head title="Manajemen Buku" />

            <div className="p-4 sm:p-6">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Manajemen Buku
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Kelola informasi buku, harga, ketersediaan, dan
                            label Best Seller.
                        </p>
                    </div>

                    <Link
                        href={route('admin.books.create')}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        + Tambah Buku
                    </Link>
                </div>

                {books.length === 0 ? (
                    <div className="rounded-lg border border-dashed bg-white p-10 text-center text-gray-500">
                        <h3 className="font-semibold text-gray-800">
                            Belum ada data buku
                        </h3>
                        <p className="mt-2 text-sm">
                            Klik Tambah Buku untuk menambahkan buku pertama.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
                        <table className="w-full min-w-[1200px] text-left text-sm">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="px-4 py-3">Buku</th>
                                    <th className="px-4 py-3">Penulis</th>
                                    <th className="px-4 py-3">Kategori</th>
                                    <th className="px-4 py-3">Harga</th>
                                    <th className="px-4 py-3">Terjual</th>
                                    <th className="px-4 py-3">Ketersediaan</th>
                                    <th className="px-4 py-3">Label</th>
                                    <th className="px-4 py-3">Publikasi</th>
                                    <th className="px-4 py-3">Tanggal Terbit</th>
                                    <th className="px-4 py-3">Aksi</th>
                                </tr>
                            </thead>

                            <tbody>
                                {books.map((book) => (
                                    <tr key={book.id} className="border-t align-top">
                                        <td className="px-4 py-4">
                                            <div className="flex min-w-[210px] items-start gap-3">
                                                {book.cover_image ? (
                                                    <img
                                                        src={`/storage/${book.cover_image}`}
                                                        alt={`Sampul ${book.title}`}
                                                        className="h-20 w-14 rounded border object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-20 w-14 items-center justify-center rounded border bg-gray-50 text-xs text-gray-400">
                                                        Tanpa sampul
                                                    </div>
                                                )}

                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {book.title}
                                                    </p>
                                                    {book.subtitle && (
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {book.subtitle}
                                                        </p>
                                                    )}
                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {book.slug}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-gray-600">
                                            {book.authors?.length
                                                ? book.authors
                                                      .map((author) => author.name)
                                                      .join(', ')
                                                : '-'}
                                        </td>

                                        <td className="max-w-[200px] px-4 py-4 text-gray-600">
                                            {book.categories?.length
                                                ? book.categories
                                                      .map((category) => category.name)
                                                      .join(', ')
                                                : '-'}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-800">
                                            {formatRupiah(book.price)}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                                            {Number(book.sold_count ?? 0).toLocaleString('id-ID')}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    book.availability_status === 'preorder'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}
                                            >
                                                {book.availability_status === 'preorder'
                                                    ? 'Preorder'
                                                    : 'Ready'}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            {book.is_best_seller ? (
                                                <span className="inline-flex whitespace-nowrap rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-800">
                                                    ★ Best Seller
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    book.status === 'published'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {book.status === 'published'
                                                    ? 'Terbit'
                                                    : 'Draft'}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                                            {book.published_at
                                                ? String(book.published_at).slice(0, 10)
                                                : '-'}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4">
                                            <div className="flex flex-col items-start gap-2">
                                                <Link
                                                    href={route('admin.books.edit', book.id)}
                                                    className="font-medium text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => deleteBook(book)}
                                                    className="font-medium text-red-600 hover:underline"
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
        </AuthenticatedLayout>
    );
}
