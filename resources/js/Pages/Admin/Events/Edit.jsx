
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const typeLabels = {
    upcoming: 'Event Mendatang',
    news: 'Berita',
    open_program: 'Program Terbuka',
};

export default function Edit({ event }) {
    const { data, setData, post, processing, errors } = useForm({
        title: event.title ?? '',
        description: event.description ?? '',
        type: event.type ?? 'upcoming',
        cover_image: null,
        event_date: event.event_date
            ? event.event_date.substring(0, 10)
            : '',
        registration_url: event.registration_url ?? '',
        is_active: Boolean(event.is_active),
        sort_order: event.sort_order ?? 0,
        _method: 'put',
    });

    function submit(e) {
        e.preventDefault();

        post(route('admin.events.update', event.id), {
            forceFormData: true,
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Edit Event & News
                </h2>
            }
        >
            <Head title={`Edit ${event.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <form
                        onSubmit={submit}
                        className="space-y-6 rounded-lg bg-white p-6 shadow-sm"
                    >
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Judul Konten
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Jenis Konten
                            </label>
                            <select
                                value={data.type}
                                onChange={(e) =>
                                    setData('type', e.target.value)
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            >
                                <option value="upcoming">Event Mendatang</option>
                                <option value="news">Berita</option>
                                <option value="open_program">
                                    Program Terbuka
                                </option>
                            </select>
                            {errors.type && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Deskripsi
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows="4"
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Gambar Sampul Saat Ini
                            </label>

                            {event.cover_image ? (
                                <img
                                    src={`/storage/${event.cover_image}`}
                                    alt={event.title}
                                    className="mb-3 h-40 w-auto rounded-md object-cover"
                                />
                            ) : (
                                <p className="mb-3 text-sm text-gray-500">
                                    Belum ada gambar sampul.
                                </p>
                            )}

                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Ganti Gambar Sampul (opsional)
                            </label>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={(e) =>
                                    setData(
                                        'cover_image',
                                        e.target.files[0] || null,
                                    )
                                }
                                className="w-full rounded-md border border-gray-300 p-2 text-sm"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Kosongkan jika ingin mempertahankan gambar saat ini.
                                Format JPG, JPEG, PNG, atau WebP, maksimal 5 MB.
                            </p>
                            {errors.cover_image && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.cover_image}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Tanggal Event (opsional)
                            </label>
                            <input
                                type="date"
                                value={data.event_date}
                                onChange={(e) =>
                                    setData('event_date', e.target.value)
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {errors.event_date && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.event_date}
                                </p>
                            )}
                        </div>

                        {data.type === 'upcoming' && (
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    URL Google Form Pendaftaran
                                </label>
                                <input
                                    type="url"
                                    value={data.registration_url}
                                    onChange={(e) =>
                                        setData(
                                            'registration_url',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                    placeholder="https://forms.google.com/..."
                                />
                                {errors.registration_url && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.registration_url}
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Urutan Tampilan
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={data.sort_order}
                                onChange={(e) =>
                                    setData('sort_order', e.target.value)
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                            {errors.sort_order && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.sort_order}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                id="is_active"
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) =>
                                    setData('is_active', e.target.checked)
                                }
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                                htmlFor="is_active"
                                className="text-sm font-medium text-gray-700"
                            >
                                Aktifkan dan tampilkan di halaman publik
                            </label>
                        </div>

                        <div className="flex flex-wrap justify-end gap-3 border-t pt-4">
                            <Link
                                href={route('admin.events.index')}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
