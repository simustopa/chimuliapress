import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function DocumentLinks({ documents }) {
    const { flash } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        documents: {
            surat_perjanjian: {
                url: documents?.surat_perjanjian?.url ?? '',
            },
            surat_keaslian: {
                url: documents?.surat_keaslian?.url ?? '',
            },
            book_order_form: {
            url: documents?.book_order_form?.url ?? '',
        },
        },
    });

    const updateUrl = (key, value) => {
        setData('documents', {
            ...data.documents,
            [key]: {
                ...data.documents[key],
                url: value,
            },
        });
    };

    const submit = (e) => {
        e.preventDefault();

        put(route('admin.document-links.update'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Pengaturan Tautan Dokumen
                </h2>
            }
        >
            <Head title="Pengaturan Tautan Dokumen" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <Link
                            href={route('admin.dashboard')}
                            className="text-sm text-indigo-600 hover:underline"
                        >
                            &larr; Kembali ke Dashboard
                        </Link>

                        <h3 className="mt-4 text-lg font-semibold text-gray-900">
                            Kelola Dokumen Publikasi
                        </h3>

                        <p className="mt-2 text-sm text-gray-600">
                            Masukkan tautan Google Drive atau Google Docs
                            untuk setiap dokumen. Perubahan akan ditampilkan
                            pada dashboard Author setelah disimpan.
                        </p>

                        {flash?.success && (
                            <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
                                {flash.success}
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-6 space-y-6">
                            <div>
                                <label
                                    htmlFor="surat_perjanjian"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Surat Perjanjian
                                </label>

                                <input
                                    id="surat_perjanjian"
                                    type="url"
                                    value={data.documents.surat_perjanjian.url}
                                    onChange={(e) =>
                                        updateUrl(
                                            'surat_perjanjian',
                                            e.target.value
                                        )
                                    }
                                    placeholder="https://drive.google.com/..."
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />

                                {errors['documents.surat_perjanjian.url'] && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors['documents.surat_perjanjian.url']}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="surat_keaslian"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Surat Pernyataan Keaslian
                                </label>

                                <input
                                    id="surat_keaslian"
                                    type="url"
                                    value={data.documents.surat_keaslian.url}
                                    onChange={(e) =>
                                        updateUrl(
                                            'surat_keaslian',
                                            e.target.value
                                        )
                                    }
                                    placeholder="https://drive.google.com/..."
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />

                                {errors['documents.surat_keaslian.url'] && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors['documents.surat_keaslian.url']}
                                    </p>
                                )}
                            </div>

                            <div>

                            <label
                                htmlFor="book_order_form"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Form Pemesanan Buku (Google Forms)
                            </label>

                            <input
                                id="book_order_form"
                                type="url"
                                value={data.documents.book_order_form.url}
                                onChange={(e) =>
                                    updateUrl('book_order_form', e.target.value)
                                }
                                placeholder="https://docs.google.com/forms/..."
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />

                            {errors['documents.book_order_form.url'] && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors['documents.book_order_form.url']}
                                </p>
                            )}
                        </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Perubahan'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
