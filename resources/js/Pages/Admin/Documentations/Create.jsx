import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        type: 'photo',
        file: null,
        is_active: true,
        sort_order: 0,
    });

    function handleSubmit(e) {
        e.preventDefault();

        post(route('admin.documentations.store'), {
            forceFormData: true,
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Tambah Dokumentasi
                </h2>
            }
        >
            <Head title="Tambah Dokumentasi" />

            <div className="p-6">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Tambah Dokumentasi
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Tambahkan foto atau video kegiatan penerbit.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 rounded-lg border bg-white p-6 shadow-sm"
                    >
                        {/* Judul */}
                        <div>
                            <label
                                htmlFor="title"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Judul Dokumentasi
                            </label>

                            <input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Contoh: Kegiatan Peluncuran Buku"
                                required
                            />

                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Deskripsi */}
                        <div>
                            <label
                                htmlFor="description"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Deskripsi
                            </label>

                            <textarea
                                id="description"
                                rows="4"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Tuliskan deskripsi dokumentasi (opsional)"
                            />

                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Jenis */}
                        <div>
                            <label
                                htmlFor="type"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Jenis Dokumentasi
                            </label>

                            <select
                                id="type"
                                value={data.type}
                                onChange={(e) =>
                                    setData('type', e.target.value)
                                }
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="photo">Foto</option>
                                <option value="video">Video</option>
                            </select>

                            {errors.type && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        {/* File */}
                        <div>
                            <label
                                htmlFor="file"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                File {data.type === 'photo' ? 'Foto' : 'Video'}
                            </label>

                            <input
                                id="file"
                                type="file"
                                accept={
                                    data.type === 'photo'
                                        ? 'image/*'
                                        : 'video/*'
                                }
                                onChange={(e) =>
                                    setData(
                                        'file',
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                                className="block w-full rounded-lg border border-gray-300 p-2 text-sm"
                                required
                            />

                            <p className="mt-1 text-xs text-gray-500">
                                Ukuran maksimal 50 MB.
                            </p>

                            {errors.file && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.file}
                                </p>
                            )}
                        </div>

                        {/* Urutan */}
                        <div>
                            <label
                                htmlFor="sort_order"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Urutan Tampilan
                            </label>

                            <input
                                id="sort_order"
                                type="number"
                                min="0"
                                value={data.sort_order}
                                onChange={(e) =>
                                    setData(
                                        'sort_order',
                                        e.target.value === ''
                                            ? ''
                                            : Number(e.target.value),
                                    )
                                }
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />

                            {errors.sort_order && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.sort_order}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData('is_active', e.target.checked)
                                    }
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />

                                <span className="text-sm font-medium text-gray-700">
                                    Aktifkan dokumentasi agar dapat ditampilkan
                                    di halaman publik
                                </span>
                            </label>

                            {errors.is_active && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.is_active}
                                </p>
                            )}
                        </div>

                        {/* Tombol */}
                        <div className="flex items-center justify-end gap-3 border-t pt-4">
                            <Link
                                href={route('admin.documentations.index')}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Dokumentasi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
