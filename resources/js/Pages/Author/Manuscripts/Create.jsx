import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const serviceOptions = [
    { value: 'book_textbook', label: 'Penerbitan Buku Teks' },
    { value: 'school_book', label: 'Penerbitan Buku Sekolah' },
    { value: 'reference_book', label: 'Penerbitan Buku Referensi' },
    { value: 'journal_article', label: 'Publikasi Artikel Jurnal' },
    { value: 'haki_certificate', label: 'Pengurusan Sertifikat HAKI' },
];

export default function Create({ categories = [] }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        title: '',
        contact_phone: '',
        service_type: '',
        category_id: '',
        synopsis: '',
        manuscript_file: null,
        agreement_file: null,
        originality_file: null,
    });

    function handleSubmit(event) {
        event.preventDefault();

        post(route('author.manuscripts.store'), {
            forceFormData: true,
        });
    }

    const inputClass =
        'mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500';

    const labelClass = 'block text-sm font-semibold text-gray-700';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Pengajuan Naskah
                </h2>
            }
        >
            <Head title="Pengajuan Naskah" />

            <div className="py-10">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route('author.dashboard')}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            &larr; Kembali ke Dashboard
                        </Link>

                        <h1 className="mt-4 text-2xl font-bold text-gray-900">
                            Formulir Pengajuan Naskah
                        </h1>

                        <p className="mt-2 text-sm text-gray-600">
                            Lengkapi informasi naskah Anda dan unggah dokumen
                            untuk memulai proses peninjauan oleh tim penerbit.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="title" className={labelClass}>
                                    Judul Naskah *
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(event) =>
                                        setData('title', event.target.value)
                                    }
                                    className={inputClass}
                                    placeholder="Masukkan judul naskah"
                                    required
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="contact_phone"
                                    className={labelClass}
                                >
                                    Nomor WhatsApp *
                                </label>
                                <input
                                    id="contact_phone"
                                    type="tel"
                                    value={data.contact_phone}
                                    onChange={(event) =>
                                        setData(
                                            'contact_phone',
                                            event.target.value,
                                        )
                                    }
                                    className={inputClass}
                                    placeholder="Contoh: 081234567890"
                                    required
                                />
                                {errors.contact_phone && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.contact_phone}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="service_type"
                                    className={labelClass}
                                >
                                    Jenis Layanan *
                                </label>
                                <select
                                    id="service_type"
                                    value={data.service_type}
                                    onChange={(event) =>
                                        setData(
                                            'service_type',
                                            event.target.value,
                                        )
                                    }
                                    className={inputClass}
                                    required
                                >
                                    <option value="">
                                        Pilih jenis layanan
                                    </option>
                                    {serviceOptions.map((service) => (
                                        <option
                                            key={service.value}
                                            value={service.value}
                                        >
                                            {service.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.service_type && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.service_type}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="category_id"
                                    className={labelClass}
                                >
                                    Kategori Buku
                                </label>
                                <select
                                    id="category_id"
                                    value={data.category_id}
                                    onChange={(event) =>
                                        setData(
                                            'category_id',
                                            event.target.value,
                                        )
                                    }
                                    className={inputClass}
                                >
                                    <option value="">
                                        Pilih kategori buku (opsional)
                                    </option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="synopsis"
                                    className={labelClass}
                                >
                                    Sinopsis Naskah *
                                </label>
                                <textarea
                                    id="synopsis"
                                    rows={6}
                                    value={data.synopsis}
                                    onChange={(event) =>
                                        setData(
                                            'synopsis',
                                            event.target.value,
                                        )
                                    }
                                    className={inputClass}
                                    placeholder="Jelaskan isi, tujuan, dan gambaran umum naskah Anda."
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Maksimal 10.000 karakter.
                                </p>
                                {errors.synopsis && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.synopsis}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="manuscript_file"
                                    className={labelClass}
                                >
                                    Dokumen Naskah *
                                </label>
                                <input
                                    id="manuscript_file"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0] ?? null;
                                        setData('manuscript_file', file);
                                    }}
                                    className="mt-2 block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                                    required
                                />

                                {data.manuscript_file && (
                                    <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
                                        <p className="text-sm font-medium text-green-800">
                                            File berhasil dipilih
                                        </p>
                                        <p className="mt-1 break-all text-sm text-gray-700">
                                            {data.manuscript_file.name}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Ukuran: {(data.manuscript_file.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                )}

                                <p className="mt-2 text-xs text-gray-500">
                                    Format PDF, DOC, atau DOCX. Ukuran maksimal
                                    20 MB.
                                </p>
                                {errors.manuscript_file && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.manuscript_file}
                                    </p>
                                )}
                                {progress && (
                                    <div className="mt-3">
                                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                                            <div
                                                className="h-full rounded-full bg-blue-600"
                                                style={{
                                                    width: `${progress.percentage}%`,
                                                }}
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Mengunggah {progress.percentage}%
                                        </p>
                                    </div>
                                )}
                            </div>


                            {/* Dokumen Surat Perjanjian */}
                            <div>
                                <label htmlFor="agreement_file" className={labelClass}>
                                    Surat Perjanjian Penerbitan *
                                </label>

                                <input
                                    id="agreement_file"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(event) =>
                                        setData(
                                            'agreement_file',
                                            event.target.files?.[0] ?? null
                                        )
                                    }
                                    className="mt-2 block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                                    required
                                />

                                <p className="mt-2 text-xs text-gray-500">
                                    Format PDF, DOC, atau DOCX. Ukuran maksimal 20 MB.
                                </p>

                                {data.agreement_file && (
                                    <p className="mt-2 break-all text-sm text-green-700">
                                        File dipilih: {data.agreement_file.name}
                                    </p>
                                )}

                                {errors.agreement_file && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.agreement_file}
                                    </p>
                                )}
                            </div>

                            {/* Dokumen Surat Pernyataan Keaslian */}
                            <div>
                                <label htmlFor="originality_file" className={labelClass}>
                                    Surat Pernyataan Keaslian Naskah *
                                </label>

                                <input
                                    id="originality_file"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(event) =>
                                        setData(
                                            'originality_file',
                                            event.target.files?.[0] ?? null
                                        )
                                    }
                                    className="mt-2 block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                                    required
                                />

                                <p className="mt-2 text-xs text-gray-500">
                                    Format PDF, DOC, atau DOCX. Ukuran maksimal 20 MB.
                                </p>

                                {data.originality_file && (
                                    <p className="mt-2 break-all text-sm text-green-700">
                                        File dipilih: {data.originality_file.name}
                                    </p>
                                )}

                                {errors.originality_file && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.originality_file}
                                    </p>
                                )}
                            </div>


                            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                                <Link
                                    href={route('author.manuscripts.index')}
                                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    Lihat Pengajuan Saya
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Mengirim Naskah...'
                                        : 'Kirim Pengajuan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
