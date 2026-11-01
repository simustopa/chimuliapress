
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function DocumentationForm({ documentation = null }) {
    const isEdit = Boolean(documentation);
    const fileInput = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        title: documentation?.title ?? '',
        description: documentation?.description ?? '',
        type: documentation?.type ?? 'photo',
        file: null,
        is_active: documentation?.is_active ?? true,
        sort_order: documentation?.sort_order ?? 0,
        ...(isEdit ? { _method: 'put' } : {}),
    });

    const inputClass =
        'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10';

    const currentFileUrl = documentation?.file_path
        ? `/storage/${documentation.file_path}`
        : null;

    const typeChanged =
        isEdit && data.type !== documentation.type;

    function handleTypeChange(value) {
        setData((current) => ({
            ...current,
            type: value,
            file: null,
        }));

        if (fileInput.current) {
            fileInput.current.value = '';
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (isEdit) {
            post(route('admin.documentations.update', documentation.id), {
                forceFormData: true,
            });
        } else {
            post(route('admin.documentations.store'), {
                forceFormData: true,
            });
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg font-semibold text-slate-800">
                    {isEdit ? 'Edit Dokumentasi' : 'Tambah Dokumentasi'}
                </h2>
            }
        >
            <Head
                title={
                    isEdit ? 'Edit Dokumentasi' : 'Tambah Dokumentasi'
                }
            />

            <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <Link
                        href={route('admin.documentations.index')}
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
                    >
                        <span aria-hidden="true">←</span>
                        Kembali ke dokumentasi
                    </Link>

                    <div className="mb-6 mt-5">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            {isEdit
                                ? 'Perbarui Dokumentasi'
                                : 'Dokumentasi Baru'}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {isEdit
                                ? 'Perbarui informasi atau ganti file dokumentasi kegiatan.'
                                : 'Tambahkan foto atau video kegiatan CHIMULIA.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                            <div className="mb-6 border-b border-slate-100 pb-4">
                                <h2 className="font-semibold text-slate-900">
                                    Informasi Dokumentasi
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Masukkan judul, deskripsi, dan jenis
                                    dokumentasi.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="title"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Judul Dokumentasi
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        className={inputClass}
                                        placeholder="Contoh: Peluncuran Buku CHIMULIA"
                                        maxLength={255}
                                        required
                                    />
                                    {errors.title && (
                                        <FieldError>{errors.title}</FieldError>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Deskripsi
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={4}
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                        placeholder="Tuliskan keterangan kegiatan (opsional)..."
                                    />
                                    {errors.description && (
                                        <FieldError>
                                            {errors.description}
                                        </FieldError>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="type"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        Jenis Dokumentasi
                                    </label>
                                    <select
                                        id="type"
                                        value={data.type}
                                        onChange={(e) =>
                                            handleTypeChange(e.target.value)
                                        }
                                        className={inputClass}
                                    >
                                        <option value="photo">Foto</option>
                                        <option value="video">Video</option>
                                    </select>
                                    {errors.type && (
                                        <FieldError>{errors.type}</FieldError>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                            <div className="mb-6 border-b border-slate-100 pb-4">
                                <h2 className="font-semibold text-slate-900">
                                    File Dokumentasi
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Unggah file foto atau video kegiatan.
                                </p>
                            </div>

                            {isEdit && currentFileUrl && !typeChanged && (
                                <div className="mb-5">
                                    <p className="mb-2 text-sm font-semibold text-slate-700">
                                        File Saat Ini
                                    </p>

                                    {documentation.type === 'photo' ? (
                                        <img
                                            src={currentFileUrl}
                                            alt={documentation.title}
                                            className="max-h-72 w-full rounded-xl border border-slate-200 bg-slate-50 object-contain"
                                        />
                                    ) : (
                                        <video
                                            src={currentFileUrl}
                                            controls
                                            preload="metadata"
                                            className="max-h-72 w-full rounded-xl border border-slate-200 bg-black"
                                        >
                                            Browser tidak mendukung pemutaran
                                            video.
                                        </video>
                                    )}
                                </div>
                            )}

                            {typeChanged && (
                                <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                    Jenis dokumentasi berubah. Silakan unggah
                                    file baru yang sesuai dengan jenis yang
                                    dipilih.
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor="file"
                                    className="text-sm font-semibold text-slate-700"
                                >
                                    {isEdit ? 'Ganti File' : 'Pilih File'}
                                    {!isEdit || typeChanged ? (
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    ) : null}
                                </label>

                                <input
                                    ref={fileInput}
                                    id="file"
                                    type="file"
                                    accept={
                                        data.type === 'photo'
                                            ? 'image/jpeg,image/png,image/webp'
                                            : 'video/mp4,video/webm,video/ogg'
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'file',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                    required={!isEdit || typeChanged}
                                    className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                                />

                                <p className="mt-2 text-xs leading-5 text-slate-500">
                                    {data.type === 'photo'
                                        ? 'Format: JPG, JPEG, PNG, atau WebP.'
                                        : 'Format: MP4, WebM, atau OGG.'}
                                    {' '}Ukuran maksimal 50 MB.
                                    {isEdit && !typeChanged
                                        ? ' Kosongkan jika tidak ingin mengganti file.'
                                        : ''}
                                </p>

                                {data.file && (
                                    <p className="mt-2 text-sm text-indigo-700">
                                        File dipilih: {data.file.name}
                                    </p>
                                )}

                                {errors.file && (
                                    <FieldError>{errors.file}</FieldError>
                                )}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                            <h2 className="font-semibold text-slate-900">
                                Pengaturan Tampilan
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Atur posisi dan status dokumentasi di halaman
                                publik.
                            </p>

                            <div className="mt-5">
                                <label
                                    htmlFor="sort_order"
                                    className="text-sm font-semibold text-slate-700"
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
                                    className={inputClass}
                                    required
                                />
                                <p className="mt-2 text-xs text-slate-400">
                                    Angka lebih kecil akan ditampilkan lebih
                                    dahulu.
                                </p>
                                {errors.sort_order && (
                                    <FieldError>
                                        {errors.sort_order}
                                    </FieldError>
                                )}
                            </div>

                            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData('is_active', e.target.checked)
                                    }
                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>
                                    <span className="block text-sm font-semibold text-slate-800">
                                        Dokumentasi aktif
                                    </span>
                                    <span className="mt-1 block text-sm text-slate-500">
                                        Dokumentasi dapat ditampilkan pada
                                        halaman publik.
                                    </span>
                                </span>
                            </label>

                            {errors.is_active && (
                                <FieldError>{errors.is_active}</FieldError>
                            )}
                        </section>

                        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                            <Link
                                href={route('admin.documentations.index')}
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Batal
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing
                                    ? 'Menyimpan...'
                                    : isEdit
                                      ? 'Simpan Perubahan'
                                      : 'Simpan Dokumentasi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function FieldError({ children }) {
    return (
        <p className="mt-2 text-sm text-red-600">
            {children}
        </p>
    );
}
