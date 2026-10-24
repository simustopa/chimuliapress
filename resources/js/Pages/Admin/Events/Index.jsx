
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

const typeLabels = {
    upcoming: 'Event Mendatang',
    news: 'Berita',
    open_program: 'Program Terbuka',
};

export default function Index({ events }) {
    const { flash } = usePage().props;

    function deleteEvent(event) {
        if (confirm(`Yakin ingin menghapus "${event.title}"?`)) {
            router.delete(route('admin.events.destroy', event.id));
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Event & News
                </h2>
            }
        >
            <Head title="Event & News" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="rounded-md bg-green-100 p-4 text-green-700">
                            {flash.success}
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Kelola Event & News
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Kelola event mendatang, berita, dan program terbuka.
                            </p>
                        </div>

                        <Link
                            href={route('admin.events.create')}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                            + Tambah Konten
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {[
                                            'Sampul',
                                            'Judul',
                                            'Jenis',
                                            'Tanggal',
                                            'Status',
                                            'Urutan',
                                            'Aksi',
                                        ].map((heading) => (
                                            <th
                                                key={heading}
                                                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {events.length > 0 ? (
                                        events.map((event) => (
                                            <tr key={event.id}>
                                                <td className="px-4 py-3">
                                                    {event.cover_image ? (
                                                        <img
                                                            src={`/storage/${event.cover_image}`}
                                                            alt={event.title}
                                                            className="h-14 w-20 rounded object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-gray-400">
                                                            Tanpa sampul
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-gray-900">
                                                        {event.title}
                                                    </p>
                                                    <p className="mt-1 max-w-xs truncate text-sm text-gray-500">
                                                        {event.description || '-'}
                                                    </p>
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                                                    {typeLabels[event.type] || event.type}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                                                    {event.event_date
                                                        ? new Date(
                                                              `${event.event_date.substring(0, 10)}T00:00:00`,
                                                          ).toLocaleDateString('id-ID', {
                                                              day: 'numeric',
                                                              month: 'short',
                                                              year: 'numeric',
                                                          })
                                                        : '-'}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                            event.is_active
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-gray-100 text-gray-600'
                                                        }`}
                                                    >
                                                        {event.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    {event.sort_order}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <Link
                                                            href={route(
                                                                'admin.events.edit',
                                                                event.id,
                                                            )}
                                                            className="text-indigo-600 hover:text-indigo-800"
                                                        >
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => deleteEvent(event)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-4 py-10 text-center text-gray-500"
                                            >
                                                Belum ada konten Event & News.
                                            </td>
                                        </tr>
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
