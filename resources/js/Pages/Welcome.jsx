import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Nomor WhatsApp resmi CHIMULIA PRESS, format internasional tanpa "+".
const WHATSAPP_NUMBER = '6289527131356';

const categories = [
    'Buku Pelajaran / Buku Sekolah ',
    'Buku Referensi / Monograf',
    'Buku Teks / Buku Ajar',
    'Buku Umum & Literasi Edukasi',
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
    const [activeService, setActiveService] = useState(null);
    const [pricingTab, setPricingTab] = useState('putus');
    // Kode lainnya tetap di sini
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

        if (!WHATSAPP_NUMBER || WHATSAPP_NUMBER.includes('X')) {
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
        if (!description) return 'Belum ada deskripsi buku.';
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
                (category) => String(category.id) === String(selectedBookCategory)
            );
        const matchesBestSeller =
            !bestSellerOnly || Boolean(book.is_best_seller);
        return matchesCategory && matchesBestSeller;
    });

    const visibleEvents = events.slice(0, 3);
    const visibleDocumentations = documentations.slice(0, 6);

    return (
        <>
            <Head title="CHIMULIA PRESS | Penerbit Buku Akademik" />

            <div className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-800">
                {/* NAVBAR */}
                <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#062d59]/95 text-white shadow-lg shadow-blue-950/10 backdrop-blur-md">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2.5 sm:px-8">
                        <Link href="/" className="flex shrink-0 items-center" aria-label="CHIMULIA PRESS beranda">
                            <img
                                src="/images/chimulia-white.png"
                                alt="Logo CHIMULIA PRESS"
                                className="h-12 w-auto object-contain sm:h-14"
                            />
                        </Link>

                        <button
                            type="button"
                            className="rounded-lg border border-white/25 px-3 py-2 text-sm md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-expanded={mobileMenuOpen}
                            aria-label="Buka menu navigasi"
                        >
                            {mobileMenuOpen ? 'Tutup ✕' : 'Menu ☰'}
                        </button>

                        <nav className={`${mobileMenuOpen ? 'absolute left-0 right-0 top-full flex flex-col gap-1 border-t border-white/10 bg-[#062d59] px-5 pb-5 shadow-xl' : 'hidden'} md:static md:flex md:flex-row md:items-center md:gap-5 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
                            <a onClick={() => setMobileMenuOpen(false)} href="#beranda" className="py-3 text-sm text-blue-100 transition hover:text-amber-300 md:py-2">Beranda</a>
                            <a onClick={() => setMobileMenuOpen(false)} href="#tentang" className="py-3 text-sm text-blue-100 transition hover:text-amber-300 md:py-2">Tentang Kami</a>
                            <a onClick={() => setMobileMenuOpen(false)} href="#katalog" className="py-3 text-sm text-blue-100 transition hover:text-amber-300 md:py-2">Katalog Buku</a>
                            <a onClick={() => setMobileMenuOpen(false)} href="#event" className="py-3 text-sm text-blue-100 transition hover:text-amber-300 md:py-2">Event</a>
                            <a onClick={() => setMobileMenuOpen(false)} href="#pengajuan" className="py-3 text-sm text-blue-100 transition hover:text-amber-300 md:py-2">Pengajuan Naskah</a>
                            <a onClick={() => setMobileMenuOpen(false)} href="#kontak" className="py-3 text-sm text-blue-100 transition hover:text-amber-300 md:py-2">Kontak</a>

                            <div className="flex items-center gap-2 py-3 md:py-0">
                                {authUser ? (
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                            aria-expanded={profileMenuOpen}
                                            aria-label="Menu profil pengguna"
                                            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 transition hover:bg-white/20"
                                        >
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-300 text-sm font-bold uppercase text-[#073875]">
                                                {(authUser.name || 'U').charAt(0)}
                                            </span>
                                            <span className="max-w-32 truncate text-sm font-semibold">{authUser.name}</span>
                                            <span className="text-xs">{profileMenuOpen ? '▲' : '▼'}</span>
                                        </button>
                                        {profileMenuOpen && (
                                            <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-800 shadow-xl">
                                                <div className="border-b border-slate-100 px-4 py-4">
                                                    <p className="truncate font-semibold">{authUser.name}</p>
                                                    <p className="mt-1 truncate text-xs text-slate-500">{authUser.email}</p>
                                                </div>
                                                <div className="p-2">
                                                    <Link href="/profile" onClick={() => setProfileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm transition hover:bg-blue-50 hover:text-blue-800">
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
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="rounded-lg bg-[#FCD34D] px-4 py-2.5 text-xs font-bold text-[#062D59] transition hover:bg-[#062D59] hover:text-white">
                                            Login
                                        </Link>
                                        <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="rounded-lg bg-[#FCD34D] px-4 py-2.5 text-xs font-bold text-[#062D59] transition hover:bg-[#062D59] hover:text-white">
                                            Daftar <span aria-hidden="true">→</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                </header>

                <main className="pt-[68px]">
                    {/* HERO */}
                    <section
                        id="beranda"
                        className="relative isolate overflow-hidden bg-[#062d59] text-white"
                        style={{
                            backgroundImage: "linear-gradient(90deg, rgba(4,35,73,.97) 0%, rgba(5,48,91,.88) 52%, rgba(5,48,91,.42) 100%), url('/images/hero-bg.jpg')",
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                        }}
                    >
                        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-950/30 via-transparent to-sky-500/20" />
                        <div className="mx-auto grid max-w-7xl items-center gap-9 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.15fr_.78fr] lg:gap-14 lg:py-16">
                            <div className="max-w-3xl">
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/15 px-4 py-2 text-xs font-semibold text-blue-50 backdrop-blur">
                                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                                    Halo Penulis!
                                </div>
                                <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.45rem]">
                                    Center for Cultural Impact in <span className="text-amber-300">Mathematics Learning</span>
                                </h1>
                                <p className="mt-4 text-base font-bold tracking-wide text-blue-50 sm:text-lg">
                                    Culture <span className="px-2 text-amber-300">•</span> Innovation <span className="px-2 text-amber-300">•</span> Mathematics Learning
                                </p>
                                <p className="mt-4 max-w-xl text-sm leading-6 text-blue-100 sm:text-base sm:leading-7">
                                    Kami hadir sebagai pusat penerbitan yang berkomitmen mengembangkan pendidikan matematika melalui buku berkualitas, berbasis budaya, dan berorientasi pada dampak nyata.
                                </p>
                                <div className="mt-7 flex flex-wrap gap-3">
                                    <a href="#katalog" className="inline-flex items-center rounded-full bg-amber-300 px-6 py-3 text-sm font-bold text-[#082f5c] shadow-lg shadow-amber-950/20 transition hover:-translate-y-0.5 hover:bg-amber-200">
                                        Jelajahi Katalog Buku <span className="ml-2">→</span>
                                    </a>
                                    <a href="#tentang" className="inline-flex items-center rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                                        Kenali Kami <span className="ml-2">→</span>
                                    </a>
                                </div>
                            </div>

                            {/* FORMULIR PENGAJUAN */}
                            <div id="pengajuan" className="scroll-mt-28 rounded-2xl border border-white/70 bg-white p-5 text-slate-900 shadow-2xl shadow-blue-950/30 sm:p-6">
                                <h2 className="text-xl font-extrabold tracking-tight text-[#082f5c] sm:text-2xl">Formulir Draft Naskah</h2>
                                <p className="mt-1 text-xs text-slate-500">Lengkapi data berikut untuk pengajuan naskah.</p>
                                <form onSubmit={submitManuscript} className="mt-5 space-y-3">
                                    <div>
                                        <label htmlFor="name" className="mb-1.5 block text-xs font-bold text-[#123b70]">Nama Lengkap &amp; Gelar</label>
                                        <input id="name" name="name" value={form.name} onChange={updateForm} required maxLength={120} placeholder="Contoh: Budi, M.Pd." className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100" />
                                    </div>
                                    <div>
                                        <label htmlFor="whatsapp" className="mb-1.5 block text-xs font-bold text-[#123b70]">Nomor WhatsApp</label>
                                        <input id="whatsapp" name="whatsapp" value={form.whatsapp} onChange={updateForm} required maxLength={30} placeholder="Contoh: 081234567890" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100" />
                                    </div>
                                    <div>
                                        <label htmlFor="title" className="mb-1.5 block text-xs font-bold text-[#123b70]">Judul Draft Naskah</label>
                                        <input id="title" name="title" value={form.title} onChange={updateForm} required maxLength={180} placeholder="Masukkan judul naskah Anda" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100" />
                                    </div>
                                    <div>
                                        <label htmlFor="category" className="mb-1.5 block text-xs font-bold text-[#123b70]">Kategori Buku</label>
                                        <select id="category" name="category" value={form.category} onChange={updateForm} required className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100">
                                            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                                        </select>
                                    </div>
                                    <button type="submit" className="mt-2 w-full rounded-lg bg-[#073875] px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200">
                                        <span className="mr-2">➤</span> Kirim via WhatsApp
                                    </button>
                                    <p className="text-[10px] leading-4 text-slate-500">Tim kami akan segera menghubungi Anda. Pesan dapat diperiksa sebelum dikirim.</p>
                                </form>
                            </div>
                        </div>
                        <div className="pointer-events-none absolute bottom-0 left-0 h-5 w-full bg-gradient-to-r from-blue-700/70 via-transparent to-sky-500/60" />
                    </section>

                    {/* TENTANG */}
                    <section id="tentang" className="scroll-mt-20 relative overflow-hidden bg-white py-14 sm:py-16">
                        <div className="mx-auto grid max-w-7xl items-center gap-9 px-5 sm:px-8 md:grid-cols-2">
                            <div>
                                <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#073875]"><span className="h-0.5 w-7 bg-amber-400" /> Profile Kami</p>
                                <h2 className="mt-3 max-w-xl text-3xl font-extrabold leading-tight text-[#082f5c] sm:text-4xl">Mendukung Karya Akademik dan Inovasi Pendidikan</h2>
                                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                                    PT Center for Cultural Impact in Mathematics Learning (CHIMULIA) hadir sebagai lembaga penerbitan berbadan hukum dan pengembangan pendidikan yang berkomitmen mendampingi dosen, guru, peneliti, dan praktisi pendidikan dalam menghasilkan, menerbitkan, serta menyebarluaskan karya ilmiah dan inovasi pendidikan secara profesional.
                                    Berbasis di Yogyakarta, CHIMULIA berfokus pada pengembangan pendidikan matematika berbasis budaya, Ethnomathematics, Realistic Mathematics Education (RME), serta inovasi teknologi pembelajaran.
                                </p>

                            </div>
                            <div className="relative">
                                <div className="absolute -left-5 top-5 h-3/4 w-full rounded-2xl bg-blue-100" />
                                <img
                                    src="/images/hero-bg.jpg"
                                    alt="Suasana buku dan kegiatan penerbitan CHIMULIA PRESS"
                                    loading="lazy"
                                    className="relative h-56 w-full rounded-2xl object-cover shadow-lg sm:h-64"
                                />
                            </div>
                        </div>
                    </section>


                    {/* LAYANAN */}
                    <section id="layanan" className="bg-gradient-to-b from-blue-50 to-white py-12 sm:py-14">
                        <div className="mx-auto max-w-7xl px-5 sm:px-8">

                            <div className="text-center">
                                <p className="flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#073875]">
                                    <span className="h-0.5 w-7 bg-amber-400" />
                                    Layanan Kami
                                    <span className="h-0.5 w-7 bg-amber-400" />
                                </p>

                                <h2 className="mt-2 text-3xl font-extrabold text-[#082f5c] sm:text-4xl">
                                    Layanan Profesional Kami
                                </h2>
                            </div>

                            {/* KARTU LAYANAN */}
                            <div className="mt-8 grid gap-4 md:grid-cols-3">
                                {[
                                    {
                                        id: 'penerbitan',
                                        icon: '▤',
                                        title: 'Penerbitan Buku Akademik',
                                        text: 'Menerbitkan buku berkualitas untuk mendukung pengembangan ilmu pengetahuan.',

                                    },
                                    {
                                        id: 'isbn',
                                        icon: '✓',
                                        title: 'Pengurusan ISBN & E-ISBN',
                                        text: 'Pengurusan ISBN dan E-ISBN dengan proses mudah dan cepat.',

                                    },
                                    {
                                        id: 'hki',
                                        icon: '©',
                                        title: 'Hak Cipta & HKI Buku',
                                        text: 'Melindungi karya Anda dengan layanan pendaftaran hak cipta.',

                                    },
                                ].map((service) => (
                                    <article
                                        key={service.id}
                                        className="group flex flex-col justify-between rounded-2xl border border-white bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="flex items-start gap-4">
                                            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-3xl font-bold text-blue-600 shadow-inner transition group-hover:bg-blue-100">
                                                {service.icon}
                                            </span>

                                            <div>
                                                <h3 className="text-sm font-extrabold text-[#082f5c]">
                                                    {service.title}
                                                </h3>

                                                <p className="mt-2 text-xs leading-5 text-slate-500">
                                                    {service.text}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActiveService(service);
                                                setPricingTab('putus');
                                            }}
                                            className="mt-5 w-full rounded-full border border-blue-700 px-4 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-700 hover:text-white"
                                        >
                                            ◉ Lihat Detail & Harga
                                        </button>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* POP-UP DETAIL LAYANAN */}
                    {activeService && (
                        <div
                            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-5"
                            onClick={() => setActiveService(null)}
                        >
                            <div
                                className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* HEADER POP-UP */}
                                <div className="flex items-center justify-between bg-[#06A173] px-5 py-4 text-white sm:px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-xl">
                                            {activeService.icon}
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-extrabold sm:text-base">
                                                {activeService.title}
                                            </h3>
                                            <p className="mt-1 text-[10px] text-blue-100">
                                                CHIMULIA PRESS - Layanan Profesional
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setActiveService(null)}
                                        aria-label="Tutup pop-up"
                                        className="rounded-full p-2 text-xl text-white/80 transition hover:bg-white/20 hover:text-white"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* ISI POP-UP */}
                                <div className="max-h-[75vh] overflow-y-auto p-4 sm:p-5">

                                    {activeService.id === 'penerbitan' ? (
                                        <>
                                            <p className="mb-4 text-xs leading-5 text-slate-500">
                                                Pilih skema penerbitan yang sesuai dengan kebutuhan dan rencana penerbitan buku Anda.
                                            </p>

                                            {/* TAB PILIHAN */}
                                            <div className="mb-4 flex rounded-full bg-slate-100 p-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setPricingTab('putus')}
                                                    className={`flex-1 rounded-full px-3 py-2 text-xs font-bold transition ${
                                                        pricingTab === 'putus'
                                                            ? 'bg-blue-600 text-white shadow'
                                                            : 'text-slate-500 hover:text-blue-600'
                                                    }`}
                                                >
                                                    ▣ Beli Putus
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setPricingTab('royalti')}
                                                    className={`flex-1 rounded-full px-3 py-2 text-xs font-bold transition ${
                                                        pricingTab === 'royalti'
                                                            ? 'bg-blue-600 text-white shadow'
                                                            : 'text-slate-500 hover:text-blue-600'
                                                    }`}
                                                >
                                                    % Skema Royalti
                                                </button>
                                            </div>

                                            {pricingTab === 'putus' ? (
                                                <>
                                                    <div className="grid gap-3 sm:grid-cols-3">

                                                        {[
                                                            {
                                                                name: 'Basic',
                                                                price: 'Rp 500rb',
                                                                description: 'Cocok untuk pemula',
                                                                features: [
                                                                    'ISBN resmi Perpusnas',
                                                                    'Layout standar',
                                                                    'Desain cover standar',
                                                                    '5 buku cetak',
                                                                    'Sertifikat ISBN',
                                                                ],
                                                                unavailable: [
                                                                    'Editing bahasa',
                                                                    'Pengurusan HAKI',
                                                                ],
                                                            },
                                                            {
                                                                name: 'Standard',
                                                                price: 'Rp 1,5jt',
                                                                description: 'Paling banyak dipilih',
                                                                popular: true,
                                                                features: [
                                                                    'ISBN resmi Perpusnas',
                                                                    'Layout UNESCO',
                                                                    'Desain cover profesional',
                                                                    '10 buku cetak',
                                                                    'Sertifikat ISBN',
                                                                    '1x revisi',
                                                                ],
                                                                unavailable: [
                                                                    'Pengurusan HAKI',
                                                                ],
                                                            },
                                                            {
                                                                name: 'Premium',
                                                                price: 'Rp 3jt',
                                                                description: 'Lengkap & profesional',
                                                                features: [
                                                                    'Semua fitur Standard',
                                                                    'Proofreading menyeluruh',
                                                                    'Desain cover premium',
                                                                    '20 buku cetak',
                                                                    '3x revisi',
                                                                    'Pengurusan HAKI',
                                                                    'Konsultasi intensif',
                                                                ],
                                                                unavailable: [],
                                                            },
                                                        ].map((plan) => (
                                                            <div
                                                                key={plan.name}
                                                                className={`relative flex flex-col rounded-xl border p-3 ${
                                                                    plan.popular
                                                                        ? 'border-blue-600 shadow-md'
                                                                        : 'border-slate-200'
                                                                }`}
                                                            >
                                                                {plan.popular && (
                                                                    <span className="absolute -top-2.5 right-2 rounded-full bg-blue-600 px-2 py-1 text-[9px] font-bold text-white">
                                                                        ★ POPULER
                                                                    </span>
                                                                )}

                                                                <span className="w-fit rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-semibold text-slate-600">
                                                                    {plan.name}
                                                                </span>

                                                                <h4 className="mt-2 text-xl font-extrabold text-blue-600">
                                                                    {plan.price}
                                                                </h4>

                                                                <p className="mt-1 min-h-8 text-[10px] text-slate-500">
                                                                    {plan.description}
                                                                </p>

                                                                <ul className="mt-3 space-y-2 text-[10px] leading-4 text-slate-600">
                                                                    {plan.features.map((feature) => (
                                                                        <li key={feature} className="flex gap-1.5">
                                                                            <span className="font-bold text-green-600">●</span>
                                                                            <span>{feature}</span>
                                                                        </li>
                                                                    ))}

                                                                    {plan.unavailable.map((feature) => (
                                                                        <li key={feature} className="flex gap-1.5 text-slate-400">
                                                                            <span>⊗</span>
                                                                            <span>{feature}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>

                                                                <a
                                                                    href={`https://wa.me/6285337185881?text=${encodeURIComponent(`Halo CHIMULIA PRESS, saya tertarik dengan paket ${plan.name} penerbitan buku.`)}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="mt-4 rounded-lg bg-blue-600 px-2 py-2 text-center text-[10px] font-bold text-white transition hover:bg-blue-700"
                                                                >
                                                                    Pilih Paket
                                                                </a>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-[10px] leading-5 text-slate-600">
                                                        <span className="font-bold text-amber-500">◷</span>
                                                        <strong> Estimasi waktu:</strong> 4–8 minggu (tergantung paket).
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {/* DESKRIPSI ROYALTI */}
                                                    <p className="mb-4 text-[10px] leading-5 text-slate-500">
                                                        <span className="mr-1 text-slate-400">ⓘ</span>
                                                        Tanpa biaya penerbitan. Penulis dapat <strong>royalti 10%</strong> dari setiap buku yang terjual.
                                                    </p>

                                                    {/* PANEL ROYALTI */}
                                                    <div className="grid gap-3 sm:grid-cols-2">

                                                        {/* ALUR SKEMA ROYALTI */}
                                                        <div className="rounded-xl bg-slate-50 p-4">
                                                            <h4 className="flex items-center gap-2 text-xs font-extrabold text-slate-700">
                                                                <span className="text-blue-600">♧</span>
                                                                Bagaimana Skema Royalti Bekerja?
                                                            </h4>

                                                            <div className="mt-4 space-y-4">
                                                                {[
                                                                    {
                                                                        title: 'Penulis kirim naskah',
                                                                        description: 'Naskah lolos kurasi & review editor',
                                                                    },
                                                                    {
                                                                        title: 'Press biayai produksi',
                                                                        description: 'ISBN, layout, cover, cetak—semua gratis',
                                                                    },
                                                                    {
                                                                        title: 'Buku dijual & didistribusikan',
                                                                        description: 'Melalui marketplace, toko buku, dan event',
                                                                    },
                                                                    {
                                                                        title: 'Penulis terima royalti',
                                                                        description: 'Dibayarkan setiap 6 bulan',
                                                                    },
                                                                ].map((step, index) => (
                                                                    <div key={step.title} className="flex gap-2.5">
                                                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                                                                            {index + 1}
                                                                        </span>

                                                                        <div>
                                                                            <h5 className="text-[10px] font-bold text-slate-700">
                                                                                {step.title}
                                                                            </h5>
                                                                            <p className="mt-0.5 text-[9px] leading-4 text-slate-500">
                                                                                {step.description}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* INFORMASI PERSENTASE ROYALTI */}
                                                        <div className="relative rounded-xl border border-green-600 bg-gradient-to-br from-green-50 to-white p-4">

                                                            <span className="absolute right-2 top-2 rounded-full bg-green-700 px-2 py-1 text-[8px] font-bold text-white">
                                                                ★ REKOMENDASI
                                                            </span>

                                                            <h4 className="flex items-center gap-2 text-xs font-extrabold text-green-700">
                                                                <span>％</span>
                                                                Skema Royalti
                                                            </h4>

                                                            <div className="my-5 text-center">
                                                                <h3 className="text-4xl font-extrabold tracking-tight text-green-700 sm:text-5xl">
                                                                    10%
                                                                </h3>
                                                                <p className="mt-1 text-[10px] text-slate-500">
                                                                    Royalti per buku terjual
                                                                </p>
                                                            </div>

                                                            <ul className="space-y-2 text-[9px] leading-4 text-slate-600">
                                                                {[
                                                                    'Biaya penerbitan GRATIS',
                                                                    'Hak cipta tetap milik penulis',
                                                                    '10 eksemplar gratis untuk penulis',
                                                                    'E-book dikembangkan Press',
                                                                    'Promosi oleh Press',
                                                                    'Kontrak 5 tahun',
                                                                    'Royalti dibayar per 6 bulan',
                                                                ].map((feature) => (
                                                                    <li key={feature} className="flex items-start gap-1.5">
                                                                        <span className="font-bold text-green-600">●</span>
                                                                        <span>{feature}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    {/* SYARAT ROYALTI */}
                                                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                                                        <h4 className="flex items-center gap-1.5 text-[10px] font-extrabold text-amber-600">
                                                            <span>ⓘ</span>
                                                            Syarat Skema Royalti:
                                                        </h4>

                                                        <ul className="mt-2 list-disc space-y-1 pl-4 text-[9px] leading-4 text-slate-600">
                                                            <li>Naskah lolos kurasi & review editor HUMANIS Press</li>
                                                            <li>Minimal 100 halaman</li>
                                                            <li>Belum pernah diterbitkan penerbit lain</li>
                                                            <li>Penulis menyerahkan hak distribusi ke Press selama 5 tahun</li>
                                                        </ul>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (

                                        <div>
                                            {/* DESKRIPSI LAYANAN */}
                                            <p className="mb-4 text-[10px] leading-5 text-slate-500">
                                                <span className="mr-1 text-slate-400">ⓘ</span>
                                                {activeService.id === 'isbn'
                                                    ? <>ISBN untuk buku cetak & E-ISBN untuk buku digital. Proses <strong>3–7 hari kerja.</strong></>
                                                    : <>Perlindungan hukum untuk karya intelektual Anda. Proses <strong>1–3 bulan.</strong></>}
                                            </p>

                                            {/* DAFTAR PAKET */}
                                            <div className={`grid gap-3 ${activeService.id === 'isbn' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                                                {(activeService.id === 'isbn'
                                                    ? [
                                                        {
                                                            name: 'ISBN Saja',
                                                            price: 'Rp 300rb',
                                                            description: 'Untuk buku cetak saja',
                                                            features: [
                                                                '1 ISBN buku cetak',
                                                                'Sertifikat ISBN',
                                                                'Barcode cetak',
                                                                'Input Perpusnas',
                                                            ],
                                                        },
                                                        {
                                                            name: 'ISBN + E-ISBN',
                                                            price: 'Rp 500rb',
                                                            description: 'Buku cetak + digital',
                                                            popular: true,
                                                            features: [
                                                                'ISBN cetak + E-ISBN',
                                                                'Sertifikat lengkap',
                                                                'Barcode cetak',
                                                                'Input Perpusnas',
                                                                'Verifikasi 2x',
                                                            ],
                                                        },
                                                        {
                                                            name: 'Paket Lengkap',
                                                            price: 'Rp 750rb',
                                                            description: 'Lengkap + HAKI',
                                                            features: [
                                                                'Semua fitur ISBN + E-ISBN',
                                                                'Pengurusan HAKI',
                                                                'Konsultasi penerbitan',
                                                                'Prioritas proses',
                                                            ],
                                                        },
                                                    ]
                                                    : [
                                                        {
                                                            name: 'Hak Cipta Buku',
                                                            price: 'Rp 500rb',
                                                            description: 'Untuk perlindungan naskah buku',
                                                            popular: true,
                                                            features: [
                                                                'Pendaftaran Hak Cipta',
                                                                'Sertifikat DJKI',
                                                                'Pendampingan proses',
                                                                'Konsultasi HKI',
                                                            ],
                                                        },
                                                        {
                                                            name: 'Hak Cipta + Merek',
                                                            price: 'Rp 2,5jt',
                                                            description: 'Lengkap untuk buku + merek dagang',
                                                            features: [
                                                                'Hak Cipta buku',
                                                                'Pendaftaran merek',
                                                                'Konsultasi HKI',
                                                                'Prioritas proses',
                                                            ],
                                                        },
                                                    ]
                                                ).map((plan) => (
                                                    <div
                                                        key={plan.name}
                                                        className={`relative flex flex-col rounded-xl border p-3 transition hover:shadow-md ${
                                                            plan.popular
                                                                ? activeService.id === 'isbn'
                                                                    ? 'border-amber-400 shadow-md'
                                                                    : 'border-cyan-400 shadow-md'
                                                                : 'border-slate-200'
                                                        }`}
                                                    >
                                                        {/* LABEL POPULER */}
                                                        {plan.popular && (
                                                            <span className={`absolute -top-2.5 right-2 rounded-full px-2 py-1 text-[8px] font-bold text-white ${
                                                                activeService.id === 'isbn'
                                                                    ? 'bg-amber-500'
                                                                    : 'bg-cyan-500'
                                                            }`}>
                                                                ★ POPULER
                                                            </span>
                                                        )}

                                                        <span className="w-fit rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-semibold text-slate-600">
                                                            {plan.name}
                                                        </span>

                                                        <h4 className={`mt-2 text-xl font-extrabold ${
                                                            activeService.id === 'isbn'
                                                                ? 'text-amber-500'
                                                                : 'text-cyan-500'
                                                        }`}>
                                                            {plan.price}
                                                        </h4>

                                                        <p className="mt-1 min-h-8 text-[9px] leading-4 text-slate-500">
                                                            {plan.description}
                                                        </p>

                                                        {/* FITUR PAKET */}
                                                        <ul className="mt-3 flex-1 space-y-2 text-[9px] leading-4 text-slate-600">
                                                            {plan.features.map((feature) => (
                                                                <li key={feature} className="flex items-start gap-1.5">
                                                                    <span className="font-bold text-green-600">●</span>
                                                                    <span>{feature}</span>
                                                                </li>
                                                            ))}
                                                        </ul>

                                                        {/* TOMBOL PILIH PAKET */}
                                                        <a
                                                            href={`https://wa.me/6285337185881?text=${encodeURIComponent(
                                                                `Halo CHIMULIA PRESS, saya tertarik dengan paket ${plan.name} untuk layanan ${activeService.title}. Mohon informasi lebih lanjut.`
                                                            )}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={`mt-4 rounded-lg px-2 py-2 text-center text-[10px] font-bold text-white transition ${
                                                                activeService.id === 'isbn'
                                                                    ? 'bg-amber-500 hover:bg-amber-600'
                                                                    : 'bg-cyan-500 hover:bg-cyan-600'
                                                            }`}
                                                        >
                                                            Pilih Paket
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* ESTIMASI WAKTU */}
                                            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-[10px] leading-5 text-slate-600">
                                                <span className={`font-bold ${
                                                    activeService.id === 'isbn'
                                                        ? 'text-amber-500'
                                                        : 'text-cyan-500'
                                                }`}>
                                                    ◷
                                                </span>

                                                <strong> Estimasi waktu:</strong>{' '}
                                                {activeService.id === 'isbn'
                                                    ? '3–7 hari kerja setelah dokumen lengkap.'
                                                    : '1–3 bulan setelah dokumen lengkap.'}
                                            </div>
                                        </div>

                                    )}


                                    {/* TOMBOL KONSULTASI */}
                                    <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">

                                        <button
                                            type="button"
                                            onClick={() => setActiveService(null)}
                                            className="rounded-full bg-slate-200 px-5 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-300"
                                        >
                                            Tutup
                                        </button>

                                        <a
                                            href={`https://wa.me/6285337185881?text=${encodeURIComponent(
                                                `Halo CHIMULIA PRESS, saya ingin berkonsultasi mengenai layanan ${activeService.title}.`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`rounded-full px-5 py-2.5 text-center text-xs font-bold text-white transition ${
                                                activeService.id === 'isbn'
                                                    ? 'bg-amber-500 hover:bg-amber-600'
                                                    : activeService.id === 'hki'
                                                        ? 'bg-green-600 hover:bg-green-700'
                                                        : 'bg-green-600 hover:bg-green-700'
                                            }`}
                                        >
                                            ◉{' '}
                                            {activeService.id === 'isbn'
                                                ? 'Konsultasi ISBN'
                                                : activeService.id === 'hki'
                                                    ? 'Konsultasi HKI'
                                                    : 'Konsultasi Sekarang'}
                                        </a>

                                    </div>


                                </div>
                            </div>
                        </div>
                    )}


                    {/* KATALOG */}
                    <section id="katalog" className="scroll-mt-20 bg-white py-12 sm:py-14">
                        <div className="mx-auto max-w-7xl px-5 sm:px-8">
                            <div className="rounded-[2rem] bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-8">
                                <div className="grid gap-6 lg:grid-cols-[.75fr_1.6fr] lg:items-center">
                                    <div>
                                        <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#073875]"><span className="h-0.5 w-7 bg-amber-400" /> Koleksi Terbitan</p>
                                        <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#082f5c] sm:text-4xl">Katalog Buku CHIMULIA PRESS</h2>
                                        <p className="mt-3 text-sm leading-6 text-slate-600">Jelajahi koleksi buku terbaru kami, dari referensi ilmiah hingga buku pendidikan.</p>
                                        <Link href="/katalog-buku" className="mt-5 inline-flex rounded-full bg-[#073875] px-5 py-3 text-xs font-bold text-white transition hover:bg-blue-900">
                                            Lihat Semua Buku <span className="ml-2">→</span>
                                        </Link>
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            <select
                                                value={selectedBookCategory}
                                                onChange={(event) => setSelectedBookCategory(event.target.value)}
                                                aria-label="Filter kategori buku"
                                                className="max-w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-500"
                                            >
                                                <option value="">Semua Kategori</option>
                                                {bookCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => setBestSellerOnly((current) => !current)}
                                                aria-pressed={bestSellerOnly}
                                                className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${bestSellerOnly ? 'border-amber-500 bg-amber-400 text-slate-900' : 'border-amber-200 bg-white text-amber-700 hover:bg-amber-50'}`}
                                            >
                                                ★ Best Seller
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        {filteredBooks.length > 0 ? (
                                            <div className="flex snap-x gap-4 overflow-x-auto pb-3">
                                                {filteredBooks.map((book) => (
                                                    <article key={book.id} className="flex w-[205px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:w-[220px]">
                                                        <div className="relative">
                                                        <Link
                                                            href={route('public.books.show', book.slug)}
                                                            className="flex h-48 items-center justify-center bg-slate-50 p-3"
                                                        >
                                                            {book.cover_image ? (
                                                                <img
                                                                    src={`/storage/${book.cover_image}`}
                                                                    alt={`Sampul ${book.title}`}
                                                                    loading="lazy"
                                                                    className="h-full w-full object-contain"
                                                                />
                                                            ) : (
                                                                <span className="text-xs text-slate-400">
                                                                    Sampul belum tersedia
                                                                </span>
                                                            )}
                                                        </Link>

                                                        <div className="absolute right-2 top-2 flex flex-col items-end gap-2">
                                                            {book.is_best_seller && (
                                                                <span className="rounded-full bg-amber-200 px-3 py-1 text-[10px] font-bold text-[#0b3a70] shadow-sm">
                                                                    ★ Best Seller
                                                                </span>
                                                            )}

                                                            {book.is_external_publication && (
                                                                <span className="rounded-full bg-sky-100 px-3 py-1 text-[10px] font-bold text-sky-800 shadow-sm">
                                                                    Terbitan Luar
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    </article>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                                                <p className="font-semibold text-slate-700">Buku tidak ditemukan.</p>
                                                <p className="mt-2 text-sm text-slate-500">Coba pilih kategori lain atau nonaktifkan filter Best Seller.</p>
                                                <button type="button" onClick={() => { setSelectedBookCategory(''); setBestSellerOnly(false); }} className="mt-4 rounded-full bg-blue-800 px-4 py-2 text-xs font-semibold text-white">Tampilkan Semua Buku</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* NEWS & DOKUMENTASI: TETAP DI HALAMAN UTAMA */}
                    <section className="bg-slate-50 py-12 sm:py-14">
                        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1.2fr_.95fr]">
                            <div id="event" className="scroll-mt-24">
                                <div className="mb-5">
                                    <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#073875]"><span className="h-0.5 w-7 bg-amber-400" /> News &amp; Events</p>
                                    <h2 className="mt-2 text-2xl font-extrabold text-[#082f5c] sm:text-3xl">Informasi Terbaru</h2>
                                </div>
                                {visibleEvents.length > 0 ? (
                                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                        {visibleEvents.map((event) => {
                                            const typeLabels = { upcoming: 'Event Mendatang', news: 'Berita', open_program: 'Program Terbuka' };
                                            const buttonLabels = { upcoming: 'Daftar Acara', news: 'Lihat Katalog', open_program: 'Kirim Naskah' };
                                            return (
                                                <article key={event.id} className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                                    {event.cover_image && <img src={`/storage/${event.cover_image}`} alt={event.title} className="h-32 w-full object-cover" loading="lazy" />}
                                                    <div className="p-3">
                                                        <span className="inline-block rounded-full bg-[#073875] px-2 py-1 text-[9px] font-bold text-white">{event.event_date ? new Date(`${String(event.event_date).substring(0, 10)}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : (typeLabels[event.type] || event.type)}</span>
                                                        <h3 className="mt-2 line-clamp-2 text-xs font-extrabold leading-5 text-[#082f5c]">{event.title}</h3>
                                                        {event.description && <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-slate-500">{event.description}</p>}
                                                        {event.type === 'upcoming' && event.registration_url && (
                                                            <a href={event.registration_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-[10px] font-bold text-blue-700 hover:underline">{buttonLabels.upcoming} →</a>
                                                        )}
                                                        {event.type === 'news' && <a href="/katalog-buku" className="mt-3 inline-flex text-[10px] font-bold text-[#073875] hover:underline">{buttonLabels.news} →</a>}
                                                        {event.type === 'open_program' && <a href="#pengajuan" className="mt-3 inline-flex text-[10px] font-bold text-blue-700 hover:underline">{buttonLabels.open_program} →</a>}
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center">
                                        <p className="text-sm font-semibold text-slate-700">Belum Ada Informasi Terkini</p>
                                        <p className="mt-2 text-xs text-slate-500">Informasi event, berita, dan program terbaru akan ditampilkan di sini.</p>
                                    </div>
                                )}
                            </div>

                            <div id="dokumentasi" className="scroll-mt-24 border-t border-slate-200 pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                                <div className="mb-5">
                                    <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#073875]"><span className="h-0.5 w-7 bg-amber-400" /> Dokumentasi</p>
                                    <h2 className="mt-2 text-2xl font-extrabold text-[#082f5c] sm:text-3xl">Galeri Kegiatan</h2>
                                </div>
                                {visibleDocumentations.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                        {visibleDocumentations.map((item) => (
                                            <article key={item.id} className="group relative overflow-hidden rounded-xl bg-slate-200 shadow-sm">
                                                {item.type === 'photo' ? (
                                                    <img src={`/storage/${item.file_path}`} alt={item.title} loading="lazy" className="h-28 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-32" />
                                                ) : (
                                                    <video src={`/storage/${item.file_path}`} controls preload="metadata" className="h-28 w-full bg-black object-cover sm:h-32">
                                                        Browser tidak mendukung pemutaran video.
                                                    </video>
                                                )}
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2 pb-2 pt-6">
                                                    <p className="line-clamp-1 text-[10px] font-semibold text-white">{item.title}</p>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center">
                                        <p className="text-sm font-semibold text-slate-700">Dokumentasi segera hadir.</p>
                                        <p className="mt-2 text-xs text-slate-500">Foto dan video kegiatan akan ditampilkan di sini.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </main>


                {/* FOOTER */}
                <footer id="kontak" className="relative overflow-hidden bg-[#062d59] text-white">

                    {/* Garis dekoratif atas */}
                    <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-amber-300 via-blue-500 to-amber-300" />

                    {/* Konten Footer */}
                    <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 pb-10 pt-12 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.2fr] lg:gap-12">

                        {/* KOLOM 1: LOGO DAN MEDIA SOSIAL */}
                        <div className="flex flex-col items-start">
                            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.45rem]">
                                    Center for Cultural Impact in <span className="text-amber-300">Mathematics Learning</span>
                                </h1>

                            <p className="mt-4 text-base font-bold tracking-wide text-blue-50 sm:text-lg">
                                    Culture <span className="px-2 text-amber-300">•</span> Innovation <span className="px-2 text-amber-300">•</span> Mathematics Learning
                            </p>

                            <div className="mt-5 flex gap-2">
                                <a
                                    href="mailto:chimulia138@gmail.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Email"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition duration-300 hover:-translate-y-1 hover:bg-amber-300"
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
                                    aria-label="Instagram"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition duration-300 hover:-translate-y-1 hover:bg-amber-300"
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
                                    aria-label="WhatsApp"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition duration-300 hover:-translate-y-1 hover:bg-amber-300"
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
                                    aria-label="Website"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition duration-300 hover:-translate-y-1 hover:bg-amber-300"
                                >
                                    <img
                                        src="/images/website-icon.svg"
                                        alt=""
                                        className="h-5 w-5 object-contain"
                                    />
                                </a>
                            </div>
                        </div>

                        {/* KOLOM 2: TAUTAN CEPAT */}
                        <div className="border-t border-white/15 pt-6 lg:border-l lg:border-t-0 lg:pl-20 lg:pt-0">
                            <h3 className="text-sm font-extrabold uppercase tracking-wide text-amber-300">
                                Tautan Cepat
                            </h3>

                            <ul className="mt-4 space-y-3 text-xs text-blue-100">
                                {[
                                    ["Tentang Kami", "#tentang"],
                                    ["Katalog Buku", "#katalog"],
                                    ["Event", "#event"],
                                    ["Pengajuan Naskah", "#pengajuan"],
                                    ["Kontak", "#kontak"],
                                ].map(([label, href]) => (
                                    <li key={label}>
                                        <a
                                            href={href}
                                            className="inline-block transition duration-200 hover:translate-x-1 hover:text-amber-300"
                                        >
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* KOLOM 3: HUBUNGI KAMI */}
                        <div className="border-t border-white/15 pt-6 lg:border-l lg:border-t-0 lg:pl-20 lg:pt-0">
                            <h3 className="text-sm font-extrabold uppercase tracking-wide text-amber-300">
                                Hubungi Kami
                            </h3>

                            <ul className="mt-4 space-y-3 text-xs leading-5 text-blue-100">
                                <li className="font-medium text-white">
                                    Informasi Kontak
                                </li>

                                <li className="flex items-start gap-2">
                                    <span className="text-base text-amber-300">⌖</span>
                                    <span>Yogyakarta, Indonesia</span>
                                </li>

                                <li className="flex items-center gap-2">
                                    <img
                                        src="/images/email-icon.svg"
                                        alt=""
                                        className="h-4 w-4 object-contain"
                                    />
                                    <a
                                        href="mailto:chimulia138@gmail.com"
                                        className="transition hover:text-amber-300"
                                    >
                                        chimulia138@gmail.com
                                    </a>
                                </li>

                                <li className="flex items-center gap-2">
                                    <img
                                        src="/images/instagram-icon.svg"
                                        alt=""
                                        className="h-4 w-4 object-contain"
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

                                <li className="flex items-center gap-2">
                                    <img
                                        src="/images/wa-icon.svg"
                                        alt=""
                                        className="h-4 w-4 object-contain"
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

                                <li className="flex items-center gap-2">
                                    <img
                                        src="/images/website-icon.svg"
                                        alt=""
                                        className="h-4 w-4 object-contain"
                                    />
                                    <a
                                        href="https://press.chimuliacenter.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transition hover:text-amber-300"
                                    >
                                        press.chimuliacenter.com
                                    </a>
                                </li>
                            </ul>

                            <a
                                href="mailto:chimulia138@gmail.com"
                                className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 text-xs font-bold text-[#062d59] transition hover:-translate-y-1 hover:bg-amber-200"
                            >
                                Kontak Kami <span>→</span>
                            </a>
                        </div>

                    </div>

                    {/* COPYRIGHT */}
                    <div className="border-t border-white/15 bg-[#042449]">
                        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-[11px] text-blue-100 sm:flex-row sm:items-center sm:justify-between sm:px-8">

                            <span>
                                © {new Date().getFullYear()} CHIMULIA PRESS. All rights reserved.
                            </span>

                            <div className="flex flex-wrap gap-4">
                                <a href="#kontak" className="transition hover:text-amber-300">
                                    Kebijakan Privasi
                                </a>

                                <span className="text-white/30">|</span>

                                <a href="#kontak" className="transition hover:text-amber-300">
                                    Syarat &amp; Ketentuan
                                </a>
                            </div>

                        </div>
                    </div>

                </footer>

            </div>
        </>
    );
}
