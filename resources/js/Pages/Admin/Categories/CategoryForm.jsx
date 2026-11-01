
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CategoryForm({ category = null }) {
    const isEdit = Boolean(category);

    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name ?? '',
        description: category?.description ?? '',
        is_active: category?.is_active ?? true,
    });

    function submit(e) {
        e.preventDefault();

        if (isEdit) {
            put(route('admin.categories.update', category.id));
        } else {
            post(route('admin.categories.store'));
        }
    }

    const inputClass =
        'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg font-semibold text-slate-800">
                    {isEdit ? 'Edit Kategori' : 'Tambah Kategori'}
                </h2>
            }
        >
            <Head title={isEdit ? 'Edit Kategori' : 'Tambah Kategori'} />

            <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <Link
                        href={route('admin.categories.index')}
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
                    >
                        <span aria-hidden="true">←</span>
                        Kembali ke kategori
                    </Link>

                    <div className="mb-6 mt-5">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            {isEdit ? 'Perbarui Kategori' : 'Kategori Baru'}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {isEdit
                                ? 'Perbarui informasi kategori buku CHIMULIA.'
                                : 'Tambahkan kategori untuk mengelompokkan koleksi buku CHIMULIA.'}
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                            <div className="mb-6 border-b border-slate-100 pb-4">
                                <h2 className="font-semibold text-slate-900">
                                    Informasi Kategori
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Isi nama dan deskripsi kategori.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Nama Kategori
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className={inputClass}
                                        placeholder="Contoh: Buku Referensi Ilmiah"
                                        required
                                        maxLength={255}
                                    />

                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}

                                    <p className="mt-2 text-xs text-slate-400">
                                        Slug akan dibuat otomatis berdasarkan
                                        nama kategori.
                                    </p>
                                </div>

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Deskripsi
                                    </label>

                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        rows={5}
                                        className={inputClass}
                                        placeholder="Jelaskan jenis buku yang termasuk dalam kategori ini..."
                                    />

                                    {errors.description && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                            <h2 className="font-semibold text-slate-900">
                                Status Kategori
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Tentukan apakah kategori dapat digunakan pada
                                halaman publik.
                            </p>

                            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData('is_active', e.target.checked)
                                    }
                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />

                                <span>
                                    <span className="block text-sm font-semibold text-slate-800">
                                        Kategori aktif
                                    </span>
                                    <span className="mt-1 block text-sm text-slate-500">
                                        Kategori aktif dapat ditampilkan pada
                                        katalog buku publik.
                                    </span>
                                </span>
                            </label>

                            {errors.is_active && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.is_active}
                                </p>
                            )}
                        </section>

                        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                            <Link
                                href={route('admin.categories.index')}
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Batal
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing
                                    ? 'Menyimpan...'
                                    : isEdit
                                      ? 'Simpan Perubahan'
                                      : 'Simpan Kategori'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
