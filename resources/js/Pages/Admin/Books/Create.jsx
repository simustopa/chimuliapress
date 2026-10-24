
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth, categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        subtitle: '',
        description: '',
        status: 'draft',
        author_name: '',
        category_name: '',
        published_at: '',
        cover_image: null,
        price: '',
        sold_count: 0,
        availability_status: 'ready',
        is_best_seller: false,
    });

    function submit(e) {
        e.preventDefault();
        post(route('admin.books.store'));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Tambah Buku
                </h2>
            }
        >
            <Head title="Tambah Buku" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="mb-1 block font-medium">
                                    Judul Buku
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    className="w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">
                                    Subjudul
                                </label>
                                <input
                                    type="text"
                                    value={data.subtitle}
                                    onChange={(e) =>
                                        setData('subtitle', e.target.value)
                                    }
                                    className="w-full rounded-md border-gray-300 shadow-sm"
                                />
                                {errors.subtitle && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.subtitle}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows="5"
                                    className="w-full rounded-md border-gray-300 shadow-sm"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">
                                    Nama Penulis
                                </label>

                                <input
                                    type="text"
                                    value={data.author_name}
                                    onChange={(e) => setData('author_name', e.target.value)}
                                    placeholder="Masukkan nama penulis"
                                    className="w-full rounded-md border-gray-300 shadow-sm"
                                />

                                <p className="mt-1 text-sm text-gray-500">
                                    Jika penulis belum terdaftar, data penulis akan dibuat otomatis.
                                </p>

                                {errors.author_name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.author_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">
                                    Kategori Buku
                                </label>

                                <select
                                    value={data.category_name}
                                    onChange={(e) => setData('category_name', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                >
                                    <option value="">Pilih kategori buku</option>

                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>

                                {errors.category_name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.category_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">Tanggal Terbit</label>
                                <input
                                    type="date"
                                    value={data.published_at}
                                    onChange={(e) => setData('published_at', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm"
                                />
                                {errors.published_at && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.published_at}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">
                                    Status
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) =>
                                        setData('status', e.target.value)
                                    }
                                    className="w-full rounded-md border-gray-300 shadow-sm"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Diterbitkan</option>
                                </select>
                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.status}
                                    </p>
                                )}
                            </div>


                            {/* Harga Buku */}
                            <div>
                                <label className="mb-1 block font-medium">
                                    Harga Buku (Rupiah)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="Contoh: 85000"
                                    className="w-full rounded-md border-gray-300 shadow-sm"
                                />
                                {errors.price && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            {/* Jumlah Terjual */}
                            <div>
                                <label className="mb-1 block font-medium">
                                    Jumlah Terjual
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={data.sold_count}
                                    onChange={(e) =>
                                        setData('sold_count', e.target.value)
                                    }
                                    className="w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                />
                                {errors.sold_count && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.sold_count}
                                    </p>
                                )}
                            </div>

                            {/* Status Ketersediaan */}
                            <div>
                                <label className="mb-1 block font-medium">
                                    Status Ketersediaan Buku
                                </label>
                                <select
                                    value={data.availability_status}
                                    onChange={(e) =>
                                        setData('availability_status', e.target.value)
                                    }
                                    className="w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                >
                                    <option value="ready">Ready</option>
                                    <option value="preorder">Preorder</option>
                                </select>
                                {errors.availability_status && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.availability_status}
                                    </p>
                                )}
                            </div>

                            {/* Label Best Seller */}
                            <div className="rounded-md border p-4">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={data.is_best_seller}
                                        onChange={(e) =>
                                            setData('is_best_seller', e.target.checked)
                                        }
                                        className="rounded border-gray-300 text-indigo-600"
                                    />
                                    <span className="font-medium">
                                        Tandai sebagai Best Seller
                                    </span>
                                </label>
                                <p className="mt-1 text-sm text-gray-500">
                                    Jika dicentang, label Best Seller akan ditampilkan
                                    pada sampul buku di katalog publik.
                                </p>
                                {errors.is_best_seller && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.is_best_seller}
                                    </p>
                                )}
                            </div>


                            <div>
                                <label className="mb-1 block font-medium">
                                    Cover Buku
                                </label>

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(e) => {
                                        setData('cover_image', e.target.files?.[0] ?? null);
                                    }}
                                    className="w-full rounded-md border border-gray-300 p-2"
                                />

                                <p className="mt-1 text-sm text-gray-500">
                                    Format JPG, PNG, atau WebP. Maksimal 2 MB.
                                </p>

                                {errors.cover_image && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.cover_image}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Buku'}
                                </button>

                                <Link
                                    href={route('admin.books.index')}
                                    className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50"
                                >
                                    Batal
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
