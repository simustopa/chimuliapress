
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function BookForm({ auth, book = null, categories = [] }) {
    const isEdit = Boolean(book);

    const { data, setData, post, processing, errors } = useForm({
        title: book?.title ?? '',
        subtitle: book?.subtitle ?? '',
        description: book?.description ?? '',
        status: book?.status ?? 'draft',
        author_name: (book?.authors ?? []).map((author) => author.name).join(', '),
        category_name: book?.categories?.[0]?.name ?? '',
        published_at: book?.published_at ? String(book.published_at).slice(0, 10) : '',
        cover_image: null,
        _method: isEdit ? 'put' : undefined,
        price: book?.price ?? '',
        sold_count: book?.sold_count ?? 0,
        availability_status: book?.availability_status ?? 'ready',
        is_best_seller: Boolean(book?.is_best_seller),
    });

    function submit(e) {
        e.preventDefault();

        if (isEdit) {
            post(route('admin.books.update', book.id), {
                forceFormData: true,
            });
        } else {
            post(route('admin.books.store'), {
                forceFormData: true,
            });
        }
    }

    const inputClass = (field) =>
        `mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
            errors[field]
                ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-50'
                : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-50'
        }`;

    function FieldError({ field }) {
        return errors[field] ? (
            <p className="mt-2 text-sm text-rose-600">{errors[field]}</p>
        ) : null;
    }

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                <div>
                    <p className="text-sm font-medium text-indigo-600">Administrasi CHIMULIA</p>
                    <h2 className="mt-1 text-xl font-bold text-slate-800">
                        {isEdit ? 'Edit Buku' : 'Tambah Buku'}
                    </h2>
                </div>
            }
        >
            <Head title={isEdit ? `Edit Buku - ${book.title}` : 'Tambah Buku'} />

            <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
                <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div>
                        <Link
                            href={route('admin.books.index')}
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
                        >
                            <span aria-hidden="true">←</span>
                            Kembali ke daftar buku
                        </Link>

                        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                            {isEdit ? 'Perbarui Informasi Buku' : 'Tambahkan Buku Baru'}
                        </h1>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            {isEdit
                                ? 'Periksa dan perbarui informasi buku di katalog CHIMULIA.'
                                : 'Lengkapi informasi buku untuk menambah koleksi katalog CHIMULIA.'}
                        </p>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                            <p className="font-semibold">Buku belum berhasil disimpan.</p>
                            <p className="mt-1">Periksa kembali kolom yang ditandai dan pastikan data sudah benar.</p>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                                <h3 className="font-bold text-slate-900">Informasi Buku</h3>
                                <p className="mt-1 text-sm text-slate-500">Judul, deskripsi, penulis, dan kategori.</p>
                            </div>

                            <div className="grid gap-5 p-5 sm:p-7">
                                <div>
                                    <label htmlFor="title" className="text-sm font-semibold text-slate-700">
                                        Judul buku <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className={inputClass('title')}
                                        placeholder="Masukkan judul buku"
                                        required
                                        maxLength={255}
                                    />
                                    <FieldError field="title" />
                                </div>

                                <div>
                                    <label htmlFor="subtitle" className="text-sm font-semibold text-slate-700">Subjudul</label>
                                    <input
                                        id="subtitle"
                                        type="text"
                                        value={data.subtitle}
                                        onChange={(e) => setData('subtitle', e.target.value)}
                                        className={inputClass('subtitle')}
                                        placeholder="Subjudul buku (opsional)"
                                        maxLength={255}
                                    />
                                    <FieldError field="subtitle" />
                                </div>

                                <div>
                                    <label htmlFor="description" className="text-sm font-semibold text-slate-700">Deskripsi buku</label>
                                    <textarea
                                        id="description"
                                        rows={5}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className={inputClass('description')}
                                        placeholder="Jelaskan isi, tujuan, dan keunggulan buku..."
                                    />
                                    <FieldError field="description" />
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="author_name" className="text-sm font-semibold text-slate-700">Nama penulis</label>
                                        <input
                                            id="author_name"
                                            type="text"
                                            value={data.author_name}
                                            onChange={(e) => setData('author_name', e.target.value)}
                                            className={inputClass('author_name')}
                                            placeholder="Masukkan nama penulis"
                                        />
                                        <p className="mt-2 text-xs leading-5 text-slate-400">
                                            Penulis baru akan dibuat otomatis jika belum terdaftar. Pisahkan dengan koma jika mengisi beberapa nama.
                                        </p>
                                        <FieldError field="author_name" />
                                    </div>

                                    <div>
                                        <label htmlFor="category_name" className="text-sm font-semibold text-slate-700">
                                            Kategori buku <span className="text-rose-500">*</span>
                                        </label>
                                        <select
                                            id="category_name"
                                            value={data.category_name}
                                            onChange={(e) => setData('category_name', e.target.value)}
                                            className={inputClass('category_name')}
                                            required
                                        >
                                            <option value="">Pilih kategori buku</option>
                                            {categories.map((category) => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                        <FieldError field="category_name" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                                <h3 className="font-bold text-slate-900">Informasi Penerbitan</h3>
                                <p className="mt-1 text-sm text-slate-500">Tanggal terbit dan status publikasi.</p>
                            </div>

                            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
                                <div>
                                    <label htmlFor="published_at" className="text-sm font-semibold text-slate-700">Tanggal terbit</label>
                                    <input
                                        id="published_at"
                                        type="date"
                                        value={data.published_at}
                                        onChange={(e) => setData('published_at', e.target.value)}
                                        className={inputClass('published_at')}
                                    />
                                    <FieldError field="published_at" />
                                </div>

                                <div>
                                    <label htmlFor="status" className="text-sm font-semibold text-slate-700">
                                        Status publikasi <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className={inputClass('status')}
                                        required
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Diterbitkan</option>
                                    </select>
                                    <FieldError field="status" />
                                </div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                                <h3 className="font-bold text-slate-900">Harga dan Ketersediaan</h3>
                                <p className="mt-1 text-sm text-slate-500">Atur harga, jumlah terjual, dan label katalog.</p>
                            </div>

                            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
                                <div>
                                    <label htmlFor="price" className="text-sm font-semibold text-slate-700">Harga buku (Rupiah)</label>
                                    <div className="mt-2 flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50">
                                        <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500">Rp</span>
                                        <input
                                            id="price"
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            className="w-full border-0 px-4 py-3 text-sm outline-none focus:ring-0"
                                            placeholder="85000"
                                        />
                                    </div>
                                    <FieldError field="price" />
                                </div>

                                <div>
                                    <label htmlFor="sold_count" className="text-sm font-semibold text-slate-700">
                                        Jumlah terjual <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        id="sold_count"
                                        type="number"
                                        min="0"
                                        step="1"
                                        required
                                        value={data.sold_count}
                                        onChange={(e) => setData('sold_count', e.target.value)}
                                        className={inputClass('sold_count')}
                                    />
                                    <FieldError field="sold_count" />
                                </div>

                                <div>
                                    <label htmlFor="availability_status" className="text-sm font-semibold text-slate-700">
                                        Ketersediaan <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        id="availability_status"
                                        value={data.availability_status}
                                        onChange={(e) => setData('availability_status', e.target.value)}
                                        className={inputClass('availability_status')}
                                        required
                                    >
                                        <option value="ready">Ready</option>
                                        <option value="preorder">Preorder</option>
                                    </select>
                                    <FieldError field="availability_status" />
                                </div>

                                <div className="flex items-center">
                                    <label className="flex w-full cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/60 p-4 transition hover:bg-amber-50">
                                        <input
                                            type="checkbox"
                                            checked={data.is_best_seller}
                                            onChange={(e) => setData('is_best_seller', e.target.checked)}
                                            className="mt-1 h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                        />
                                        <span>
                                            <span className="block text-sm font-semibold text-slate-800">★ Best Seller</span>
                                            <span className="mt-1 block text-xs leading-5 text-slate-500">
                                                Tampilkan label Best Seller pada katalog publik.
                                            </span>
                                        </span>
                                    </label>
                                </div>
                                <div className="sm:col-span-2">
                                    <FieldError field="is_best_seller" />
                                </div>
                                <div className="sm:col-span-2">
                                    <FieldError field="sold_count" />
                                </div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                                <h3 className="font-bold text-slate-900">Sampul Buku</h3>
                                <p className="mt-1 text-sm text-slate-500">Gunakan gambar JPG, PNG, atau WebP dengan ukuran maksimal 2 MB.</p>
                            </div>

                            <div className="p-5 sm:p-7">
                                {isEdit && book.cover_image && (
                                    <div className="mb-5 flex items-start gap-4">
                                        <img
                                            src={`/storage/${book.cover_image}`}
                                            alt={`Sampul ${book.title}`}
                                            className="h-44 w-32 rounded-xl border border-slate-200 bg-slate-50 object-cover shadow-sm"
                                        />
                                        <div className="pt-2">
                                            <p className="text-sm font-semibold text-slate-800">Sampul saat ini</p>
                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                Biarkan pilihan file kosong jika sampul ini ingin dipertahankan.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {isEdit && !book.cover_image && (
                                    <p className="mb-4 text-sm text-slate-500">Buku ini belum memiliki sampul.</p>
                                )}

                                <label htmlFor="cover_image" className="text-sm font-semibold text-slate-700">
                                    {isEdit ? 'Ganti sampul (opsional)' : 'Unggah sampul'}
                                </label>
                                <input
                                    id="cover_image"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(e) => setData('cover_image', e.target.files?.[0] ?? null)}
                                    className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600 file:mr-4 file:border-0 file:bg-indigo-50 file:px-4 file:py-3 file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                {data.cover_image && (
                                    <p className="mt-2 text-xs text-slate-500">
                                        File dipilih: {data.cover_image.name}
                                    </p>
                                )}
                                <FieldError field="cover_image" />
                            </div>
                        </section>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Link
                                href={route('admin.books.index')}
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing
                                    ? 'Menyimpan...'
                                    : isEdit
                                        ? 'Simpan Perubahan'
                                        : 'Simpan Buku'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
