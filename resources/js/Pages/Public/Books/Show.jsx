import { Head, Link } from '@inertiajs/react';

export default function Show({ book, bookingFormUrl }) {
    return (
        <>
            <Head title={book.title} />

            <div className="min-h-screen bg-gray-50">
                <header className="border-b bg-white">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                        <Link
                            href="/"
                            className="text-xl font-bold text-indigo-700"
                        >
                            Penerbit Buku
                        </Link>

                        <Link
                            href={route('public.books.index')}
                            className="text-sm font-medium text-gray-600 hover:text-indigo-700"
                        >
                            Kembali ke Katalog
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-6 py-10">
                    <Link
                        href={route('public.books.index')}
                        className="text-sm font-medium text-indigo-700 hover:underline"
                    >
                        ← Kembali ke Katalog Buku
                    </Link>

                    <div className="mt-6 grid gap-10 md:grid-cols-[300px_1fr]">
                        <div className="mx-auto w-full max-w-xs">
                            <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl border bg-indigo-50 shadow-sm">
                                {book.cover_image ? (
                                    <img
                                        src={`/storage/${book.cover_image}`}
                                        alt={`Sampul ${book.title}`}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="p-6 text-center">
                                        <div className="text-5xl text-indigo-300">▤</div>
                                        <p className="mt-4 font-semibold text-indigo-700">
                                            {book.title}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex flex-wrap gap-2">
                                {book.categories?.map((category) => (
                                    <span
                                        key={category.id}
                                        className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700"
                                    >
                                        {category.name}
                                    </span>
                                ))}
                            </div>

                            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                {book.title}
                            </h1>

                            {book.subtitle && (
                                <p className="mt-2 text-lg text-gray-500">
                                    {book.subtitle}
                                </p>
                            )}

                            <div className="mt-6 border-y py-5">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-gray-500">Penulis</p>
                                        <p className="mt-1 font-medium text-gray-900">
                                            {book.authors?.length
                                                ? book.authors.map((author) => author.name).join(', ')
                                                : 'Belum dicantumkan'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Tanggal Terbit</p>
                                        <p className="mt-1 font-medium text-gray-900">
                                            {book.published_at
                                                ? String(book.published_at).slice(0, 10)
                                                : 'Belum dicantumkan'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <section className="mt-7">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Tentang Buku
                                </h2>

                                <div className="mt-3 whitespace-pre-line leading-7 text-gray-600">
                                    {book.description || 'Deskripsi buku belum tersedia.'}
                                </div>
                            </section>

                            {book.authors?.length > 0 && (
                                <section className="mt-8">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Tentang Penulis
                                    </h2>

                                    <div className="mt-4 space-y-4">
                                        {book.authors.map((author) => (
                                            <div
                                                key={author.id}
                                                className="rounded-lg border bg-white p-4"
                                            >
                                                <h3 className="font-semibold text-gray-900">
                                                    {author.name}
                                                </h3>

                                                {author.bio && (
                                                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                                                        {author.bio}
                                                    </p>
                                                )}

                                                {author.email && (
                                                    <p className="mt-2 text-sm text-gray-500">
                                                        Email: {author.email}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Tombol pemesanan buku */}
                            {bookingFormUrl && (
                                <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Tertarik dengan buku ini?
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-gray-600">
                                        Klik tombol di bawah untuk mengisi formulir pemesanan buku.
                                    </p>

                                    <a
                                        href={bookingFormUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M8 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                                            <path d="M16 2v5h5" />
                                            <path d="M8 13h8" />
                                            <path d="M8 17h8" />
                                        </svg>
                                        Pesan Buku
                                    </a>

                                    <p className="mt-3 text-xs text-gray-500">
                                        Formulir pemesanan akan dibuka melalui Google Forms.
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>
                </main>

                <footer className="mt-12 border-t bg-white">
                    <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} Penerbit Buku. Semua hak dilindungi.
                    </div>
                </footer>
            </div>
        </>
    );
}
