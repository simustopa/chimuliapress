import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

function statusLabel(status) {
    const labels = {
        submitted: 'Menunggu Peninjauan',
        under_review: 'Sedang Ditinjau',
        revision: 'Perlu Revisi',
        accepted: 'Diterima',
        rejected: 'Ditolak',
        published: 'Diterbitkan',
    };

    return labels[status] ?? status;
}

function statusColor(status) {
    const colors = {
        submitted: 'bg-amber-100 text-amber-800',
        under_review: 'bg-blue-100 text-blue-800',
        revision: 'bg-orange-100 text-orange-800',
        accepted: 'bg-emerald-100 text-emerald-800',
        rejected: 'bg-red-100 text-red-800',
        published: 'bg-indigo-100 text-indigo-800',
    };

    return colors[status] ?? 'bg-gray-100 text-gray-700';
}

function serviceLabel(service) {
    const services = {
        book_textbook: 'Buku Teks / Buku Ajar',
        school_book: 'Buku Sekolah',
        reference_book: 'Buku Referensi',
        journal_article: 'Artikel Jurnal',
        haki_certificate: 'Sertifikasi HAKI',
    };

    return services[service] ?? service;
}

export default function Dashboard({
    stats = {},
    recentManuscripts = [],
}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard Editor
                </h2>
            }
        >
            <Head title="Dashboard Editor" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Welcome */}
                    <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Dashboard Editor
                        </h1>

                        <p className="mt-2 text-gray-600">
                            Kelola dan tinjau naskah yang masuk dari author.
                        </p>
                    </div>

                    {/* Statistik */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Total Naskah
                            </p>

                            <p className="mt-2 text-3xl font-bold text-gray-900">
                                {stats.total ?? 0}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Menunggu Review
                            </p>

                            <p className="mt-2 text-3xl font-bold text-amber-600">
                                {stats.submitted ?? 0}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Sedang Ditinjau
                            </p>

                            <p className="mt-2 text-3xl font-bold text-blue-600">
                                {stats.under_review ?? 0}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Perlu Revisi
                            </p>

                            <p className="mt-2 text-3xl font-bold text-orange-600">
                                {stats.revision ?? 0}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Diterima
                            </p>

                            <p className="mt-2 text-3xl font-bold text-emerald-600">
                                {stats.accepted ?? 0}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Ditolak
                            </p>

                            <p className="mt-2 text-3xl font-bold text-red-600">
                                {stats.rejected ?? 0}
                            </p>
                        </div>

                    </div>

                    {/* Naskah terbaru */}
                    <div className="mt-8 rounded-xl bg-white shadow-sm">

                        <div className="border-b border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Pengajuan Naskah Terbaru
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Daftar naskah yang baru masuk atau sedang
                                diproses.
                            </p>
                        </div>

                        {recentManuscripts.length === 0 ? (
                            <div className="p-10 text-center">
                                <p className="text-gray-500">
                                    Belum ada pengajuan naskah.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                                Naskah
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                                Author
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                                Layanan
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                                Status
                                            </th>

                                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {recentManuscripts.map(
                                            (manuscript) => (
                                                <tr key={manuscript.id}>

                                                    <td className="px-6 py-4">
                                                        <p className="font-semibold text-gray-900">
                                                            {manuscript.title}
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-500">
                                                            #
                                                            {manuscript.id}
                                                        </p>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {manuscript.user
                                                                ?.name ??
                                                                '-'}
                                                        </p>

                                                        <p className="text-xs text-gray-500">
                                                            {manuscript.user
                                                                ?.email ??
                                                                '-'}
                                                        </p>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {serviceLabel(
                                                            manuscript.service_type
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                                                                manuscript.status
                                                            )}`}
                                                        >
                                                            {statusLabel(
                                                                manuscript.status
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4 text-right">
                                                        <Link
                                                            href={route('editor.manuscripts.show', manuscript.id)}
                                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                                        >
                                                            Review →
                                                        </Link>
                                                    </td>

                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
