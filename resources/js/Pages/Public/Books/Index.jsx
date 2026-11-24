
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ books, categories = [], filters = {} }) {
    const { auth } = usePage().props;

    // ==========================================
    // STATE
    // ==========================================

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

    // ==========================================
    // NAVIGASI
    // ==========================================

    const closeMenus = () => {
        setMobileMenuOpen(false);
        setProfileMenuOpen(false);
    };

    const homeNavigation = [
        { label: 'Beranda', href: '/#beranda' },
        { label: 'Tentang Kami', href: '/#tentang' },
        { label: 'Katalog Buku', href: '/#katalog' },
        { label: 'Event', href: '/#event' },
        { label: 'Pengajuan Naskah', href: '/#pengajuan' },
        { label: 'Kontak', href: '/#kontak' },
    ];

    // ==========================================
    // FILTER BUKU
    // ==========================================

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

    // ==========================================
    // FORMAT DATA
    // ==========================================

    function formatRupiah(value) {
        if (value === null || value === undefined || value === '') {
            return 'Hubungi penerbit';
        }

        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);
    }

    function formatDate(value) {
        if (!value) return null;

        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(new Date(value));
    }

    function getCoverUrl(cover) {
        if (!cover) return null;

        if (
            cover.startsWith('http://') ||
            cover.startsWith('https://')
        ) {
            return cover;
        }

        if (cover.startsWith('/')) {
            return cover;
        }

        if (cover.startsWith('storage/')) {
            return `/${cover}`;
        }

        return `/storage/${cover}`;
    }

    function getDescription(book) {
        const description = book.subtitle || book.description;

        if (!description) {
            return 'Informasi deskripsi buku belum tersedia.';
        }

        return description.length > 150
            ? `${description.substring(0, 150).trim()}...`
            : description;
    }

    function getAuthors(book) {
        if (!book.authors?.length) {
            return 'Penulis belum tersedia';
        }

        return book.authors
            .map((author) => author.name)
            .join(', ');
    }

    // ==========================================
    // BAGIKAN BUKU
    // ==========================================

    function shareWhatsApp(book) {
        const detailUrl = `${window.location.origin}${route(
            'public.books.show',
            book.slug
        )}`;

        const message =
            `Halo, saya ingin membagikan informasi buku "${book.title}".\n\n` +
            `${detailUrl}`;

        window.open(
            `https://wa.me/?text=${encodeURIComponent(message)}`,
            '_blank',
            'noopener,noreferrer'
        );
    }

    const buttonBase =
        'rounded-full border px-4 py-2 text-sm font-semibold transition duration-200';

    return (
        <>
            <Head title="Katalog Buku | CHIMULIA PRESS" />

            <div className="min-h-screen bg-[#f7f9fc] font-sans text-slate-800">

                {/* =====================================
                    NAVBAR
                ====================================== */}

                <header className="fixed inset-x-0 top-0 z-[100] border-b border-white/10 bg-[#062d59]/95 text-white shadow-lg shadow-blue-950/10 backdrop-blur-md">

                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2.5 sm:px-8">

                        {/* LOGO */}
                        <Link
                            href="/"
                            onClick={closeMenus}
                            className="flex shrink-0 items-center gap-3"
                            aria-label="CHIMULIA PRESS beranda"
                        >
                            <img
                                src="/images/chimulia-white.png"
                                alt="Logo CHIMULIA PRESS"
                                className="h-12 w-auto object-contain sm:h-14"
                            />

                            <div className="hidden border-l border-white/30 pl-3 sm:block">
                                <h3 className="max-w-[230px] text-sm font-bold leading-snug tracking-tight lg:max-w-[280px] lg:text-base">
                                    Center for Cultural Impact in
                                    <span className="block text-amber-300">
                                        Mathematics Learning
                                    </span>
                                </h3>
                            </div>
                        </Link>

                        {/* TOMBOL MOBILE */}
                        <button
                            type="button"
                            onClick={() => {
                                setMobileMenuOpen((prev) => !prev);
                                setProfileMenuOpen(false);
                            }}
                            className="relative z-[110] rounded-lg border border-white/25 px-3 py-2 text-sm transition hover:bg-white/10 md:hidden"
                            aria-expanded={mobileMenuOpen}
                            aria-label="Buka menu navigasi"
                        >
                            {mobileMenuOpen ? 'Tutup ✕' : 'Menu ☰'}
                        </button>

                        {/* MENU NAVIGASI */}
                        <nav
                            className={`
                                ${
                                    mobileMenuOpen
                                        ? 'absolute left-0 right-0 top-full flex max-h-[calc(100vh-75px)] flex-col gap-1 overflow-y-auto border-t border-white/10 bg-[#062d59] px-5 pb-5 shadow-xl'
                                        : 'hidden'
                                }
                                md:static md:flex md:max-h-none md:flex-row md:items-center md:gap-5 md:overflow-visible md:border-0 md:bg-transparent md:p-0 md:shadow-none
                            `}
                        >

                            {/* MENU HALAMAN UTAMA */}
                            {homeNavigation.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={closeMenus}
                                    className="block py-3 text-sm text-blue-100 transition hover:text-amber-300 md:py-2"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            {/* LOGIN / PROFIL */}
                            <div className="flex flex-col gap-2 border-t border-white/10 pt-3 md:flex-row md:items-center md:border-0 md:pt-0">

                                {authUser ? (
                                    <div className="relative">

                                        {/* TOMBOL PROFIL */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setProfileMenuOpen((prev) => !prev)
                                            }
                                            aria-expanded={profileMenuOpen}
                                            aria-label="Menu profil pengguna"
                                            className="flex w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 transition hover:bg-white/20 md:w-auto"
                                        >
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-300 text-sm font-bold uppercase text-[#073875]">
                                                {(authUser.name || 'U').charAt(0)}
                                            </span>

                                            <span className="max-w-32 truncate text-sm font-semibold">
                                                {authUser.name}
                                            </span>

                                            <span className="text-xs">
                                                {profileMenuOpen ? '▲' : '▼'}
                                            </span>
                                        </button>

                                        {/* DROPDOWN PROFIL */}
                                        {profileMenuOpen && (
                                            <div className="absolute left-0 top-full z-[120] mt-3 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-800 shadow-xl md:left-auto md:right-0">

                                                <div className="border-b border-slate-100 px-4 py-4">
                                                    <p className="truncate font-semibold">
                                                        {authUser.name}
                                                    </p>

                                                    <p className="mt-1 truncate text-xs text-slate-500">
                                                        {authUser.email}
                                                    </p>
                                                </div>

                                                <div className="p-2">

                                                    <Link
                                                        href="/profile"
                                                        onClick={closeMenus}
                                                        className="block rounded-lg px-3 py-2.5 text-sm transition hover:bg-blue-50 hover:text-blue-800"
                                                    >
                                                        ⚙ Pengaturan Profil
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            closeMenus();
                                                            router.post('/logout');
                                                        }}
                                                        className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                                    >
                                                        ↪ Logout
                                                    </button>

                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap items-center gap-2">

                                        <Link
                                            href="/login"
                                            onClick={closeMenus}
                                            className="rounded-lg bg-[#FCD34D] px-4 py-2.5 text-center text-xs font-bold text-[#062D59] transition hover:bg-amber-300"
                                        >
                                            Login
                                        </Link>

                                        <Link
                                            href="/register"
                                            onClick={closeMenus}
                                            className="rounded-lg bg-[#FCD34D] px-4 py-2.5 text-center text-xs font-bold text-[#062D59] transition hover:bg-amber-300"
                                        >
                                            Daftar →
                                        </Link>

                                    </div>
                                )}

                            </div>
                        </nav>
                    </div>
                </header>

                {/* =====================================
                    HERO KATALOG
                ====================================== */}

                <section
                    id="beranda"
                    className="relative overflow-hidden bg-white pt-20"
                >
                    <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />

                    <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-amber-50 blur-3xl" />

                    <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">

                        <div className="grid items-center gap-10 lg:grid-cols-2">

                            <div>

                                <div className="flex items-center gap-3">
                                    <span className="h-[2px] w-9 bg-amber-400" />

                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-800">
                                        Koleksi Terbitan
                                    </p>
                                </div>

                                <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-[#0b3a70] sm:text-5xl">
                                    Katalog Buku
                                </h1>

                                <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
                                    Jelajahi koleksi buku akademik, referensi
                                    ilmiah, dan buku pendidikan yang kami
                                    terbitkan untuk mendukung perkembangan
                                    ilmu pengetahuan dan pendidikan.
                                </p>

                                <div className="mt-7 flex flex-wrap gap-3">

                                    <a
                                        href="#daftar-buku"
                                        className="rounded-full bg-[#0b3a70] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-900"
                                    >
                                        Jelajahi Koleksi →
                                    </a>

                                    <Link
                                        href="/#kontak"
                                        className="rounded-full border border-blue-200 bg-white px-7 py-3.5 text-sm font-bold text-[#0b3a70] transition hover:bg-blue-50"
                                    >
                                        Hubungi Kami
                                    </Link>

                                </div>

                                <div className="mt-9 flex flex-wrap gap-8 border-t border-slate-100 pt-6">

                                    <div>
                                        <p className="text-2xl font-extrabold text-[#0b3a70]">
                                            {books?.total ?? 0}+
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Koleksi Buku
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-2xl font-extrabold text-[#0b3a70]">
                                            {categories.length}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Kategori
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-2xl font-extrabold text-[#0b3a70]">
                                            Berkualitas
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Koleksi Terbitan
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* ILUSTRASI KATALOG */}
                            <div className="relative mx-auto w-full max-w-xl">

                                <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-amber-100 blur-2xl" />

                                <div className="relative rounded-3xl border border-slate-100 bg-slate-50 p-5 shadow-xl sm:p-8">

                                    <div className="mb-5 flex items-center justify-between">

                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-blue-800">
                                                CHIMULIA PRESS
                                            </p>

                                            <p className="mt-1 text-lg font-bold text-slate-800">
                                                Temukan Inspirasi
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800">
                                            Book Collection
                                        </span>

                                    </div>

                                    <div className="grid grid-cols-2 gap-4">

                                        {(books?.data ?? [])
                                            .slice(0, 2)
                                            .map((book) => (
                                                <Link
                                                    key={book.id}
                                                    href={route(
                                                        'public.books.show',
                                                        book.slug
                                                    )}
                                                    className="overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                                >

                                                    <div className="flex h-48 items-center justify-center overflow-hidden rounded-lg bg-slate-100">

                                                        {book.cover_image ? (
                                                            <img
                                                                src={getCoverUrl(book.cover_image)}
                                                                alt={book.title}
                                                                className="h-full w-full object-contain"
                                                            />
                                                        ) : (
                                                            <span className="text-4xl text-slate-300">
                                                                ▤
                                                            </span>
                                                        )}

                                                    </div>

                                                    <p className="mt-3 line-clamp-2 text-sm font-bold text-slate-800">
                                                        {book.title}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {getAuthors(book)}
                                                    </p>

                                                </Link>
                                            ))}

                                        {!(books?.data?.length) && (
                                            <div className="col-span-2 rounded-xl bg-white p-10 text-center text-sm text-slate-400">
                                                Koleksi buku akan ditampilkan di sini.
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================
                    DAFTAR BUKU
                ====================================== */}

                <main
                    id="daftar-buku"
                    className="mx-auto max-w-7xl scroll-mt-24 px-5 py-12 sm:px-8 sm:py-16"
                >

                    {/* JUDUL SECTION */}
                    <div className="mb-8">

                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-800">
                            Jelajahi Koleksi
                        </p>

                        <h2 className="mt-2 text-2xl font-extrabold text-[#0b3a70] sm:text-3xl">
                            Temukan Buku Pilihan Anda
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            Temukan berbagai buku pilihan berdasarkan
                            kategori, judul, dan koleksi unggulan
                            CHIMULIA PRESS.
                        </p>

                    </div>

                    {/* FILTER DAN PENCARIAN */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

                        <form
                            onSubmit={submitSearch}
                            className="flex flex-col gap-3 sm:flex-row"
                        >

                            <div className="relative flex-1">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    ⌕
                                </span>

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Cari judul atau nama buku..."
                                    className="w-full rounded-xl border-slate-200 py-3 pl-11 pr-4 text-sm focus:border-blue-700 focus:ring-blue-700"
                                />

                            </div>

                            <button
                                type="submit"
                                className="rounded-xl bg-[#0b3a70] px-7 py-3 text-sm font-bold text-white transition hover:bg-blue-900"
                            >
                                Cari Buku
                            </button>

                            <button
                                type="button"
                                onClick={resetSearch}
                                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                Reset
                            </button>

                        </form>

                        {/* BEST SELLER */}
                        <div className="mt-6">

                            <p className="mb-3 text-sm font-bold text-slate-700">
                                Koleksi Unggulan
                            </p>

                            <button
                                type="button"
                                aria-pressed={bestSeller}
                                onClick={() =>
                                    applyFilters({
                                        bestSeller: !bestSeller,
                                    })
                                }
                                className={`${buttonBase} ${
                                    bestSeller
                                        ? 'border-amber-400 bg-amber-400 text-[#0b3a70]'
                                        : 'border-amber-300 bg-white text-amber-700 hover:bg-amber-50'
                                }`}
                            >
                                ★ Best Seller
                                {bestSeller && ' ✓'}
                            </button>

                        </div>

                        {/* KATEGORI */}
                        <div className="mt-6">

                            <p className="mb-3 text-sm font-bold text-slate-700">
                                Kategori Buku
                            </p>

                            <div className="flex flex-wrap gap-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        applyFilters({ category: '' })
                                    }
                                    className={`${buttonBase} ${
                                        category === ''
                                            ? 'border-[#0b3a70] bg-[#0b3a70] text-white'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-blue-700 hover:text-blue-800'
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
                                                : 'border-slate-200 bg-white text-slate-600 hover:border-blue-700 hover:text-blue-800'
                                        }`}
                                    >
                                        {item.name}
                                    </button>
                                ))}

                            </div>
                        </div>
                    </section>

                    {/* INFORMASI HASIL PENCARIAN */}
                    <div className="mb-7 mt-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

                        <div>

                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-800">
                                Koleksi Terbitan
                            </p>

                            <h2 className="mt-2 text-2xl font-extrabold text-[#0b3a70]">
                                {bestSeller
                                    ? 'Buku Best Seller'
                                    : category
                                      ? 'Buku Pilihan Kategori'
                                      : 'Semua Buku'}
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Menampilkan koleksi buku yang tersedia
                                di CHIMULIA PRESS.
                            </p>

                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">

                            <p className="text-xs text-slate-500">
                                Total koleksi ditemukan
                            </p>

                            <p className="mt-1 text-xl font-extrabold text-[#0b3a70]">
                                {books?.total ?? 0} Buku
                            </p>

                        </div>

                    </div>

                    {/* KARTU BUKU */}
                    {!books?.data?.length ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

                            <div className="text-5xl text-slate-300">
                                ▤
                            </div>

                            <h3 className="mt-4 text-xl font-bold text-slate-800">
                                Buku Tidak Ditemukan
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                Coba gunakan kata kunci atau kategori
                                yang berbeda.
                            </p>

                            <button
                                type="button"
                                onClick={resetSearch}
                                className="mt-6 rounded-xl bg-[#0b3a70] px-6 py-3 text-sm font-bold text-white hover:bg-blue-900"
                            >
                                Tampilkan Semua Buku
                            </button>

                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                            {books.data.map((book) => (
                                <article
                                    key={book.id}
                                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
                                >

                                    {/* SAMPUL BUKU */}
                                    <Link
                                        href={route(
                                            'public.books.show',
                                            book.slug
                                        )}
                                        className="relative block overflow-hidden bg-slate-100"
                                    >

                                        <div className="flex h-[290px] items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 p-5">

                                            {book.cover_image ? (
                                                <img
                                                    src={getCoverUrl(book.cover_image)}
                                                    alt={`Sampul ${book.title}`}
                                                    className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="text-center text-slate-400">
                                                    <span className="block text-5xl">
                                                        ▤
                                                    </span>

                                                    <span className="mt-3 block text-xs">
                                                        Sampul belum tersedia
                                                    </span>
                                                </div>
                                            )}

                                        </div>

                                        {/* STATUS */}
                                        <span
                                            className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${
                                                book.availability_status === 'preorder'
                                                    ? 'bg-amber-200 text-amber-900'
                                                    : 'bg-emerald-100 text-emerald-800'
                                            }`}
                                        >
                                            {book.availability_status === 'preorder'
                                                ? 'Preorder'
                                                : 'Ready'}
                                        </span>

                                        {/* BEST SELLER */}
                                        {book.is_best_seller && (
                                            <span className="absolute right-3 top-3 rounded-full bg-amber-300 px-3 py-1.5 text-xs font-bold text-[#0b3a70] shadow-sm">
                                                ★ Best Seller
                                            </span>
                                        )}

                                    </Link>

                                    {/* INFORMASI BUKU */}
                                    <div className="flex flex-1 flex-col p-5">

                                        {/* KATEGORI */}
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
                                                        className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 transition hover:bg-blue-100"
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

                                        {/* JUDUL */}
                                        <Link
                                            href={route(
                                                'public.books.show',
                                                book.slug
                                            )}
                                            className="mt-4"
                                        >
                                            <h3 className="line-clamp-2 min-h-[52px] text-base font-extrabold leading-6 text-slate-900 transition group-hover:text-blue-800">
                                                {book.title}
                                            </h3>
                                        </Link>

                                        {/* DESKRIPSI */}
                                        <p className="mt-2 line-clamp-3 min-h-[66px] text-sm leading-5 text-slate-500">
                                            {getDescription(book)}
                                        </p>

                                        {/* PENULIS */}
                                        <div className="mt-4">

                                            <div className="flex items-center gap-2">
                                                <span className="text-blue-700">
                                                    ✍
                                                </span>

                                                <span className="text-xs font-semibold text-slate-500">
                                                    Penulis
                                                </span>
                                            </div>

                                            <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-800">
                                                {getAuthors(book)}
                                            </p>

                                        </div>

                                        {/* INFORMASI TAMBAHAN */}
                                        {(book.isbn || book.publisher || book.published_at) && (
                                            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">

                                                {book.isbn && (
                                                    <div className="flex justify-between gap-2 text-xs">
                                                        <span className="text-slate-500">
                                                            ISBN
                                                        </span>

                                                        <span className="text-right font-medium text-slate-700">
                                                            {book.isbn}
                                                        </span>
                                                    </div>
                                                )}

                                                {book.publisher && (
                                                    <div className="flex justify-between gap-2 text-xs">
                                                        <span className="text-slate-500">
                                                            Penerbit
                                                        </span>

                                                        <span className="text-right font-medium text-slate-700">
                                                            {book.publisher}
                                                        </span>
                                                    </div>
                                                )}

                                                {book.published_at && (
                                                    <div className="flex justify-between gap-2 text-xs">
                                                        <span className="text-slate-500">
                                                            Terbit
                                                        </span>

                                                        <span className="text-right font-medium text-slate-700">
                                                            {formatDate(book.published_at)}
                                                        </span>
                                                    </div>
                                                )}

                                            </div>
                                        )}

                                        {/* HARGA DAN PENJUALAN */}
                                        <div className="mt-4 border-t border-slate-100 pt-4">

                                            <p className="text-xs font-medium text-slate-500">
                                                Harga Buku
                                            </p>

                                            <p className="mt-1 text-xl font-extrabold text-[#0b3a70]">
                                                {formatRupiah(book.price)}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {Number(
                                                    book.sold_count ?? 0
                                                ).toLocaleString('id-ID')}{' '}
                                                buku terjual
                                            </p>

                                        </div>

                                        {/* TOMBOL AKSI */}
                                        <div className="mt-auto space-y-2 pt-5">

                                            {book.purchase_url && (
                                                <a
                                                    href={book.purchase_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex w-full items-center justify-center rounded-xl bg-amber-400 px-3 py-3 text-sm font-extrabold text-[#0b3a70] transition hover:bg-amber-300"
                                                >
                                                    Pesan Buku →
                                                </a>
                                            )}

                                            <div className="grid grid-cols-2 gap-2">

                                                <Link
                                                    href={route(
                                                        'public.books.show',
                                                        book.slug
                                                    )}
                                                    className="flex items-center justify-center rounded-xl bg-[#0b3a70] px-2 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-900"
                                                >
                                                    Detail Buku
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        shareWhatsApp(book)
                                                    }
                                                    className="flex items-center justify-center gap-1 rounded-xl border border-emerald-600 px-2 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
                                                >
                                                    Bagikan
                                                </button>

                                            </div>
                                        </div>

                                    </div>
                                </article>
                            ))}

                        </div>
                    )}

                    {/* PAGINATION */}
                    {books?.links?.length > 3 && (
                        <div className="mt-12 flex flex-wrap justify-center gap-2">

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
                                    className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                                        item.active
                                            ? 'border-[#0b3a70] bg-[#0b3a70] text-white'
                                            : 'border-slate-200 bg-white text-slate-700 hover:bg-blue-50'
                                    } disabled:cursor-not-allowed disabled:opacity-50`}
                                    dangerouslySetInnerHTML={{
                                        __html: item.label,
                                    }}
                                />
                            ))}

                        </div>
                    )}

                </main>

                {/* =====================================
                    FOOTER
                ====================================== */}

                <footer className="relative overflow-hidden bg-[#062d59] text-white">

                    {/* DEKORASI BAGIAN ATAS */}
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-300 via-blue-400 to-amber-300" />

                    {/* DEKORASI BACKGROUND */}
                    <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl" />

                    {/* KONTEN UTAMA */}
                    <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 pb-12 pt-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr] lg:gap-14">

                        {/* KOLOM 1: IDENTITAS */}
                        <div className="flex flex-col items-start">
                            <h2 className="mt-6 max-w-md text-2xl font-extrabold leading-snug sm:text-3xl">
                                Center for Cultural Impact in
                                <span className="text-amber-300"> Mathematics Learning</span>
                            </h2>

                            <p className="mt-4 max-w-md text-sm leading-7 text-blue-100">
                                Menghadirkan karya ilmiah, buku akademik, dan publikasi
                                berkualitas untuk mendukung perkembangan ilmu pengetahuan,
                                pendidikan, serta budaya literasi.
                            </p>

                            <p className="mt-5 text-xs font-semibold tracking-wide text-blue-200">
                                Culture
                                <span className="mx-2 text-amber-300">•</span>
                                Innovation
                                <span className="mx-2 text-amber-300">•</span>
                                Mathematics Learning
                            </p>

                            {/* MEDIA SOSIAL */}
                            <div className="mt-6 flex flex-wrap gap-3">

                                <a
                                    href="mailto:chimulia138@gmail.com"
                                    aria-label="Email CHIMULIA"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition duration-300 hover:-translate-y-1 hover:bg-amber-300"
                                >
                                    <img
                                        src="/images/email-icon.svg"
                                        alt=""
                                        className="h-5 w-5 object-contain"
                                    />
                                </a>

                                <a
                                    href="https://www.instagram.com/chimulia23/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram CHIMULIA"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition duration-300 hover:-translate-y-1 hover:bg-amber-300"
                                >
                                    <img
                                        src="/images/instagram-icon.svg"
                                        alt=""
                                        className="h-5 w-5 object-contain"
                                    />
                                </a>

                                <a
                                    href="https://wa.me/6285337185881"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="WhatsApp CHIMULIA"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition duration-300 hover:-translate-y-1 hover:bg-amber-300"
                                >
                                    <img
                                        src="/images/wa-icon.svg"
                                        alt=""
                                        className="h-5 w-5 object-contain"
                                    />
                                </a>

                                <a
                                    href="https://press.chimuliacenter.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Website CHIMULIA PRESS"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition duration-300 hover:-translate-y-1 hover:bg-amber-300"
                                >
                                    <img
                                        src="/images/website-icon.svg"
                                        alt=""
                                        className="h-5 w-5 object-contain"
                                    />
                                </a>

                            </div>
                        </div>

                        {/* KOLOM 2: TAUTAN NAVIGASI */}
                        <div className="border-t border-white/15 pt-7 md:border-t-0 md:pt-0 lg:border-l lg:border-white/15 lg:pl-10">

                            <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-300">
                                Tautan Cepat
                            </h3>

                            <ul className="mt-6 space-y-4">

                                {[
                                    ['Beranda', '/#beranda'],
                                    ['Tentang Kami', '/#tentang'],
                                    ['Katalog Buku', '/#katalog'],
                                    ['Event', '/#event'],
                                    ['Pengajuan Naskah', '/#pengajuan'],
                                    ['Kontak', '/#kontak'],
                                ].map(([label, href]) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            className="group inline-flex items-center gap-2 text-sm text-blue-100 transition duration-200 hover:translate-x-1 hover:text-amber-300"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}

                            </ul>
                        </div>

                        {/* KOLOM 3: INFORMASI KONTAK */}
                        <div className="border-t border-white/15 pt-7 md:border-t-0 md:pt-0 lg:border-l lg:border-white/15 lg:pl-10">

                            <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-300">
                                Hubungi Kami
                            </h3>

                            <p className="mt-5 text-sm leading-6 text-blue-100">
                                Untuk informasi penerbitan, kerja sama, dan pengajuan
                                naskah, silakan hubungi tim CHIMULIA PRESS.
                            </p>

                            <ul className="mt-5 space-y-4 text-sm text-blue-100">

                                {/* ALAMAT */}
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 text-lg text-amber-300">
                                        ⌖
                                    </span>
                                    <span>
                                        Yogyakarta, Indonesia
                                    </span>
                                </li>

                                {/* EMAIL */}
                                <li className="flex items-start gap-3">
                                    <img
                                        src="/images/email-icon.svg"
                                        alt=""
                                        className="mt-0.5 h-5 w-5 object-contain"
                                    />
                                    <a
                                        href="mailto:chimulia138@gmail.com"
                                        className="break-all transition hover:text-amber-300"
                                    >
                                        chimulia138@gmail.com
                                    </a>
                                </li>

                                {/* INSTAGRAM */}
                                <li className="flex items-start gap-3">
                                    <img
                                        src="/images/instagram-icon.svg"
                                        alt=""
                                        className="mt-0.5 h-5 w-5 object-contain"
                                    />
                                    <a
                                        href="https://www.instagram.com/chimulia23/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transition hover:text-amber-300"
                                    >
                                        @chimulia23
                                    </a>
                                </li>

                                {/* WHATSAPP */}
                                <li className="flex items-start gap-3">
                                    <img
                                        src="/images/wa-icon.svg"
                                        alt=""
                                        className="mt-0.5 h-5 w-5 object-contain"
                                    />
                                    <a
                                        href="https://wa.me/6285337185881"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transition hover:text-amber-300"
                                    >
                                        0853-3718-5881
                                    </a>
                                </li>

                                {/* WEBSITE */}
                                <li className="flex items-start gap-3">
                                    <img
                                        src="/images/website-icon.svg"
                                        alt=""
                                        className="mt-0.5 h-5 w-5 object-contain"
                                    />
                                    <a
                                        href="https://press.chimuliacenter.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="break-all transition hover:text-amber-300"
                                    >
                                        press.chimuliacenter.com
                                    </a>
                                </li>

                            </ul>

                            {/* TOMBOL KONTAK */}
                            <a
                                href="mailto:chimulia138@gmail.com"
                                className="mt-7 inline-flex items-center gap-3 rounded-full bg-amber-300 px-6 py-3 text-sm font-bold text-[#062d59] shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:bg-amber-200"
                            >
                                Hubungi Kami
                                <span className="text-lg">→</span>
                            </a>
                        </div>

                    </div>

                    {/* COPYRIGHT */}
                    <div className="relative border-t border-white/15 bg-[#042449]">

                        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 sm:px-8 md:flex-row md:items-center md:justify-between">

                            <p className="text-center text-xs leading-6 text-blue-200 md:text-left">
                                © {new Date().getFullYear()} PT. Center for Cultural Impact
                                in Mathematics Learning. All rights reserved.
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-blue-200">

                                <Link
                                    href="/#kontak"
                                    className="transition hover:text-amber-300"
                                >
                                    Kebijakan Privasi
                                </Link>

                                <span className="text-white/30">|</span>

                                <Link
                                    href="/#kontak"
                                    className="transition hover:text-amber-300"
                                >
                                    Syarat &amp; Ketentuan
                                </Link>

                            </div>

                        </div>
                    </div>

                </footer>


            </div>
        </>
    );
}
