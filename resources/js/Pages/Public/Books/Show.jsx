
import { Head, Link } from '@inertiajs/react';

export default function Show({ book, bookingFormUrl }) {
    return (
        <>
            <Head title={`${book.title} | CHIMULIA PRESS`} />

            <div className="min-h-screen bg-slate-50 text-slate-900">
                {/* Header CHIMULIA */}
                <header className="border-b border-white/10 bg-[#0b3a70] text-white">
                    <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-5 px-5 py-3 sm:px-8">
                        <Link
                            href="/"
                            className="flex shrink-0 items-center"
                            aria-label="CHIMULIA PRESS beranda"
                        >
                            <img
                                src="/images/chimulia-white.png"
                                alt="Logo CHIMULIA"
                                className="h-12 w-auto object-contain sm:h-14"
                            />
                        </Link>

                        <Link
                            href={route('public.books.index')}
                            className="rounded-lg border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            ← Kembali ke Katalog
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
                    {/* Breadcrumb */}
                    <nav className="mb-7 text-sm text-slate-500">
                        <Link
                            href="/"
                            className="transition hover:text-blue-700"
                        >
                            Beranda
                        </Link>
                        <span className="mx-2">/</span>
                        <Link
                            href={route('public.books.index')}
                            className="transition hover:text-blue-700"
                        >
                            Katalog Buku
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="font-medium text-[#0b3a70]">
                            Detail Buku
                        </span>
                    </nav>

                    <div className="grid items-start gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-12">
                        {/* Sampul buku */}
                        <aside className="mx-auto w-full max-w-sm lg:mx-0">
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl bg-blue-50">
                                    {book.cover_image ? (
                                        <img
                                            src={`/storage/${book.cover_image}`}
                                            alt={`Sampul ${book.title}`}
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <div className="p-6 text-center">
                                            <div className="text-6xl text-blue-300">
                                                ▤
                                            </div>
                                            <p className="mt-4 font-bold text-[#0b3a70]">
                                                {book.title}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="px-3 pb-2 pt-4 text-center">
                                    <p className="text-xs font-semibold tracking-[0.18em] text-blue-700">
                                        CHIMULIA PRESS
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Buku Akademik & Referensi Ilmiah
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                                <p className="text-sm font-semibold text-[#0b3a70]">
                                    Jelajahi karya akademik
                                </p>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Temukan buku dan referensi untuk mendukung
                                    kegiatan belajar, mengajar, dan penelitian.
                                </p>
                                <Link
                                    href={route('public.books.index')}
                                    className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
                                >
                                    Lihat katalog lainnya →
                                </Link>
                            </div>
                        </aside>

                        {/* Informasi buku */}
                        <article className="min-w-0">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                                <div className="flex flex-wrap gap-2">
                                    {book.categories?.map((category) => (
                                        <span
                                            key={category.id}
                                            className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800 ring-1 ring-inset ring-blue-100"
                                        >
                                            {category.name}
                                        </span>
                                    ))}
                                </div>

                                <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#0b3a70] sm:text-4xl">
                                    {book.title}
                                </h1>

                                {book.subtitle && (
                                    <p className="mt-3 text-lg leading-7 text-slate-500">
                                        {book.subtitle}
                                    </p>
                                )}

                                <div className="my-7 grid gap-5 border-y border-slate-200 py-5 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Penulis
                                        </p>
                                        <p className="mt-1 font-semibold leading-6 text-slate-900">
                                            {book.authors?.length
                                                ? book.authors
                                                      .map((author) => author.name)
                                                      .join(', ')
                                                : 'Belum dicantumkan'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Tanggal Terbit
                                        </p>
                                        <p className="mt-1 font-semibold text-slate-900">
                                            {book.published_at
                                                ? String(book.published_at).slice(0, 10)
                                                : 'Belum dicantumkan'}
                                        </p>
                                    </div>
                                </div>

                                <section>
                                    <h2 className="text-xl font-bold text-[#0b3a70]">
                                        Tentang Buku
                                    </h2>
                                    <div className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                                        {book.description ||
                                            'Deskripsi buku belum tersedia.'}
                                    </div>
                                </section>

                                {book.authors?.length > 0 && (
                                    <section className="mt-8">
                                        <h2 className="text-xl font-bold text-[#0b3a70]">
                                            Tentang Penulis
                                        </h2>

                                        <div className="mt-4 space-y-3">
                                            {book.authors.map((author) => (
                                                <div
                                                    key={author.id}
                                                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                                >
                                                    <h3 className="font-semibold text-slate-900">
                                                        {author.name}
                                                    </h3>

                                                    {author.bio && (
                                                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                                                            {author.bio}
                                                        </p>
                                                    )}

                                                    {author.email && (
                                                        <p className="mt-3 break-words text-sm text-slate-500">
                                                            Email: {author.email}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Pemesanan buku */}
                                {bookingFormUrl && (
                                    <section className="mt-8 rounded-xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0b3a70] text-white">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="21"
                                                    height="21"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M8 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                                                    <path d="M16 2v5h5" />
                                                    <path d="M8 13h8" />
                                                    <path d="M8 17h8" />
                                                </svg>
                                            </div>

                                            <div className="min-w-0">
                                                <h2 className="text-lg font-bold text-[#0b3a70]">
                                                    Tertarik dengan buku ini?
                                                </h2>
                                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                                    Isi formulir pemesanan untuk
                                                    melanjutkan proses pemesanan
                                                    buku ini.
                                                </p>
                                            </div>
                                        </div>

                                        <a
                                            href={bookingFormUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0b3a70] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                                        >
                                            Pesan Buku
                                            <span aria-hidden="true">→</span>
                                        </a>

                                        <p className="mt-3 text-xs leading-5 text-slate-500">
                                            Formulir pemesanan akan dibuka melalui
                                            Google Forms di tab baru.
                                        </p>
                                    </section>
                                )}
                            </div>
                        </article>
                    </div>
                </main>

                {/* Footer */}
                <footer className="mt-8 border-t border-white/10 bg-[#0b3a70] text-white">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-center sm:flex-row sm:px-8 sm:text-left">
                        <div>
                            <p className="text-sm font-semibold">
                                CHIMULIA PRESS
                            </p>
                            <p className="mt-1 text-xs text-blue-100">
                                Center for Cultural Impact in Mathematics Learning
                            </p>
                        </div>

                        <p className="text-xs text-blue-100">
                            © {new Date().getFullYear()} CHIMULIA. Semua hak
                            dilindungi.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
