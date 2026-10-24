import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ documentation }) {
    const { data, setData, post, processing, errors } = useForm({
        title: documentation.title ?? '',
        description: documentation.description ?? '',
        type: documentation.type ?? 'photo',
        file: null,
        is_active: Boolean(documentation.is_active),
        sort_order: documentation.sort_order ?? 0,
        _method: 'put',
    });

    function handleSubmit(e) {
        e.preventDefault();

        post(route('admin.documentations.update', documentation.id), {
            forceFormData: true,
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Edit Dokumentasi
                </h2>
            }
        >
            <Head title="Edit Dokumentasi" />

            <div className="p-6">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Edit Dokumentasi
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Perbarui informasi atau ganti file dokumentasi.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                        className="space-y-6 rounded-lg border bg-white p-6 shadow-sm"
                    >
                        {/* File saat ini */}
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-700">
                                File Saat Ini
                            </p>

                            {documentation.type === 'photo' ? (
                                <img
                                    src={`/storage/${documentation.file_path}`}
                                    alt={documentation.title}
                                    className="h-48 max-w-full rounded-lg border object-contain"
                                />
                            ) : (
                                <video
                                    src={`/storage/${documentation.file_path}`}
                                    controls
                                    className="max-h-64 w-full rounded-lg border bg-black"
                                >
                                    Browser tidak mendukung pemutaran video.
                                </video>
                            )}
                        </div>

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
                                onChange={(e) => {
                                    setData((current) => ({
                                        ...current,
                                        type: e.target.value,
                                        file: null,
                                    }));

                                    const input =
                                        document.getElementById('file');

                                    if (input) {
                                        input.value = '';
                                    }
                                }}
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

                        {/* Ganti file */}
                        <div>
                            <label
                                htmlFor="file"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Ganti File{' '}
                                {data.type === 'photo' ? 'Foto' : 'Video'}
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
                            />

                            <p className="mt-1 text-xs text-gray-500">
                                Kosongkan jika tidak ingin mengganti file.
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
                                    : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
