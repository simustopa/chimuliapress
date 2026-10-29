
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        bio: '',
        is_active: true,
    });

    function submit(e) {
        e.preventDefault();
        post(route('admin.authors.store'));
    }

    const inputClass = (field) =>
        `mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
            errors[field]
                ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-50'
                : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-50'
        }`;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <p className="text-sm font-medium text-indigo-600">
                        Administrasi CHIMULIA
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-800">
                        Tambah Author
                    </h2>
                </div>
            }
        >
            <Head title="Tambah Author" />

            <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
                <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div>
                        <Link
                            href={route('admin.authors.index')}
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
                        >
                            <span aria-hidden="true">←</span>
                            Kembali ke daftar author
                        </Link>

                        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                            Tambahkan Author Baru
                        </h1>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Lengkapi informasi penulis untuk menyimpan data ke
                            dalam sistem CHIMULIA.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                                <h3 className="font-bold text-slate-900">
                                    Informasi Author
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Isi informasi utama dan kontak penulis.
                                </p>
                            </div>

                            <div className="space-y-5 p-5 sm:p-7">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Nama penulis <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        autoComplete="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={inputClass('name')}
                                        placeholder="Contoh: Ahmad Fauzi"
                                        required
                                        maxLength={255}
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-rose-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Alamat email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={inputClass('email')}
                                        placeholder="nama@email.com"
                                        maxLength={255}
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-rose-600">
                                            {errors.email}
                                        </p>
                                    )}
                                    <p className="mt-2 text-xs text-slate-400">
                                        Opsional. Isi jika informasi kontak tersedia.
                                    </p>
                                </div>

                                <div>
                                    <label
                                        htmlFor="bio"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Biografi penulis
                                    </label>
                                    <textarea
                                        id="bio"
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        rows={5}
                                        className={inputClass('bio')}
                                        placeholder="Tuliskan profil singkat, bidang keahlian, atau latar belakang penulis..."
                                    />
                                    {errors.bio && (
                                        <p className="mt-2 text-sm text-rose-600">
                                            {errors.bio}
                                        </p>
                                    )}
                                    <p className="mt-2 text-xs text-slate-400">
                                        Opsional. Biografi dapat membantu admin mengenali profil penulis.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                            <h3 className="font-bold text-slate-900">
                                Status Author
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Tentukan apakah author berstatus aktif di sistem.
                            </p>

                            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>
                                    <span className="block text-sm font-semibold text-slate-800">
                                        Author aktif
                                    </span>
                                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                                        Aktifkan jika author masih bekerja sama atau
                                        relevan untuk pengelolaan data penerbit.
                                    </span>
                                </span>
                            </label>

                            {errors.is_active && (
                                <p className="mt-2 text-sm text-rose-600">
                                    {errors.is_active}
                                </p>
                            )}
                        </section>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Link
                                href={route('admin.authors.index')}
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Batal
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Author'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
