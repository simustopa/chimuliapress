import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

// GANTI dengan nomor WhatsApp resmi CHIMULIA PRESS, format internasional tanpa "+".
// Contoh Indonesia: 6281234567890
const WHATSAPP_NUMBER = '6289527131356';

const categories = [
    'Buku Teks / Ajar',
    'Buku Referensi',
    'Monograf',
    'Modul Pembelajaran',
    'Diktat Perguruan Tinggi',
    'Lainnya',
];

export default function Welcome({
    books = [],
    authUser = null,
    bookCategories = [],
    documentations = [],
    events = [],
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [selectedBookCategory, setSelectedBookCategory] = useState('');
    const [bestSellerOnly, setBestSellerOnly] = useState(false);
    const [form, setForm] = useState({
        name: '',
        whatsapp: '',
        title: '',
        category: categories[0],
    });

    function updateForm(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    function submitManuscript(event) {
        event.preventDefault();

        if (WHATSAPP_NUMBER.includes('X')) {
            alert('Silakan atur nomor WhatsApp resmi CHIMULIA PRESS pada variabel WHATSAPP_NUMBER di Welcome.jsx terlebih dahulu.');
            return;
        }

        const message = [
            'Halo CHIMULIA PRESS, saya ingin mengajukan draft naskah.',
            '',
            `Nama lengkap: ${form.name}`,
            `Nomor WhatsApp: ${form.whatsapp}`,
            `Judul draft naskah: ${form.title}`,
            `Kategori buku: ${form.category}`,
            '',
            'Mohon informasi mengenai proses review dan penerbitan. Terima kasih.',
        ].join('\n');

        window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
            '_blank',
            'noopener,noreferrer'
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

    function getBookDescription(book) {
        const description = book.subtitle || book.description;

        if (!description) {
            return 'Belum ada deskripsi buku.';
        }

        return description.length > 100
            ? `${description.substring(0, 100).trim()}...`
            : description;
    }

    function shareBookWhatsApp(book) {
        const detailUrl = route('public.books.show', book.slug);
        const message = `Halo, saya ingin membagikan informasi buku "${book.title}".\n\n${detailUrl}`;

        window.open(
            `https://wa.me/?text=${encodeURIComponent(message)}`,
            '_blank',
            'noopener,noreferrer'
        );
    }

    const filteredBooks = books.filter((book) => {
        const matchesCategory =
            !selectedBookCategory ||
            book.categories?.some(
                (category) =>
                    String(category.id) === String(selectedBookCategory)
            );

        const matchesBestSeller =
            !bestSellerOnly || Boolean(book.is_best_seller);

        return matchesCategory && matchesBestSeller;
    });

    return (
        <>
            <Head title="CHIMULIA PRESS | Penerbit Buku Akademik" />
            <div className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-800">
                <header className="sticky top-0 z-50 bg-[#0b3a70] text-white shadow-sm">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3 sm:px-8">
                        <Link href="/" className="flex shrink-0 flex-col leading-none" aria-label="CHIMULIA PRESS beranda">
                            <span className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">ℭimulia</span>
                            <span className="mt-1 text-[7px] tracking-[0.12em] text-blue-100">Center for Cultural Impact in Mathematics Learning</span>
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

                        <nav className={`${mobileMenuOpen ? 'absolute left-0 right-0 top-full flex flex-col items-stretch gap-0 bg-[#0b3a70] px-5 pb-4 shadow-lg' : 'hidden'} md:static md:flex md:flex-row md:items-center md:gap-5 md:bg-transparent md:p-0 md:shadow-none`}>
                            <a onClick={() => setMobileMenuOpen(false)} href="#beranda" className="py-3 text-sm hover:text-amber-200 md:py-2">Beranda</a>
                            <a onClick={() => setMobileMenuOpen(false)} href="#tentang" className="py-3 text-sm hover:text-amber-200 md:py-2">Tentang Kami</a>
                            <div className="group relative">
                                <button type="button" className="flex w-full items-center gap-1 py-3 text-left text-sm hover:text-amber-200 md:py-2">
                                    Katalog Buku <span aria-hidden="true">⌄</span>
                                </button>
                                <div className="left-0 top-full z-50 min-w-52 rounded-lg border border-slate-100 bg-white py-2 text-slate-700 shadow-xl md:absolute md:hidden md:group-hover:block md:group-focus-within:block">
                                    <a href="/katalog-buku" className="block px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-800">Semua Buku</a>
                                    <a href="#mitra" className="block px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-800">Mitra</a>
                                    <a href="#kolaborasi" className="block px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-800">Peluang Kolaborasi</a>
                                    <a href="#sponsorship" className="block px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-800">Sponsorship / Hibah</a>
                                </div>
                            </div>
                            <a onClick={() => setMobileMenuOpen(false)} href="#event" className="py-3 text-sm hover:text-amber-200 md:py-2">Event</a>
                            <a onClick={() => setMobileMenuOpen(false)} href="#pengajuan" className="py-3 text-sm hover:text-amber-200 md:py-2">Pengajuan Naskah</a>
                            <a onClick={() => setMobileMenuOpen(false)} href="#kontak" className="py-3 text-sm hover:text-amber-200 md:py-2">Kontak</a>

                            <div className="flex items-center gap-3 py-3 md:py-0">
                                {authUser ? (
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
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
                                                    onClick={() => setProfileMenuOpen(false)}
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
                                                            onClick={() => setProfileMenuOpen(false)}
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

                <main>
                    <section id="beranda" className="relative isolate overflow-hidden bg-[#0b3a70] text-white">
                        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
                            <svg className="h-full w-full" viewBox="0 0 1440 600" preserveAspectRatio="none" fill="none">
                                {Array.from({ length: 13 }, (_, i) => (
                                    <path key={i} d={`M -80 ${230 + i * 16} C 180 ${120 + i * 14}, 330 ${420 + i * 5}, 560 ${280 + i * 12} S 940 ${140 + i * 16}, 1110 ${300 + i * 9} S 1320 ${180 + i * 11}, 1510 ${260 + i * 12}`} stroke="#5da4e9" strokeWidth="0.8" />
                                ))}
                            </svg>
                        </div>

                        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.2fr_0.9fr] lg:gap-16 lg:py-16">
                            <div className="py-2">
                                <p className="text-sm font-bold sm:text-base">Penerbit berkualitas dan Resmi</p>
                                <h1 className="mt-5 font-serif text-6xl font-bold leading-none tracking-tight sm:text-7xl lg:text-8xl">ℭimulia<span className="text-amber-200">✦</span></h1>
                                <p className="mt-3 text-sm font-semibold tracking-wide sm:text-base">Center for Cultural Impact in Mathematics Learning</p>
                                <div className="mt-3 flex max-w-md items-center gap-3 text-[10px] tracking-[0.22em] text-blue-100 sm:text-xs">
                                    <span className="h-px flex-1 bg-blue-200/70" /> Culture • Innovation • Mathematics <span className="h-px flex-1 bg-blue-200/70" />
                                </div>
                                <h2 className="mt-8 max-w-lg text-lg font-bold leading-snug sm:text-xl">Layanan Penerbitan<br />Buku Akademik &amp; Referensi Ilmiah</h2>
                                <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-50 sm:text-[15px] sm:leading-7">
                                    CIMULIA memfasilitasi dosen, guru, peneliti, dan praktisi pendidikan dalam mempublikasikan serta menyebarluaskan hasil penelitian, buku ajar, modul pembelajaran, dan karya inovatif melalui layanan penerbitan buku ber-ISBN yang terdaftar secara resmi di Perpustakaan Nasional Republik Indonesia.
                                </p>
                                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-blue-50 sm:text-sm">
                                    <span>✓ Resmi Perpusnas (ISBN)</span>
                                    <span>✓ Standar penerbitan</span>
                                    <span>✓ Proses transparan</span>
                                </div>
                                <div className="mt-7 flex flex-wrap gap-3">
                                    <a href="#pengajuan" className="rounded-md bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-400">Ajukan Naskah Sekarang →</a>
                                    <a href="#kontak" className="rounded-md border border-white/50 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Konsultasi Penerbitan</a>
                                </div>
                            </div>

                            <div id="pengajuan" className="scroll-mt-28 rounded-2xl bg-white p-6 text-slate-900 shadow-2xl sm:p-7">
                                <h2 className="text-2xl font-bold tracking-tight">Formulir Draft Naskah</h2>
                                <p className="text-xs text-stone-400">Lengkapi data berikut untuk proses review.</p>
                                <form onSubmit={submitManuscript} className="mt-5 space-y-3">
                                    <div>
                                        <label htmlFor="name" className="mb-1.5 block text-xs font-semibold">Nama Lengkap &amp; Gelar</label>
                                        <input id="name" name="name" value={form.name} onChange={updateForm} required maxLength={120} placeholder="Contoh: Khairullah, M.Pd." className="w-full rounded-md border border-stone-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100" />
                                    </div>
                                    <div>
                                        <label htmlFor="whatsapp" className="mb-1.5 block text-xs font-semibold">Nomor WhatsApp</label>
                                        <input id="whatsapp" name="whatsapp" value={form.whatsapp} onChange={updateForm} required maxLength={30} placeholder="Contoh: 081234567890" className="w-full rounded-md border border-stone-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100" />
                                    </div>
                                    <div>
                                        <label htmlFor="title" className="mb-1.5 block text-xs font-semibold">Judul Draft Naskah Buku</label>
                                        <input id="title" name="title" value={form.title} onChange={updateForm} required maxLength={180} placeholder="Masukkan judul naskah Anda" className="w-full rounded-md border border-stone-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100" />
                                    </div>
                                    <div>
                                        <label htmlFor="category" className="mb-1.5 block text-xs font-semibold">Kategori Buku</label>
                                        <select id="category" name="category" value={form.category} onChange={updateForm} required className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100">
                                            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                                        </select>
                                    </div>
                                    <button type="submit" className="mt-2 w-full rounded-md bg-[#073875] px-5 py-3 text-base font-bold text-white transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200">Kirim via WhatsApp</button>
                                    <p className="text-center text-[11px] leading-5 text-stone-400">Data akan disiapkan sebagai pesan WhatsApp untuk tim CHIMULIA PRESS. Anda dapat memeriksa pesan sebelum mengirimkannya.</p>
                                </form>
                            </div>
                        </div>
                    </section>

                    <section id="tentang" className="scroll-mt-20 py-16 sm:py-20">
                        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 md:grid-cols-2 md:items-center">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Profil CHIMULIA PRESS</p>
                                <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">Mendukung Karya Akademik dan Inovasi Pendidikan</h2>
                            </div>
                            <div className="space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
                                <p>PT Center for Cultural Impact in Mathematics Learning (CIMULIA) hadir sebagai lembaga penerbitan berbadan hukum dan pengembangan pendidikan yang berkomitmen mendampingi dosen, guru, peneliti, dan praktisi pendidikan dalam menghasilkan, menerbitkan, serta menyebarluaskan karya ilmiah dan inovasi pendidikan secara profesional.</p>
                                <p>Berbasis di Yogyakarta, CIMULIA berfokus pada pengembangan pendidikan matematika berbasis budaya, Ethnomathematics, Realistic Mathematics Education (RME), serta inovasi teknologi pembelajaran.</p>
                            </div>
                        </div>
                    </section>

                    <section id="layanan" className="bg-slate-50 py-16 sm:py-20">
                        <div className="mx-auto max-w-7xl px-5 sm:px-8">
                            <div className="max-w-2xl">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Pilar Penerbitan Terpadu</p>
                                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Layanan Profesional Kami</h2>
                            </div>
                            <div className="mt-9 grid gap-5 md:grid-cols-3">
                                {[
                                    { icon: '▤', title: 'Penerbitan Buku Akademik', text: 'Fasilitas penerbitan monograf, buku ajar, buku referensi, dan diktat perguruan tinggi dengan proses yang terarah.' },
                                    { icon: '✓', title: 'Pengurusan ISBN & E-ISBN', text: 'Pendampingan pengurusan legalitas penerbitan melalui Perpustakaan Nasional RI sesuai ketentuan yang berlaku.' },
                                    { icon: '©', title: 'Hak Cipta & HKI Buku', text: 'Informasi dan pendampingan pendaftaran hak cipta naskah untuk membantu perlindungan kepemilikan karya intelektual.' },
                                ].map((service) => (
                                    <article key={service.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-2xl font-bold text-blue-800">{service.icon}</span>
                                        <h3 className="mt-5 text-lg font-bold text-slate-900">{service.title}</h3>
                                        <p className="mt-3 text-sm leading-6 text-slate-600">{service.text}</p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>


                    <section
                        id="katalog"
                        className="scroll-mt-20 bg-slate-50 py-16 sm:py-20"
                    >
                        <div className="mx-auto max-w-7xl px-5 sm:px-8">
                            {/* Judul katalog */}
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                                        Koleksi &amp; Terbitan
                                    </p>

                                    <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                                        Katalog Buku CHIMULIA PRESS
                                    </h2>

                                    <p className="mt-3 text-sm text-slate-600">
                                        Jelajahi buku akademik dan referensi ilmiah kami.
                                    </p>
                                </div>

                                <Link
                                    href="/katalog-buku"
                                    className="inline-flex w-fit shrink-0 rounded-md border border-blue-800 px-5 py-3 text-sm font-semibold text-blue-800 transition hover:bg-blue-50"
                                >
                                    Lihat Semua Buku →
                                </Link>
                            </div>

                            {/* Filter kategori berbentuk tombol */}
                            <div className="mt-7">
                                <p className="mb-3 text-sm font-semibold text-slate-700">
                                    Pilih Kategori Buku
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedBookCategory('')}
                                        aria-pressed={!selectedBookCategory}
                                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                            !selectedBookCategory
                                                ? 'border-blue-800 bg-blue-800 text-white'
                                                : 'border-slate-300 bg-white text-slate-700 hover:border-blue-700 hover:text-blue-800'
                                        }`}
                                    >
                                        Semua Buku
                                    </button>

                                    {bookCategories.map((category) => {
                                        const active =
                                            String(selectedBookCategory) === String(category.id);

                                        return (
                                            <button
                                                key={category.id}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedBookCategory(
                                                        active ? '' : String(category.id)
                                                    )
                                                }
                                                aria-pressed={active}
                                                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                                    active
                                                        ? 'border-blue-800 bg-blue-800 text-white'
                                                        : 'border-slate-300 bg-white text-slate-700 hover:border-blue-700 hover:text-blue-800'
                                                }`}
                                            >
                                                {category.name}
                                            </button>
                                        );
                                    })}

                                    {/* Filter Best Seller */}
                                    <button
                                        type="button"
                                        onClick={() => setBestSellerOnly((current) => !current)}
                                        aria-pressed={bestSellerOnly}
                                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                                            bestSellerOnly
                                                ? 'border-amber-500 bg-amber-500 text-white'
                                                : 'border-amber-300 bg-white text-amber-700 hover:bg-amber-50'
                                        }`}
                                    >
                                        <span aria-hidden="true">★</span>
                                        Best Seller
                                        {bestSellerOnly && (
                                            <span aria-hidden="true">✓</span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Jumlah buku */}
                            <div className="mb-5 mt-7 flex items-center justify-between gap-3">
                                <h3 className="text-xl font-bold text-slate-900">
                                    Buku Terbitan
                                </h3>

                                <span className="text-sm text-slate-500">
                                    {filteredBooks.length} buku ditemukan
                                </span>
                            </div>

                            {/* Daftar buku */}
                            {filteredBooks.length > 0 ? (
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {filteredBooks.map((book) => (
                                        <article
                                            key={book.id}
                                            className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                                        >
                                            {/* Sampul dan status */}
                                            <Link
                                                href={route('public.books.show', book.slug)}
                                                className="relative block bg-slate-100"
                                            >
                                                <div className="flex h-[280px] items-center justify-center overflow-hidden sm:h-[300px]">
                                                    {book.cover_image ? (
                                                        <img
                                                            src={`/storage/${book.cover_image}`}
                                                            alt={`Sampul ${book.title}`}
                                                            loading="lazy"
                                                            className="h-full w-full object-contain"
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-slate-400">
                                                            Sampul belum tersedia
                                                        </span>
                                                    )}
                                                </div>

                                                <span
                                                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                                                        book.availability_status === 'preorder'
                                                            ? 'bg-amber-100 text-amber-800'
                                                            : 'bg-emerald-100 text-emerald-800'
                                                    }`}
                                                >
                                                    {book.availability_status === 'preorder'
                                                        ? 'Preorder'
                                                        : 'Ready'}
                                                </span>

                                                {book.is_best_seller && (
                                                    <span className="absolute right-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white">
                                                        ★ Best Seller
                                                    </span>
                                                )}
                                            </Link>

                                            {/* Detail buku */}
                                            <div className="flex flex-1 flex-col p-4">
                                                <div className="flex min-h-7 flex-wrap gap-1.5">
                                                    {book.categories?.length > 0 ? (
                                                        book.categories.map((category) => (
                                                            <button
                                                                key={category.id}
                                                                type="button"
                                                                onClick={() =>
                                                                    setSelectedBookCategory(
                                                                        String(category.id) ===
                                                                            selectedBookCategory
                                                                            ? ''
                                                                            : String(category.id)
                                                                    )
                                                                }
                                                                className="rounded-full bg-indigo-50 px-2.5 py-1 text-left text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                                                            >
                                                                {category.name}
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
                                                    className="mt-3 hover:text-blue-800"
                                                >
                                                    <h3 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-slate-900">
                                                        {book.title}
                                                    </h3>
                                                </Link>

                                                <p className="mt-2 line-clamp-3 min-h-[60px] text-sm leading-5 text-slate-500">
                                                    {getBookDescription(book)}
                                                </p>

                                                <div className="mt-3">
                                                    <p className="text-xs text-slate-500">
                                                        Penulis
                                                    </p>

                                                    <p className="line-clamp-1 text-sm font-medium text-slate-800">
                                                        {book.authors?.length
                                                            ? book.authors
                                                                .map((author) => author.name)
                                                                .join(', ')
                                                            : 'Penulis belum tersedia'}
                                                    </p>
                                                </div>

                                                <div className="mt-4 border-t border-slate-100 pt-3">
                                                    <p className="text-lg font-bold text-indigo-700">
                                                        {formatRupiah(book.price)}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {Number(
                                                            book.sold_count ?? 0
                                                        ).toLocaleString('id-ID')}{' '}
                                                        buku terjual
                                                    </p>
                                                </div>

                                                {/* Tombol aksi */}
                                                <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                                                    <Link
                                                        href={route(
                                                            'public.books.show',
                                                            book.slug
                                                        )}
                                                        className="flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
                                                    >
                                                        Detail Buku
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => shareBookWhatsApp(book)}
                                                        className="flex items-center justify-center gap-1 rounded-lg border border-green-600 px-2 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                                                    >
                                                        <span aria-hidden="true">☏</span>
                                                        Bagikan
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                                    <p className="font-semibold text-slate-700">
                                        Buku tidak ditemukan.
                                    </p>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Coba pilih kategori lain atau nonaktifkan filter Best Seller.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedBookCategory('');
                                            setBestSellerOnly(false);
                                        }}
                                        className="mt-4 rounded-md bg-blue-800 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900"
                                    >
                                        Tampilkan Semua Buku
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>



                    <section id="event" className="scroll-mt-20 bg-blue-50 py-16 sm:py-20">
                        <div className="mx-auto max-w-7xl px-5 sm:px-8">
                            <div className="mb-8">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                                    Informasi Terkini
                                </p>

                                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                                    News &amp; Events
                                </h2>

                                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                                    Informasi kegiatan, publikasi terbaru, dan program terbuka
                                    CHIMULIA PRESS.
                                </p>
                            </div>

                            {events.length > 0 ? (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {events.map((event) => {
                                        const typeLabels = {
                                            upcoming: 'Event Mendatang',
                                            news: 'Berita',
                                            open_program: 'Program Terbuka',
                                        };

                                        const buttonLabels = {
                                            upcoming: 'Daftar Acara',
                                            news: 'Lihat Katalog',
                                            open_program: 'Kirim Naskah',
                                        };

                                        const buttonClass =
                                            'mt-5 inline-flex items-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800';

                                        return (
                                            <article
                                                key={event.id}
                                                className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm transition hover:shadow-md"
                                            >
                                                {event.cover_image && (
                                                    <img
                                                        src={`/storage/${event.cover_image}`}
                                                        alt={event.title}
                                                        className="h-48 w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                )}

                                                <div className="p-6">
                                                    <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
                                                        {typeLabels[event.type] || event.type}
                                                    </p>

                                                    {event.event_date && (
                                                        <p className="mt-2 text-xs text-slate-500">
                                                            {new Date(
                                                                `${String(event.event_date).substring(0, 10)}T00:00:00`,
                                                            ).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric',
                                                            })}
                                                        </p>
                                                    )}

                                                    <h3 className="mt-3 text-lg font-bold text-slate-900">
                                                        {event.title}
                                                    </h3>

                                                    {event.description && (
                                                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                                                            {event.description}
                                                        </p>
                                                    )}

                                                    {event.type === 'upcoming' &&
                                                        event.registration_url && (
                                                            <a
                                                                href={event.registration_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={buttonClass}
                                                            >
                                                                {buttonLabels.upcoming}
                                                            </a>
                                                        )}

                                                    {event.type === 'news' && (
                                                        <a
                                                            href="/katalog-buku"
                                                            className={buttonClass}
                                                        >
                                                            {buttonLabels.news}
                                                        </a>
                                                    )}

                                                    {event.type === 'open_program' && (
                                                        <a
                                                            href="#pengajuan"
                                                            className={buttonClass}
                                                        >
                                                            {buttonLabels.open_program}
                                                        </a>
                                                    )}
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-blue-100 bg-white px-6 py-12 text-center">
                                    <h3 className="text-lg font-semibold text-slate-800">
                                        Belum Ada Informasi Terkini
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-600">
                                        Informasi event, berita, dan program terbaru akan ditampilkan
                                        di sini.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>



                    {/* Dokumentasi */}
                    <section
                        id="dokumentasi"
                        className="scroll-mt-20 bg-white py-16 sm:py-20"
                    >
                        <div className="mx-auto max-w-7xl px-5 sm:px-8">
                            <div className="mb-10 text-center">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                                    Galeri Kegiatan
                                </p>

                                <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                                    Dokumentasi
                                </h2>

                                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                                    Lihat dokumentasi kegiatan, aktivitas, dan berbagai
                                    momen bersama CHIMULIA PRESS.
                                </p>
                            </div>

                            {documentations.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                                    <p className="font-medium text-slate-700">
                                        Dokumentasi segera hadir.
                                    </p>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Foto dan video kegiatan akan ditampilkan di sini.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {documentations.map((item) => (
                                        <article
                                            key={item.id}
                                            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                        >
                                            {item.type === 'photo' ? (
                                                <img
                                                    src={`/storage/${item.file_path}`}
                                                    alt={item.title}
                                                    loading="lazy"
                                                    className="h-56 w-full object-cover"
                                                />
                                            ) : (
                                                <video
                                                    src={`/storage/${item.file_path}`}
                                                    controls
                                                    preload="metadata"
                                                    className="h-56 w-full bg-black object-contain"
                                                >
                                                    Browser tidak mendukung pemutaran video.
                                                </video>
                                            )}

                                            <div className="p-5">
                                                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                                                    {item.type === 'photo' ? 'Foto' : 'Video'}
                                                </span>

                                                <h3 className="mt-2 text-lg font-bold text-slate-900">
                                                    {item.title}
                                                </h3>

                                                {item.description && (
                                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>


                    <section
                        id="kontak"
                        className="scroll-mt-20 bg-[#0b3a70] py-14 text-white sm:py-16"
                    >
                        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 md:grid-cols-2 md:items-center">
                            {/* Bagian pengantar */}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
                                    Hubungi Kami
                                </p>

                                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                                    Informasi Kontak
                                </h2>

                                <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100">
                                    Punya pertanyaan tentang penerbitan, pengajuan naskah,
                                    atau peluang kolaborasi? Hubungi tim CHIMULIA PRESS
                                    untuk berdiskusi lebih lanjut.
                                </p>
                            </div>

                            {/* Kartu informasi kontak */}
                            <div className="rounded-xl border border-white/15 bg-white/10 p-5 sm:p-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {/* Identitas penerbit */}
                                    <div className="sm:border-r sm:border-white/15 sm:pr-5">
                                        <h3 className="font-bold leading-6">
                                            CHIMULIA — Center for Cultural Impact in
                                            Mathematics Learning
                                        </h3>

                                        <p className="mt-3 text-sm leading-6 text-blue-100">
                                            Yogyakarta, Indonesia
                                        </p>

                                        <a
                                            href="#pengajuan"
                                            className="mt-5 inline-flex rounded-md bg-amber-200 px-4 py-3 text-sm font-bold text-[#0b3a70] transition hover:bg-amber-100"
                                        >
                                            Konsultasi / Ajukan Naskah →
                                        </a>
                                    </div>

                                    {/* Daftar kontak */}
                                    <div>
                                        <h3 className="mb-4 font-bold text-amber-200">
                                            Terhubung dengan Kami
                                        </h3>

                                        <div className="space-y-4">
                                            {/* Instagram */}
                                            <a
                                                href="https://www.instagram.com/USERNAME/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-center gap-3 rounded-lg transition hover:text-amber-200"
                                            >
                                                <span className="text-xl" aria-hidden="true">
                                                    ◎
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block font-semibold">
                                                        Instagram
                                                    </span>
                                                    <span className="block break-all text-sm text-blue-100 group-hover:text-amber-100">
                                                        @USERNAME
                                                    </span>
                                                </span>
                                                <span aria-hidden="true">↗</span>
                                            </a>

                                            {/* WhatsApp */}
                                            <a
                                                href="https://wa.me/6281234567890"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-center gap-3 rounded-lg transition hover:text-amber-200"
                                            >
                                                <span className="text-xl" aria-hidden="true">
                                                    ☎
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block font-semibold">
                                                        WhatsApp Official
                                                    </span>
                                                    <span className="block text-sm text-blue-100 group-hover:text-amber-100">
                                                        Hubungi kami melalui WhatsApp
                                                    </span>
                                                </span>
                                                <span aria-hidden="true">↗</span>
                                            </a>

                                            {/* Email */}
                                            <a
                                                href="mailto:EMAIL@CONTOH.COM"
                                                className="group flex items-center gap-3 rounded-lg transition hover:text-amber-200"
                                            >
                                                <span className="text-xl" aria-hidden="true">
                                                    ✉
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block font-semibold">
                                                        Email
                                                    </span>
                                                    <span className="block break-all text-sm text-blue-100 group-hover:text-amber-100">
                                                        EMAIL@CONTOH.COM
                                                    </span>
                                                </span>
                                                <span aria-hidden="true">↗</span>
                                            </a>

                                            {/* Website */}
                                            <a
                                                href="https://WEBSITE-KAMU.COM"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-center gap-3 rounded-lg transition hover:text-amber-200"
                                            >
                                                <span className="text-xl" aria-hidden="true">
                                                    ◎
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block font-semibold">
                                                        Website
                                                    </span>
                                                    <span className="block break-all text-sm text-blue-100 group-hover:text-amber-100">
                                                        WEBSITE-KAMU.COM
                                                    </span>
                                                </span>
                                                <span aria-hidden="true">↗</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </section>

                </main>

                <footer className="bg-[#06294f] py-6 text-blue-100">
                    <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
                        <span className="font-semibold tracking-wide">CHIMULIA PRESS</span>
                        <span>Culture • Innovation • Mathematics</span>
                        <span>© {new Date().getFullYear()} CHIMULIA PRESS. Hak cipta dilindungi.</span>
                    </div>
                </footer>
            </div>
        </>
    );
}
