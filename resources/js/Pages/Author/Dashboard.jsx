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

function formatDate(date) {
    return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function Dashboard({
    auth,
    stats = {},
    recentManuscripts = [],
    documentLinks = [],
}) {
    const cards = [
        {
            label: 'Total Pengajuan',
            value: stats.total ?? 0,
            icon: '📚',
            color: 'bg-indigo-50 text-indigo-700',
        },
        {
            label: 'Menunggu Peninjauan',
            value: stats.submitted ?? 0,
            icon: '⏳',
            color: 'bg-amber-50 text-amber-700',
        },
        {
            label: 'Sedang Ditinjau',
            value: stats.under_review ?? 0,
            icon: '🔎',
            color: 'bg-blue-50 text-blue-700',
        },
        {
            label: 'Perlu Revisi',
            value: stats.revision ?? 0,
            icon: '📝',
            color: 'bg-orange-50 text-orange-700',
        },
        {
            label: 'Diterima / Terbit',
            value: stats.accepted ?? 0,
            icon: '✓',
            color: 'bg-emerald-50 text-emerald-700',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-sm text-gray-500">
                        Area Penulis
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-gray-800">
                        Dashboard Penulis
                    </h2>
                </div>
            }
        >
            <Head title="Dashboard Penulis" />

            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Sambutan dan tombol pengajuan */}
                    <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-700 p-6 text-white shadow-lg sm:p-8">
                        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                            <div>
                                <p className="text-sm font-medium text-indigo-200">
                                    Selamat datang kembali
                                </p>

                                <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                                    Halo, {auth?.user?.name ?? 'Penulis'}!
                                </h1>

                                <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
                                    Pantau pengajuan naskah Anda dan lanjutkan
                                    perjalanan menerbitkan karya bersama kami.
                                </p>
                            </div>

                            <Link
                                href={route('author.manuscripts.create')}
                                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-teal-500 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-teal-600"
                            >
                                + Ajukan Naskah
                            </Link>
                        </div>
                    </section>


                    <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Dokumen Publikasi
                        </h2>

                        <p className="mt-2 text-sm text-gray-600">
                            Silakan buka dokumen berikut sesuai kebutuhan publikasi naskah Anda.
                        </p>

                        {documentLinks.length > 0 ? (
                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                {documentLinks.map((document) => (
                                    <div
                                        key={document.key}
                                        className="rounded-lg border border-gray-200 p-4"
                                    >
                                        <h3 className="font-medium text-gray-900">
                                            {document.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Buka dokumen melalui Google Drive.
                                        </p>

                                        <a
                                            href={document.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                        >
                                            Buka Dokumen
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-4 rounded-md bg-gray-50 p-4 text-sm text-gray-600">
                                Dokumen belum tersedia. Silakan hubungi Admin jika tautan
                                dokumen belum ditambahkan.
                            </p>
                        )}
                    </div>


                    {/* Ringkasan statistik */}
                    <section>
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-900">
                                Ringkasan Pengajuan
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Gambaran perkembangan seluruh naskah Anda.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                            {cards.map((card) => (
                                <div
                                    key={card.label}
                                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${card.color}`}
                                        >
                                            {card.icon}
                                        </div>

                                        <span className="text-3xl font-bold text-gray-900">
                                            {card.value}
                                        </span>
                                    </div>

                                    <p className="mt-4 text-sm font-medium text-gray-600">
                                        {card.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Daftar pengajuan terbaru */}
                    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Pengajuan Terbaru
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Lima pengajuan terakhir yang Anda kirim.
                                </p>
                            </div>

                            <Link
                                href={route('author.manuscripts.index')}
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                                Lihat semua pengajuan →
                            </Link>
                        </div>

                        {recentManuscripts.length === 0 ? (
                            <div className="px-6 py-14 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-3xl">
                                    📄
                                </div>

                                <h4 className="mt-4 font-bold text-gray-900">
                                    Belum Ada Naskah
                                </h4>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                    Anda belum memiliki pengajuan naskah.
                                    Klik tombol Ajukan Naskah untuk memulai.
                                </p>

                                <Link
                                    href={route('author.manuscripts.create')}
                                    className="mt-5 inline-flex rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                                >
                                    Ajukan Naskah Pertama
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Judul Naskah
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Kategori Buku
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Tanggal
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {recentManuscripts.map((manuscript) => (
                                            <tr
                                                key={manuscript.id}
                                                className="transition hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-gray-900">
                                                        {manuscript.title}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-400">
                                                        ID #{manuscript.id}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {manuscript.category?.name ??
                                                        'Belum ditentukan'}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                    {formatDate(
                                                        manuscript.created_at
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColor(manuscript.status)}`}
                                                    >
                                                        {statusLabel(
                                                            manuscript.status
                                                        )}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {/* Panduan proses */}
                    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900">
                            Tahapan Pengajuan Naskah
                        </h3>

                        <div className="mt-5 grid gap-5 sm:grid-cols-3">
                            <div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 font-bold text-indigo-700">
                                    1
                                </div>
                                <h4 className="mt-3 font-semibold text-gray-900">
                                    Kirim Naskah
                                </h4>
                                <p className="mt-1 text-sm leading-6 text-gray-500">
                                    Lengkapi formulir dan unggah dokumen naskah
                                    Anda.
                                </p>
                            </div>

                            <div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 font-bold text-blue-700">
                                    2
                                </div>
                                <h4 className="mt-3 font-semibold text-gray-900">
                                    Peninjauan Editor
                                </h4>
                                <p className="mt-1 text-sm leading-6 text-gray-500">
                                    Tim editor memeriksa kelengkapan dan isi
                                    naskah.
                                </p>
                            </div>

                            <div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 font-bold text-emerald-700">
                                    3
                                </div>
                                <h4 className="mt-3 font-semibold text-gray-900">
                                    Hasil Peninjauan
                                </h4>
                                <p className="mt-1 text-sm leading-6 text-gray-500">
                                    Pantau apakah naskah diterima, perlu revisi,
                                    atau belum dapat dilanjutkan.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
