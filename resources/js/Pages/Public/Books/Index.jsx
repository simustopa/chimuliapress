import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ books, categories = [], filters = {} }) {
    const { auth } = usePage().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [category, setCategory] = useState(
        filters.category ? String(filters.category) : ''
    );
    const [bestSeller, setBestSeller] = useState(
        String(filters.best_seller ?? '') === '1'
    );
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const authUser = auth?.user ?? null;

    function applyFilters(next = {}) {
        const nextSearch = next.search ?? search;
        const nextCategory = next.category ?? category;
        const nextBestSeller = next.bestSeller ?? bestSeller;

        setSearch(nextSearch);
        setCategory(nextCategory);
        setBestSeller(nextBestSeller);

        router.get(
            route('public.books.index'),
            {
                search: nextSearch || '',
                category: nextCategory || '',
                best_seller: nextBestSeller ? '1' : '',
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    }

    function submitSearch(e) {
        e.preventDefault();
        applyFilters();
    }

    function resetSearch() {
        setSearch('');
        setCategory('');
        setBestSeller(false);

        router.get(
            route('public.books.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    }

    function formatRupiah(value) {
        if (value === null || value === undefined || value === '') {
            return 'Harga belum tersedia';
        }

        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);
    }

    function shareWhatsApp(book) {
        const detailUrl = `${window.location.origin}${route(
            'public.books.show',
            book.slug
        )}`;

        const message = `Halo, saya ingin membagikan informasi buku "${book.title}".\n\n${detailUrl}`;

        window.open(
            `https://wa.me/?text=${encodeURIComponent(message)}`,
            '_blank',
            'noopener,noreferrer'
        );
    }

    function getDescription(book) {
        const description = book.subtitle || book.description;

        if (!description) return 'Belum ada deskripsi buku.';

        return description.length > 100
            ? `${description.substring(0, 100).trim()}...`
            : description;
    }

    const buttonBase =
        'rounded-full border px-4 py-2 text-sm font-semibold transition';

    return (
        <>
            <Head title="Katalog Buku | CHIMULIA PRESS" />

            <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
                {/* HEADER */}
                <header className="sticky top-0 z-50 bg-[#0b3a70] text-white shadow-sm">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3 sm:px-8">
                        <Link
                            href="/"
                            className="flex shrink-0 items-center"
                            aria-label="CHIMULIA PRESS beranda"
                        >
                            <img
                                src="/images/chimulia-white.png"
                                alt="Logo CHIMULIA"
                                className="h-20 w-auto object-contain"
                            />
                        </Link>

                        <button
                            type="button"
                            className="rounded border border-white/30 px-3 py-2 text-sm md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-expanded={mobileMenuOpen}
                            aria-label="Buka menu navigasi"
                        >
                            {mobileMenuOpen ? 'Tutup ✕' : 'Menu ☰'}
                        </button>

                        <nav
                            className={`${
                                mobileMenuOpen
                                    ? 'absolute left-0 right-0 top-full flex flex-col items-stretch gap-0 bg-[#0b3a70] px-5 pb-4 shadow-lg'
                                    : 'hidden'
                            } md:static md:flex md:flex-row md:items-center md:gap-5 md:bg-transparent md:p-0 md:shadow-none`}
                        >
                            <a
                                onClick={() => setMobileMenuOpen(false)}
                                href="/#beranda"
                                className="py-3 text-sm hover:text-amber-200 md:py-2"
                            >
                                Beranda
                            </a>
                            <a
                                onClick={() => setMobileMenuOpen(false)}
                                href="/#tentang"
                                className="py-3 text-sm hover:text-amber-200 md:py-2"
                            >
                                Tentang Kami
                            </a>

                            <div className="group relative">
                                <button
                                    type="button"
                                    className="flex w-full items-center gap-1 py-3 text-left text-sm hover:text-amber-200 md:py-2"
                                >
                                    Katalog Buku <span aria-hidden="true">⌄</span>
                                </button>
                                <div className="left-0 top-full z-50 min-w-52 rounded-lg border border-slate-100 bg-white py-2 text-slate-700 shadow-xl md:absolute md:hidden md:group-hover:block md:group-focus-within:block">
                                    <Link
                                        href={route('public.books.index')}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-800"
                                    >
                                        Semua Buku
                                    </Link>
                                    <a
                                        href="/#mitra"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-800"
                                    >
                                        Mitra
                                    </a>
                                    <a
                                        href="/#kolaborasi"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-800"
                                    >
                                        Peluang Kolaborasi
                                    </a>
                                    <a
                                        href="/#sponsorship"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-800"
                                    >
                                        Sponsorship / Hibah
                                    </a>
                                </div>
                            </div>

                            <a
                                onClick={() => setMobileMenuOpen(false)}
                                href="/#event"
                                className="py-3 text-sm hover:text-amber-200 md:py-2"
                            >
                                Event
                            </a>
                            <a
                                onClick={() => setMobileMenuOpen(false)}
                                href="/#pengajuan"
                                className="py-3 text-sm hover:text-amber-200 md:py-2"
                            >
                                Pengajuan Naskah
                            </a>
                            <a
                                onClick={() => setMobileMenuOpen(false)}
                                href="/#kontak"
                                className="py-3 text-sm hover:text-amber-200 md:py-2"
                            >
                                Kontak
                            </a>

                            <div className="flex items-center gap-3 py-3 md:py-0">
                                {authUser ? (
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setProfileMenuOpen(!profileMenuOpen)
                                            }
                                            aria-expanded={profileMenuOpen}
                                            aria-label="Menu profil pengguna"
                                            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 transition hover:bg-white/20"
                                        >
                                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-200 text-sm font-bold uppercase text-[#0b3a70]">
                                                {(authUser.name || 'U').charAt(0)}
                                            </span>
                                            <span className="max-w-32 truncate text-sm font-semibold text-white">
                                                {authUser.name}
                                            </span>
                                            <span className="text-xs text-blue-100">
                                                {profileMenuOpen ? '▲' : '▼'}
                                            </span>
                                        </button>

                                        {profileMenuOpen && (
                                            <>
                                                <button
                                                    type="button"
                                                    aria-label="Tutup menu profil"
                                                    className="fixed inset-0 z-40 cursor-default"
                                                    onClick={() =>
                                                        setProfileMenuOpen(false)
                                                    }
                                                />
                                                <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-800 shadow-xl">
                                                    <div className="border-b border-slate-100 px-4 py-4">
                                                        <p className="truncate font-semibold text-slate-900">
                                                            {authUser.name}
                                                        </p>
                                                        <p className="mt-1 truncate text-xs text-slate-500">
                                                            {authUser.email}
                                                        </p>
                                                    </div>
                                                    <div className="p-2">
                                                        <Link
                                                            href="/profile"
                                                            onClick={() =>
                                                                setProfileMenuOpen(false)
                                                            }
                                                            className="block rounded-lg px-3 py-2.5 text-sm transition hover:bg-blue-50 hover:text-blue-800"
                                                        >
                                                            ⚙ Pengaturan Profil
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setProfileMenuOpen(false);
                                                                router.post('/logout');
                                                            }}
                                                            className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                                        >
                                                            ↪ Logout
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="rounded-md bg-amber-200 px-5 py-2 text-center text-xs font-semibold text-[#0b3a70] transition hover:bg-amber-100"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="rounded-md bg-blue-500 px-5 py-2 text-center text-xs font-semibold text-white transition hover:bg-blue-400"
                                        >
                                            Daftar →
                                        </Link>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                </header>

                {/* FILTER DAN DAFTAR BUKU */}
                <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-800">
                                Temukan Bacaanmu
                            </p>
                            <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                                Cari Buku Pilihan
                            </h2>
                        </div>

                        <form
                            onSubmit={submitSearch}
                            className="mt-5 flex flex-col gap-3 sm:flex-row"
                        >
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari judul buku..."
                                className="min-w-0 flex-1 rounded-lg border-slate-300 px-4 py-3 text-sm focus:border-blue-700 focus:ring-blue-700"
                            />
                            <button
                                type="submit"
                                className="rounded-lg bg-[#0b3a70] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
                            >
                                Cari Buku
                            </button>
                            <button
                                type="button"
                                onClick={resetSearch}
                                className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Reset
                            </button>
                        </form>

                        <div className="mt-6">
                            <p className="mb-3 text-sm font-semibold text-slate-700">
                                Pilihan buku
                            </p>
                            <button
                                type="button"
                                aria-pressed={bestSeller}
                                onClick={() =>
                                    applyFilters({ bestSeller: !bestSeller })
                                }
                                className={`${buttonBase} ${
                                    bestSeller
                                        ? 'border-sky-200 bg-sky-100 text-[#0b3a70] shadow-sm'
                                        : 'border-sky-200 bg-white text-blue-800 hover:bg-sky-50'
                                }`}
                            >
                                ★ Best Seller
                                {bestSeller && (
                                    <span className="ml-2">✓ Aktif</span>
                                )}
                            </button>
                        </div>

                        <div className="mt-6">
                            <p className="mb-3 text-sm font-semibold text-slate-700">
                                Kategori buku
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => applyFilters({ category: '' })}
                                    className={`${buttonBase} ${
                                        category === ''
                                            ? 'border-[#0b3a70] bg-[#0b3a70] text-white'
                                            : 'border-slate-300 bg-white text-slate-600 hover:border-blue-700 hover:text-blue-800'
                                    }`}
                                >
                                    Semua Kategori
                                </button>

                                {categories.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() =>
                                            applyFilters({
                                                category:
                                                    String(item.id) === category
                                                        ? ''
                                                        : String(item.id),
                                            })
                                        }
                                        className={`${buttonBase} ${
                                            category === String(item.id)
                                                ? 'border-[#0b3a70] bg-[#0b3a70] text-white'
                                                : 'border-slate-300 bg-white text-slate-600 hover:border-blue-700 hover:text-blue-800'
                                        }`}
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    <div className="mb-6 mt-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-800">
                                Koleksi Terbitan
                            </p>
                            <h2 className="mt-2 text-2xl font-bold text-slate-900">
                                {bestSeller
                                    ? 'Buku Best Seller'
                                    : category
                                      ? 'Buku Pilihan Kategori'
                                      : 'Buku Terbitan'}
                            </h2>
                        </div>
                        <p className="text-sm text-slate-500">
                            {books?.total ?? 0} buku ditemukan
                        </p>
                    </div>

                    {!books?.data?.length ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                            <div className="text-4xl text-slate-300">▤</div>
                            <h3 className="mt-4 text-lg font-bold text-slate-800">
                                Buku tidak ditemukan
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Coba kata kunci atau kategori lain, atau
                                nonaktifkan filter Best Seller.
                            </p>
                            <button
                                type="button"
                                onClick={resetSearch}
                                className="mt-5 rounded-lg bg-[#0b3a70] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-900"
                            >
                                Tampilkan Semua Buku
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {books.data.map((book) => (
                                <article
                                    key={book.id}
                                    className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                                >
                                    <Link
                                        href={route('public.books.show', book.slug)}
                                        className="relative block bg-slate-100"
                                    >
                                        <div className="flex h-[300px] items-center justify-center overflow-hidden p-3 sm:h-[320px]">
                                            {book.cover_image ? (
                                                <img
                                                    src={`/storage/${book.cover_image}`}
                                                    alt={`Sampul ${book.title}`}
                                                    className="h-full w-full object-contain"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="text-center text-sm text-slate-400">
                                                    <span className="block text-4xl">▤</span>
                                                    Sampul belum tersedia
                                                </div>
                                            )}
                                        </div>

                                        <span
                                            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                                                book.availability_status === 'preorder'
                                                    ? 'bg-amber-200 text-amber-900'
                                                    : 'bg-emerald-100 text-emerald-800'
                                            }`}
                                        >
                                            {book.availability_status === 'preorder'
                                                ? 'Preorder'
                                                : 'Ready'}
                                        </span>

                                        {book.is_best_seller && (
                                            <span className="absolute right-3 top-3 rounded-full bg-amber-200 px-3 py-1 text-xs font-bold text-[#0b3a70] shadow-sm">
                                                ★ Best Seller
                                            </span>
                                        )}
                                    </Link>

                                    <div className="flex flex-1 flex-col p-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {book.categories?.length > 0 ? (
                                                book.categories.map((item) => (
                                                    <button
                                                        key={item.id}
                                                        type="button"
                                                        onClick={() =>
                                                            applyFilters({
                                                                category: String(item.id),
                                                            })
                                                        }
                                                        className="rounded-full bg-blue-50 px-3 py-1 text-left text-xs font-medium text-blue-800 transition hover:bg-blue-100"
                                                    >
                                                        {item.name}
                                                    </button>
                                                ))
                                            ) : (
                                                <span className="text-xs text-slate-400">
                                                    Kategori belum tersedia
                                                </span>
                                            )}
                                        </div>

                                        <Link
                                            href={route('public.books.show', book.slug)}
                                            className="mt-4"
                                        >
                                            <h3 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-slate-900 transition hover:text-blue-800">
                                                {book.title}
                                            </h3>
                                        </Link>

                                        <p className="mt-2 line-clamp-3 min-h-[60px] text-sm leading-5 text-slate-500">
                                            {getDescription(book)}
                                        </p>

                                        <div className="mt-3">
                                            <p className="text-xs text-slate-500">Penulis</p>
                                            <p className="line-clamp-1 text-sm font-medium text-slate-800">
                                                {book.authors?.length
                                                    ? book.authors
                                                          .map((author) => author.name)
                                                          .join(', ')
                                                    : 'Penulis belum tersedia'}
                                            </p>
                                        </div>

                                        <div className="mt-4 border-t border-slate-100 pt-3">
                                            <p className="text-lg font-bold text-blue-800">
                                                {formatRupiah(book.price)}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {Number(book.sold_count ?? 0).toLocaleString('id-ID')}{' '}
                                                buku terjual
                                            </p>
                                        </div>

                                        <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                                            <Link
                                                href={route('public.books.show', book.slug)}
                                                className="flex items-center justify-center rounded-lg bg-[#0b3a70] px-2 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-900"
                                            >
                                                Detail Buku
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => shareWhatsApp(book)}
                                                className="flex items-center justify-center gap-1 rounded-lg border border-emerald-600 px-2 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="h-4 w-4 shrink-0"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M12.04 2a9.91 9.91 0 0 0-8.46 15.08L2.5 22l5.08-1.33A10 10 0 1 0 12.04 2Zm0 18.18a8.17 8.17 0 0 1-4.17-1.14l-.3-.18-3.02.79.81-2.94-.2-.31a8.16 8.16 0 1 1 6.88 3.78Zm4.48-6.12c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.21-1.43-1.35-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.09 3.62.57.25 1.01.4 1.36.51.57.18 1.09.15 1.5.09.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                                                </svg>
                                                Bagikan
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {books?.links?.length > 3 && (
                        <div className="mt-10 flex flex-wrap justify-center gap-2">
                            {books.links.map((item, index) => (
                                <button
                                    key={`${item.label}-${index}`}
                                    type="button"
                                    disabled={!item.url || item.active}
                                    onClick={() =>
                                        item.url &&
                                        router.visit(item.url, {
                                            preserveScroll: true,
                                        })
                                    }
                                    className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
                                        item.active
                                            ? 'border-[#0b3a70] bg-[#0b3a70] text-white'
                                            : 'border-slate-300 bg-white text-slate-700 hover:bg-blue-50'
                                    } disabled:cursor-not-allowed disabled:opacity-50`}
                                    dangerouslySetInnerHTML={{ __html: item.label }}
                                />
                            ))}
                        </div>
                    )}
                </main>

                <footer className="mt-10 bg-[#06294f] text-blue-100">
                    <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
                        <span className="font-semibold tracking-wide">CHIMULIA PRESS</span>
                        <span>Culture • Innovation • Mathematics Learning</span>
                        <span>
                            © {new Date().getFullYear()} CHIMULIA PRESS. Hak cipta dilindungi.
                        </span>
                    </div>
                </footer>
            </div>
        </>
    );
}
