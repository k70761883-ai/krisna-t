import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  AddOn,
  Profile,
  Client,
  Project,
  Transaction,
  Lead,
  Card,
  PromoCode,
  Notification,
  VendorPortfolio,
  VendorProfile,
} from '../../types';
import {
  WhatsappIcon,
  CheckIcon,
  PackageIcon,
  CalendarIcon,
  UsersIcon,
  MessageSquareIcon,
} from '../../constants';
import {
  Camera,
  ExternalLink,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Check,
  Instagram,
  Phone,
  Layers,
  Heart,
} from 'lucide-react';
import { getVendorProfile } from '../../services/vendorProfile';
import { listVendorPortfolios } from '../../services/vendorPortfolios';
import PublicBookingForm from '../../features/public/components/PublicBookingForm';

export interface PublicShowcaseHubProps {
  packages: Package[];
  addOns: AddOn[];
  profile: Profile;
  clients: Client[];
  projects: Project[];
  transactions: Transaction[];
  cards: Card[];
  leads: Lead[];
  pockets: any[];
  promoCodes: PromoCode[];
  showNotification: (msg: string, duration?: number) => void;
  addNotification: (
    newNotificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>,
  ) => Promise<void>;
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  setPockets: React.Dispatch<React.SetStateAction<any[]>>;
  setPromoCodes: React.Dispatch<React.SetStateAction<PromoCode[]>>;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const PublicShowcaseHub: React.FC<PublicShowcaseHubProps> = ({
  packages = [],
  addOns = [],
  profile,
  clients = [],
  projects = [],
  transactions = [],
  cards = [],
  leads = [],
  pockets = [],
  promoCodes = [],
  showNotification,
  addNotification,
  setClients,
  setProjects,
  setTransactions,
  setCards,
  setLeads,
  setPockets,
  setPromoCodes,
}) => {
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [portfolios, setPortfolios] = useState<VendorPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [vProfile, vPortfolios] = await Promise.all([
          getVendorProfile(),
          listVendorPortfolios(),
        ]);
        if (isMounted) {
          if (vProfile) setVendorProfile(vProfile);
          if (vPortfolios) setPortfolios(vPortfolios);
        }
      } catch (e) {
        console.error('Error loading showcase data:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const studioName =
    vendorProfile?.hero_title || profile?.companyName || profile?.fullName || 'Vena Pictures';
  const subtitle =
    vendorProfile?.hero_subtitle ||
    'Dokumentasi Pernikahan & Momen Abadi yang Penuh Cerita dan Rasa Cinta.';
  const waNumber = vendorProfile?.whatsapp_number || profile?.phone || '';
  const waUrl = waNumber ? `https://wa.me/${waNumber.replace(/\D/g, '')}` : null;

  // Smooth scroll to section helper
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Categories for portfolio
  const categories = useMemo(() => {
    const set = new Set<string>();
    portfolios.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['Semua', ...Array.from(set)];
  }, [portfolios]);

  const filteredPortfolios = useMemo(() => {
    if (activeCategory === 'Semua') return portfolios;
    return portfolios.filter((p) => p.category === activeCategory);
  }, [portfolios, activeCategory]);

  return (
    <div
      className="min-h-screen bg-[#faf8f5] text-[#2c241d]"
      style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
    >
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ─── Sticky Elegant Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#e6ded5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer text-left"
          >
            <span className="text-xl sm:text-2xl font-normal tracking-wide text-[#3d2e22]">
              {studioName}
            </span>
          </button>

          <div
            className="hidden md:flex items-center gap-6 text-xs uppercase tracking-[0.18em]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <button
              onClick={() => scrollTo('links')}
              className="text-[#7d6856] hover:text-[#3d2e22] transition-colors bg-transparent border-none cursor-pointer"
            >
              Tautan Cepat
            </button>
            <button
              onClick={() => scrollTo('packages')}
              className="text-[#7d6856] hover:text-[#3d2e22] transition-colors bg-transparent border-none cursor-pointer"
            >
              Katalog Paket
            </button>
            <button
              onClick={() => scrollTo('portfolio')}
              className="text-[#7d6856] hover:text-[#3d2e22] transition-colors bg-transparent border-none cursor-pointer"
            >
              Portofolio
            </button>
            <button
              onClick={() => scrollTo('booking')}
              className="px-4 py-2 rounded-full bg-[#c9a87c] hover:bg-[#b8956a] text-[#2c2016] font-semibold transition-all shadow-sm"
            >
              Booking Online
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => scrollTo('booking')}
              className="px-3 py-1.5 rounded-full bg-[#c9a87c] text-[#2c2016] text-[11px] font-semibold uppercase tracking-wider"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Booking
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section
        id="hero"
        className="relative pt-28 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-[#f3ece2] to-[#faf8f5]"
      >
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#d8ccbe] text-xs uppercase tracking-[0.25em] text-[#8a7260] shadow-sm"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c9a87c]" />
            Official Studio Showcase & Booking
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-light text-[#2d2218] leading-tight">
            {studioName}
          </h1>

          <p className="text-base sm:text-xl text-[#6b5a4d] max-w-2xl mx-auto font-light leading-relaxed">
            {subtitle}
          </p>

          <div
            className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs font-semibold uppercase tracking-wider"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-white hover:bg-[#1EBE5D] transition-all shadow-md"
              >
                <WhatsappIcon className="w-4 h-4 text-white" />
                Chat WhatsApp
              </a>
            )}
            <button
              onClick={() => scrollTo('packages')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#3d2e22] text-white hover:bg-[#2a1f16] transition-all shadow-md"
            >
              <PackageIcon className="w-4 h-4" />
              Pilihan Paket
            </button>
            <button
              onClick={() => scrollTo('portfolio')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-[#d8ccbe] text-[#3d2e22] hover:bg-[#f2ece3] transition-all"
            >
              <Camera className="w-4 h-4" />
              Galeri Portofolio
            </button>
          </div>
        </div>
      </section>

      {/* ─── Section 1: Daftar Tautan Cepat (Linktree Style Quick Links) ─── */}
      <section id="links" className="py-12 sm:py-16 px-4 sm:px-6 bg-[#faf8f5] border-t border-[#eee6dc]">
        <div className="max-w-2xl mx-auto space-y-4 text-center">
          <p
            className="text-xs text-[#c9a87c] uppercase tracking-[0.3em] font-semibold"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Daftar Tautan Publik
          </p>
          <h2 className="text-2xl sm:text-3xl font-light text-[#2d2218]">
            Akses Cepat & Informasi Studio
          </h2>

          <div
            className="space-y-3 pt-4 text-left font-sans text-xs tracking-wide"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <button
              onClick={() => scrollTo('packages')}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-[#f6efe7] border border-[#e4dcd2] shadow-sm transition-all hover:scale-[1.01] text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#c9a87c]/20 text-[#8a6840] flex items-center justify-center shrink-0">
                  <PackageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2d2218]">Katalog Paket & Pricelist</h3>
                  <p className="text-[11px] text-[#7d6856]">Lihat rincian paket, harga, dan layanan tambahan</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8a7260]" />
            </button>

            <button
              onClick={() => scrollTo('portfolio')}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-[#f6efe7] border border-[#e4dcd2] shadow-sm transition-all hover:scale-[1.01] text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#7d6856]/20 text-[#544334] flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2d2218]">Galeri Portofolio Hasil Foto/Video</h3>
                  <p className="text-[11px] text-[#7d6856]">Koleksi dokumentasi acara pernikahan pengantin</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8a7260]" />
            </button>

            <button
              onClick={() => scrollTo('booking')}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#c9a87c]/20 to-white hover:from-[#c9a87c]/30 border border-[#c9a87c]/50 shadow-sm transition-all hover:scale-[1.01] text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#c9a87c] text-[#2c2016] flex items-center justify-center shrink-0">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2d2218]">Formulir Reservasi & Booking Jadwal</h3>
                  <p className="text-[11px] text-[#7d6856]">Kunci tanggal wedding & amankan slot Anda sekarang</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#c9a87c]" />
            </button>

            <a
              href="#/public-lead-form"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-[#f6efe7] border border-[#e4dcd2] shadow-sm transition-all hover:scale-[1.01] text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <UsersIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2d2218]">Formulir Tanya Harga & Penawaran</h3>
                  <p className="text-[11px] text-[#7d6856]">Konsultasi konsep acara & penawaran khusus</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#8a7260]" />
            </a>

            <a
              href="#/feedback"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-[#f6efe7] border border-[#e4dcd2] shadow-sm transition-all hover:scale-[1.01] text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                  <MessageSquareIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2d2218]">Ulasan & Testimoni Klien</h3>
                  <p className="text-[11px] text-[#7d6856]">Kirim kritik, saran, dan apresiasi setelah acara</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#8a7260]" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── Section 2: Katalog Paket (Packages) ─── */}
      <section id="packages" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#f4eee6]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <p
              className="text-xs text-[#c9a87c] uppercase tracking-[0.3em] font-semibold"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Pricelist & Penawaran
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#2d2218]">
              Katalog Paket Pernikahan
            </h2>
            <p className="text-sm sm:text-base text-[#7d6856] max-w-xl mx-auto font-light">
              Pilihan paket dokumentasi foto dan sinematik yang dirancang untuk mengabadikan setiap momen bahagia Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5dcce] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#c9a87c]/20 text-[#7a582c]"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {pkg.region ? `Wilayah ${pkg.region}` : 'Wedding Package'}
                    </span>
                    <span
                      className="text-xs text-[#8a7260]"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {pkg.durationOptions?.[0]?.label || pkg.processingTime || ''}
                    </span>
                  </div>

                  <h3 className="text-2xl font-normal text-[#2d2218] mb-2">{pkg.name}</h3>

                  <div className="my-5 pb-5 border-b border-[#eee4d8]">
                    <span
                      className="text-xs text-[#8a7260] block font-medium"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Investasi Mulai
                    </span>
                    <span className="text-3xl font-light text-[#8a5d3b]">
                      {formatCurrency(pkg.price)}
                    </span>
                  </div>

                  <p className="text-sm text-[#7d6856] font-light mb-6 leading-relaxed">
                    {[pkg.photographers, pkg.videographers, pkg.processingTime].filter(Boolean).join(' · ') || pkg.category}
                  </p>

                  {(() => {
                    const items: string[] = [
                      ...(pkg.digitalItems || []),
                      ...(pkg.physicalItems || []).map((p) => p.name),
                    ];
                    if (items.length === 0) return null;
                    return (
                      <div className="space-y-2.5 mb-6">
                        <p
                          className="text-[11px] font-bold text-[#8a7260] uppercase tracking-wider"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          Paket Sudah Termasuk:
                        </p>
                        <ul className="space-y-2">
                          {items.map((d: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-xs text-[#4d3d30]"
                              style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                              <Check className="w-4 h-4 text-[#c9a87c] shrink-0 mt-0.5" />
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })()}
                </div>

                <div className="pt-4 border-t border-[#f0e8de] mt-auto">
                  <button
                    onClick={() => scrollTo('booking')}
                    className="w-full py-3 px-4 rounded-xl bg-[#3d2e22] hover:bg-[#251b14] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm text-center"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Pilih Paket Ini & Booking →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add-ons list */}
          {addOns.length > 0 && (
            <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#e5dcce]">
              <div className="text-center mb-6">
                <h3 className="text-xl font-normal text-[#2d2218]">
                  Pilihan Layanan Tambahan (Add-On)
                </h3>
                <p
                  className="text-xs text-[#8a7260] mt-1"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Dapat ditambahkan sesuai preferensi pernikahan Anda
                </p>
              </div>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {addOns.map((add) => (
                  <div
                    key={add.id}
                    className="p-3.5 bg-[#faf8f5] rounded-xl border border-[#e8dfd5] flex items-center justify-between"
                  >
                    <span className="text-xs font-medium text-[#3d2e22]">{add.name}</span>
                    <span className="text-xs font-bold text-[#8a5d3b]">
                      {formatCurrency(add.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Section 3: Portofolio Visual (Portfolio) ─── */}
      <section id="portfolio" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#faf8f5]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <p
              className="text-xs text-[#c9a87c] uppercase tracking-[0.3em] font-semibold"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Galeri Karya Kami
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#2d2218]">
              Wedding Portfolio
            </h2>
            <p className="text-sm sm:text-base text-[#7d6856] max-w-xl mx-auto font-light">
              Momen emosional, tawa, dan kebahagiaan yang berhasil kami abadikan dengan penuh kehangatan.
            </p>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div
              className="flex flex-wrap items-center justify-center gap-2"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#3d2e22] text-white font-semibold'
                      : 'bg-white border border-[#d8ccbe] text-[#7d6856] hover:text-[#3d2e22]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Portfolio Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#c9a87c] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredPortfolios.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPortfolios.map((item) => {
                const thumb =
                  item.cover_image_url ||
                  (item.images && item.images.length > 0 ? item.images[0].url : null);

                return (
                  <a
                    key={item.id}
                    href={`#/portfolio/${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block rounded-2xl overflow-hidden bg-[#eee6dc] shadow-sm hover:shadow-xl transition-all duration-500"
                    style={{ aspectRatio: '4/3' }}
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#8a7260]">
                        <Camera className="w-8 h-8 mb-2 opacity-40" />
                        <span className="text-xs">No Cover Image</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <span
                        className="text-[10px] tracking-[0.2em] uppercase font-semibold text-amber-200 block mb-1"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {item.category || 'Wedding'}
                      </span>
                      <h3 className="text-xl font-light text-white leading-tight mb-1">
                        {item.title}
                      </h3>
                      <p
                        className="text-xs text-white/70 font-light"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {item.images?.length || 0} Foto · Lihat Selengkapnya →
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-[#8a7260]">
              Belum ada portofolio dalam kategori ini.
            </div>
          )}
        </div>
      </section>

      {/* ─── Section 4: Formulir Booking Acara Pernikahan (Booking Form) ─── */}
      <section
        id="booking"
        className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-[#f4eee6] to-[#faf8f5] border-t border-[#e6ded5]"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <p
              className="text-xs text-[#c9a87c] uppercase tracking-[0.3em] font-semibold"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Reservasi Jadwal Mandiri
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#2d2218]">
              Formulir Booking Acara Pernikahan
            </h2>
            <p className="text-sm sm:text-base text-[#7d6856] max-w-xl mx-auto font-light">
              Lengkapi data pernikahan Anda di bawah ini untuk mengamankan tanggal spesial bersama tim profesional kami.
            </p>
          </div>

          <div
            className="bg-white rounded-3xl p-4 sm:p-8 md:p-10 shadow-lg border border-[#e5dcce]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <PublicBookingForm
              setClients={setClients}
              setProjects={setProjects}
              packages={packages}
              addOns={addOns}
              setTransactions={setTransactions}
              userProfile={profile}
              cards={cards}
              setCards={setCards}
              pockets={pockets}
              setPockets={setPockets}
              promoCodes={promoCodes}
              setPromoCodes={setPromoCodes}
              showNotification={showNotification}
              leads={leads}
              setLeads={setLeads}
              addNotification={addNotification}
            />
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-[#241a13] text-[#d6c9be] py-12 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h4 className="text-2xl font-light text-white tracking-widest">{studioName}</h4>
          <p
            className="text-xs text-[#a8998c] max-w-md mx-auto leading-relaxed"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Menciptakan karya visual pernikahan yang abadi dan tak lekang oleh waktu.
          </p>

          <div
            className="pt-6 border-t border-white/10 text-xs text-[#807267]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            © {new Date().getFullYear()} {studioName}. Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicShowcaseHub;
