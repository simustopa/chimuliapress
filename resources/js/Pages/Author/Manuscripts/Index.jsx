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

export default function Index({
    manuscripts = { data: [], links: [] },
    flash = {},
}) {
    const manuscriptData = manuscripts?.data ?? [];
    const manuscriptLinks = manuscripts?.links ?? [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Pengajuan Naskah Saya
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Pantau perkembangan pengajuan naskah Anda.
                        </p>
                    </div>

                    <Link
                        href={route('author.manuscripts.create')}
                        className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        + Ajukan Naskah
                    </Link>
                </div>
            }
        >
            <Head title="Pengajuan Naskah Saya" />

            <div className="min-h-screen bg-gray-50 px-4 py-8">
                <div className="mx-auto max-w-7xl">

                    {/* Notifikasi sukses */}
                    {flash?.success && (
                        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                            {flash.success}
                        </div>
                    )}

                    {manuscriptData.length === 0 ? (
                        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-3xl">
                                📄
                            </div>

                            <h3 className="mt-5 text-lg font-bold text-gray-900">
                                Belum Ada Pengajuan
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                                Anda belum mengirim naskah. Mulai pengajuan
                                pertama untuk ditinjau oleh tim editor.
                            </p>

                            <Link
                                href={route('author.manuscripts.create')}
                                className="mt-6 inline-flex rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                            >
                                Ajukan Naskah Sekarang
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Judul Naskah
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Kategori
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Tanggal Pengajuan
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {manuscriptData.map((manuscript) => (
                                            <tr key={manuscript.id}>
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-gray-900">
                                                        {manuscript.title}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        ID pengajuan: #{manuscript.id}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {manuscript.category?.name ?? 'Belum ditentukan'}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                    {new Date(
                                                        manuscript.created_at
                                                    ).toLocaleDateString('id-ID', {
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                                                            manuscript.status
                                                        )}`}
                                                    >
                                                        {statusLabel(manuscript.status)}
                                                    </span>

                                                    {manuscript.editor_notes && (
                                                        <p className="mt-2 max-w-xs text-xs text-gray-500">
                                                            Catatan editor:{' '}
                                                            {manuscript.editor_notes}
                                                        </p>
                                                    )}
                                                </td>

                                                {/* TAMBAHKAN INI */}
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={route(
                                                            'author.manuscripts.show',
                                                            manuscript.id
                                                        )}
                                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                                    >
                                                        Lihat Detail →
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {manuscriptLinks.length > 0 && (
                                <div className="flex flex-wrap gap-2 border-t border-gray-100 p-4">
                                    {manuscriptLinks.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url ?? '#'}
                                            preserveScroll
                                            className={`rounded-md border px-3 py-2 text-sm ${
                                                link.active
                                                    ? 'border-indigo-600 bg-indigo-600 text-white'
                                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                            } ${
                                                !link.url
                                                    ? 'pointer-events-none opacity-40'
                                                    : ''
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
