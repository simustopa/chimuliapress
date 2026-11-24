
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ book }) {
    // State navigasi
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    // Data pengguna yang sedang login
    const { auth } = usePage().props;
    const authUser = auth?.user ?? null;

    // Format harga rupiah
    const formatRupiah = (value) => {
        if (value === null || value === undefined || value === '') {
            return 'Harga belum tersedia';
        }

        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Format tanggal
    const formatDate = (date) => {
        if (!date) return 'Belum dicantumkan';

        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Bagikan informasi buku melalui WhatsApp
    const shareWhatsApp = () => {
        const url = window.location.href;

        const message = `Halo, saya ingin membagikan informasi buku "${book.title}" dari CHIMULIA PRESS.\n\n${url}`;

        window.open(
            `https://wa.me/?text=${encodeURIComponent(message)}`,
            '_blank',
            'noopener,noreferrer'
        );
    };

    // Logout pengguna
    const handleLogout = () => {
        setProfileMenuOpen(false);
        router.post('/logout');
    };

    const authors = book.authors ?? [];
    const categories = book.categories ?? [];

    // Link navigasi menuju bagian halaman utama
    const homeLink = (section = '') =>
        section ? `/#${section}` : '/';

    return (
        <>
            <Head title={`${book.title} | CHIMULIA PRESS`} />

            <div className="min-h-screen bg-slate-50 text-slate-800">

                {/* ================= NAVBAR ================= */}
                <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#062d59]/95 text-white shadow-lg shadow-blue-950/10 backdrop-blur-md">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2.5 sm:px-8">

                        {/* LOGO */}
                        <Link
                            href="/"
                            className="flex shrink-0 items-center gap-3"
                            aria-label="CHIMULIA PRESS beranda"
                            onClick={() => setMobileMenuOpen(false)}
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

                        {/* TOMBOL MENU MOBILE */}
                        <button
                            type="button"
                            className="rounded-lg border border-white/25 px-3 py-2 text-sm md:hidden"
                            onClick={() =>
                                setMobileMenuOpen(!mobileMenuOpen)
                            }
                            aria-expanded={mobileMenuOpen}
                            aria-label="Buka menu navigasi"
                        >
                            {mobileMenuOpen ? 'Tutup ✕' : 'Menu ☰'}
                        </button>

                        {/* MENU NAVIGASI */}
                        <nav
                            className={`${
                                mobileMenuOpen
                                    ? 'absolute left-0 right-0 top-full flex flex-col gap-1 border-t border-white/10 bg-[#062d59] px-5 pb-5 shadow-xl'
                                    : 'hidden'
                            } md:static md:flex md:flex-row md:items-center md:gap-5 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
                        >
                            <Link
                                href={homeLink('beranda')}
                                onClick={() => setMobileMenuOpen(false)}
                                className="py-3 text-sm text-blue-100 transition hover:text-amber-300 md:py-2"
                            >
                                Beranda
                            </Link>

                            <Link
                                href={homeLink('tentang')}
                                onClick={() => setMobileMenuOpen(false)}
                                className="py-3 text-sm text-blue-100 transition hover:text-amber-300 md:py-2"
                            >
                                Tentang Kami
                            </Link>

                            <Link
                                href={homeLink('katalog')}
                                onClick={() => setMobileMenuOpen(false)}
                                className="py-3 text-sm text-blue-100 transition hover:text-amber-300 md:py-2"
                            >
                                Katalog Buku
                            </Link>

                            <Link
                                href={homeLink('event')}
                                onClick={() => setMobileMenuOpen(false)}
                                className="py-3 text-sm text-blue-100 transition hover:text-amber-300 md:py-2"
                            >
                                Event
                            </Link>

                            <Link
                                href={homeLink('pengajuan')}
                                onClick={() => setMobileMenuOpen(false)}
                                className="py-3 text-sm text-blue-100 transition hover:text-amber-300 md:py-2"
                            >
                                Pengajuan Naskah
                            </Link>

                            <Link
                                href={homeLink('kontak')}
                                onClick={() => setMobileMenuOpen(false)}
                                className="py-3 text-sm text-blue-100 transition hover:text-amber-300 md:py-2"
                            >
                                Kontak
                            </Link>

                            {/* AUTENTIKASI */}
                            <div className="flex items-center gap-2 py-3 md:py-0">

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
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-300 text-sm font-bold uppercase text-[#073875]">
                                                {(authUser.name || 'U').charAt(0)}
                                            </span>

                                            <span className="max-w-32 truncate text-sm font-semibold">
                                                {authUser.name}
                                            </span>

                                            <span className="text-xs">
                                                {profileMenuOpen ? '▲' : '▼'}
                                            </span>
                                        </button>

                                        {profileMenuOpen && (
                                            <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-800 shadow-xl">

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
                                                        onClick={() =>
                                                            setProfileMenuOpen(false)
                                                        }
                                                        className="block rounded-lg px-3 py-2.5 text-sm transition hover:bg-blue-50 hover:text-blue-800"
                                                    >
                                                        ⚙ Pengaturan Profil
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={handleLogout}
                                                        className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                                    >
                                                        ↪ Logout
                                                    </button>

                                                </div>
                                            </div>
                                        )}

                                    </div>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className="rounded-lg bg-[#FCD34D] px-4 py-2.5 text-xs font-bold text-[#062D59] transition hover:bg-amber-300"
                                        >
                                            Login
                                        </Link>

                                        <Link
                                            href="/register"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className="rounded-lg bg-[#FCD34D] px-4 py-2.5 text-xs font-bold text-[#062D59] transition hover:bg-amber-300"
                                        >
                                            Daftar <span aria-hidden="true">→</span>
                                        </Link>
                                    </>
                                )}

                            </div>
                        </nav>
                    </div>
                </header>

                {/* ================= KONTEN UTAMA ================= */}
                <main className="mx-auto max-w-7xl px-5 pb-12 pt-28 sm:px-8 sm:pt-32">

                    {/* BREADCRUMB */}
                    <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm">

                        <Link
                            href="/"
                            className="hover:text-blue-800"
                        >
                            Beranda
                        </Link>

                        <span>/</span>

                        <Link
                            href={route('public.books.index')}
                            className="hover:text-blue-800"
                        >
                            Katalog Buku
                        </Link>

                        <span>/</span>

                        <span className="font-semibold text-[#0b3a70]">
                            Detail Buku
                        </span>

                    </nav>

                    {/* ================= INFORMASI UTAMA ================= */}
                    <section className="grid items-start gap-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-12">

                        {/* SAMPUL BUKU */}
                        <aside className="mx-auto w-full max-w-sm lg:mx-0">

                            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                                {book.is_best_seller && (
                                    <span className="absolute left-6 top-6 z-10 rounded-full bg-amber-300 px-4 py-2 text-xs font-bold text-[#0b3a70] shadow">
                                        ★ BEST SELLER
                                    </span>
                                )}

                                <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl bg-slate-100">

                                    {book.cover_image ? (
                                        <img
                                            src={`/storage/${book.cover_image}`}
                                            alt={`Sampul ${book.title}`}
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <div className="px-6 text-center">

                                            <span className="text-6xl text-slate-300">
                                                ▤
                                            </span>

                                            <p className="mt-4 font-bold text-[#0b3a70]">
                                                {book.title}
                                            </p>

                                            <p className="mt-2 text-xs text-slate-400">
                                                Sampul belum tersedia
                                            </p>

                                        </div>
                                    )}

                                </div>

                                <div className="mt-5 text-center">

                                    <p className="text-sm font-bold tracking-[0.2em] text-[#0b3a70]">
                                        CHIMULIA PRESS
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Culture • Innovation • Mathematics Learning
                                    </p>

                                </div>

                            </div>

                            {/* STATUS BUKU */}
                            <div className="mt-4 grid grid-cols-2 gap-3">

                                <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">

                                    <p className="text-xs text-slate-500">
                                        Ketersediaan
                                    </p>

                                    <span
                                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                                            book.availability_status === 'preorder'
                                                ? 'bg-amber-100 text-amber-800'
                                                : 'bg-emerald-100 text-emerald-800'
                                        }`}
                                    >
                                        {book.availability_status === 'preorder'
                                            ? 'Preorder'
                                            : 'Ready'}
                                    </span>

                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">

                                    <p className="text-xs text-slate-500">
                                        Buku Terjual
                                    </p>

                                    <p className="mt-2 text-lg font-bold text-[#0b3a70]">
                                        {Number(book.sold_count ?? 0).toLocaleString('id-ID')}
                                    </p>

                                </div>

                            </div>

                            {/* HARGA BUKU */}
                            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-5">

                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Harga Buku
                                </p>

                                <p className="mt-2 text-2xl font-bold text-[#0b3a70]">
                                    {formatRupiah(book.price)}
                                </p>

                                <p className="mt-2 text-xs text-slate-500">
                                    Harga dapat berubah sesuai ketentuan penerbit.
                                </p>

                            </div>

                        </aside>

                        {/* INFORMASI BUKU */}
                        <article className="min-w-0">

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">

                                {/* KATEGORI */}
                                <div className="flex flex-wrap gap-2">

                                    {categories.length > 0 ? (
                                        categories.map((category) => (
                                            <span
                                                key={category.id}
                                                className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800 ring-1 ring-blue-100"
                                            >
                                                {category.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-400">
                                            Kategori belum tersedia
                                        </span>
                                    )}

                                </div>

                                {/* JUDUL */}
                                <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#0b3a70] sm:text-4xl">
                                    {book.title}
                                </h1>

                                {book.subtitle && (
                                    <p className="mt-4 text-base leading-7 text-slate-500 sm:text-lg">
                                        {book.subtitle}
                                    </p>
                                )}

                                {/* INFORMASI RINGKAS */}
                                <div className="my-7 grid gap-5 border-y border-slate-200 py-6 sm:grid-cols-2">

                                    <div>

                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <span>✍</span>
                                            Penulis
                                        </div>

                                        <p className="mt-2 font-semibold leading-6 text-slate-900">
                                            {authors.length > 0
                                                ? authors.map(author => author.name).join(', ')
                                                : 'Belum dicantumkan'}
                                        </p>

                                    </div>

                                    <div>

                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <span>▣</span>
                                            Tanggal Terbit
                                        </div>

                                        <p className="mt-2 font-semibold text-slate-900">
                                            {formatDate(book.published_at)}
                                        </p>

                                    </div>

                                </div>

                                {/* DESKRIPSI BUKU */}
                                <section>

                                    <div className="flex items-center gap-3">

                                        <div className="h-7 w-1 rounded-full bg-amber-400" />

                                        <h2 className="text-xl font-bold text-[#0b3a70]">
                                            Tentang Buku
                                        </h2>

                                    </div>

                                    <div className="mt-4 whitespace-pre-line text-sm leading-8 text-slate-600 sm:text-base">
                                        {book.description ||
                                            'Deskripsi buku belum tersedia.'}
                                    </div>

                                </section>

                                {/* PROFIL PENULIS */}
                                {authors.length > 0 && (
                                    <section className="mt-10 border-t border-slate-100 pt-8">

                                        <div className="flex items-center gap-3">

                                            <div className="h-7 w-1 rounded-full bg-amber-400" />

                                            <h2 className="text-xl font-bold text-[#0b3a70]">
                                                Tentang Penulis
                                            </h2>

                                        </div>

                                        <div className="mt-5 grid gap-4">

                                            {authors.map((author) => (
                                                <div
                                                    key={author.id}
                                                    className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                                                >

                                                    <h3 className="text-base font-bold text-slate-900">
                                                        {author.name}
                                                    </h3>

                                                    {author.bio && (
                                                        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                                                            {author.bio}
                                                        </p>
                                                    )}

                                                    {author.email && (
                                                        <p className="mt-3 break-words text-xs text-slate-500">
                                                            Email: {author.email}
                                                        </p>
                                                    )}

                                                </div>
                                            ))}

                                        </div>

                                    </section>
                                )}

                                {/* PEMESANAN */}
                                <section className="mt-10 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6">

                                    <div className="flex items-start gap-4">

                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0b3a70] text-xl text-white">
                                            🛒
                                        </div>

                                        <div>

                                            <h2 className="text-lg font-bold text-[#0b3a70]">
                                                Tertarik dengan Buku Ini?
                                            </h2>

                                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                                Dapatkan buku pilihan dari CHIMULIA PRESS.
                                                Silakan lanjutkan ke formulir pemesanan
                                                untuk melakukan pembelian.
                                            </p>

                                        </div>

                                    </div>

                                    {book.purchase_url ? (
                                        <a
                                            href={book.purchase_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 px-6 py-3.5 text-sm font-bold text-[#0b3a70] shadow-sm transition hover:bg-amber-300 sm:w-auto"
                                        >
                                            Pesan Buku Sekarang
                                            <span>→</span>
                                        </a>
                                    ) : (
                                        <p className="mt-5 rounded-lg bg-white p-3 text-sm text-slate-500">
                                            Informasi pemesanan buku belum tersedia.
                                            Silakan hubungi CHIMULIA PRESS.
                                        </p>
                                    )}

                                    <p className="mt-3 text-xs text-slate-500">
                                        Formulir pemesanan akan dibuka di tab baru.
                                    </p>

                                </section>

                                {/* TOMBOL BAGIKAN DAN KEMBALI */}
                                <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">

                                    <button
                                        type="button"
                                        onClick={shareWhatsApp}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-emerald-600 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                                    >

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="h-5 w-5"
                                        >
                                            <path d="M12.04 2a9.91 9.91 0 0 0-8.46 15.08L2.5 22l5.08-1.33A10 10 0 1 0 12.04 2Zm0 18.18a8.17 8.17 0 0 1-4.17-1.14l-.3-.18-3.02.79.81-2.94-.2-.31a8.16 8.16 0 1 1 6.88 3.78Z" />
                                        </svg>

                                        Bagikan WhatsApp

                                    </button>

                                    <Link
                                        href={route('public.books.index')}
                                        className="flex flex-1 items-center justify-center rounded-lg bg-[#0b3a70] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
                                    >
                                        Jelajahi Buku Lainnya
                                    </Link>

                                </div>

                            </div>

                        </article>

                    </section>

                    {/* ================= INFORMASI PENERBIT ================= */}
                    <section className="mt-12 rounded-2xl bg-[#0b3a70] px-6 py-9 text-center text-white sm:px-12">

                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
                            CHIMULIA PRESS
                        </p>

                        <h2 className="mt-3 text-2xl font-bold">
                            Mendukung Budaya Literasi dan Inovasi
                        </h2>

                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-blue-100">
                            Menghadirkan karya akademik, buku referensi, dan
                            publikasi berkualitas untuk mendukung perkembangan
                            pendidikan, penelitian, dan pengetahuan.
                        </p>

                        <Link
                            href={route('public.books.index')}
                            className="mt-6 inline-flex rounded-lg bg-amber-400 px-6 py-3 text-sm font-bold text-[#0b3a70] transition hover:bg-amber-300"
                        >
                            Lihat Koleksi Buku
                        </Link>

                    </section>

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
