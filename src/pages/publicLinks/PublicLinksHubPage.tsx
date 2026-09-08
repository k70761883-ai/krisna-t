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
  FinancialPocket,
  VendorPortfolio,
} from '../../types';
import {
  LinkIcon,
  QrCodeIcon,
  PackageIcon,
  UsersIcon,
  CalendarIcon,
  WhatsappIcon,
} from '../../constants';
import {
  Globe,
  ExternalLink,
  Copy,
  Check,
  Search,
  Camera,
  Eye,
  Download,
  FileText,
  MessageSquare,
  Sparkles,
  Layers,
} from 'lucide-react';
import Modal from '../../shared/ui/Modal';
import QrCodeDisplay from '../../shared/ui/QrCodeDisplay';
import { listVendorPortfolios } from '../../services/vendorPortfolios';
import PublicBookingForm from '../../features/public/components/PublicBookingForm';

export interface PublicLinksHubPageProps {
  packages: Package[];
  addOns: AddOn[];
  profile: Profile;
  clients: Client[];
  projects: Project[];
  transactions: Transaction[];
  cards: Card[];
  leads: Lead[];
  pockets: FinancialPocket[];
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
  onNavigateToView?: (view: any) => void;
}

interface PublicLinkItem {
  id: string;
  title: string;
  badge: string;
  category: 'utama' | 'paket' | 'booking' | 'klien';
  description: string;
  hash: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  isPopular?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const PublicLinksHubPage: React.FC<PublicLinksHubPageProps> = ({
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
  // Tabs: 'links' | 'packages' | 'portfolio' | 'booking'
  const [activeTab, setActiveTab] = useState<'links' | 'packages' | 'portfolio' | 'booking'>('links');

  // Portfolios
  const [portfolios, setPortfolios] = useState<VendorPortfolio[]>([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(false);
  const [selectedPortfolioCategory, setSelectedPortfolioCategory] = useState<string>('Semua');

  // Link copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Link search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'semua' | 'utama' | 'paket' | 'booking' | 'klien'>('semua');

  // Package search & region filter
  const [packageSearch, setPackageSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('Semua');

  // QR Modal
  const [qrModalData, setQrModalData] = useState<{ title: string; url: string } | null>(null);

  const baseUrl = useMemo(() => {
    return `${window.location.origin}${window.location.pathname}`;
  }, []);

  // Fetch portfolios for the portfolio tab
  useEffect(() => {
    let isMounted = true;
    const loadPortfolios = async () => {
      setLoadingPortfolios(true);
      try {
        const data = await listVendorPortfolios();
        if (isMounted) {
          setPortfolios(data || []);
        }
      } catch (err) {
        console.error('Error loading portfolios in PublicLinksHubPage:', err);
      } finally {
        if (isMounted) setLoadingPortfolios(false);
      }
    };
    loadPortfolios();
    return () => {
      isMounted = false;
    };
  }, []);

  // List of all Public Links
  const publicLinks: PublicLinkItem[] = useMemo(() => {
    return [
      {
        id: 'showcase',
        title: 'Showcase & Hub Publik All-in-One',
        badge: 'Rekomendasi Bio',
        category: 'utama',
        description: 'Halaman terpadu eksklusif untuk bio Instagram/WhatsApp. Menampilkan profil studio, katalog paket, portofolio foto, dan formulir booking online dalam 1 halaman.',
        hash: '#/showcase',
        icon: Globe,
        accentColor: 'from-amber-500 to-amber-700',
        isPopular: true,
      },
      {
        id: 'profile',
        title: 'Profil Vendor & Galeri Portofolio',
        badge: 'Landing Page',
        category: 'utama',
        description: 'Halaman profil publik studio dengan tampilan visual mewah, narasi tentang studio, dan etalase karya portofolio foto/video pernikahan.',
        hash: '#/profile',
        icon: Camera,
        accentColor: 'from-purple-500 to-indigo-600',
      },
      {
        id: 'packages',
        title: 'Katalog Paket Layanan & Pricelist',
        badge: 'Pricelist',
        category: 'paket',
        description: 'Katalog interaktif untuk calon pengantin memilih paket pernikahan, add-on tambahan, kode voucher promo, dan melihat rincian biaya.',
        hash: '#/public-packages',
        icon: PackageIcon,
        accentColor: 'from-emerald-500 to-teal-700',
        isPopular: true,
      },
      {
        id: 'booking',
        title: 'Formulir Reservasi & Booking Jadwal',
        badge: 'Form Booking',
        category: 'booking',
        description: 'Formulir reservasi mandiri untuk calon pengantin memasukkan data acara pernikahan, memilih paket, serta mengunggah bukti transfer DP.',
        hash: '#/public-booking',
        icon: CalendarIcon,
        accentColor: 'from-rose-500 to-pink-600',
        isPopular: true,
      },
      {
        id: 'lead-form',
        title: 'Formulir Konsultasi & Penawaran Baru',
        badge: 'Calon Pengantin',
        category: 'booking',
        description: 'Formulir tanya harga dan konsultasi kilat untuk menangkap kontak prospek calon pengantin baru yang masuk ke database prospek Anda.',
        hash: '#/public-lead-form',
        icon: UsersIcon,
        accentColor: 'from-blue-500 to-cyan-600',
      },
      {
        id: 'feedback',
        title: 'Formulir Testimoni & Ulasan Pengantin',
        badge: 'Ulasan Klien',
        category: 'klien',
        description: 'Tautan formulir feedback dan ulasan kepuasan pengantin setelah acara pernikahan selesai untuk membangun reputasi studio.',
        hash: '#/feedback',
        icon: MessageSquare,
        accentColor: 'from-violet-500 to-purple-600',
      },
      {
        id: 'gallery',
        title: 'Upload & Galeri Pricelist Publik',
        badge: 'Galeri Gambar',
        category: 'paket',
        description: 'Galeri gambar pricelist dan brosur visual yang dapat dibagikan langsung kepada calon klien melalui link atau QR Code.',
        hash: '#/gallery',
        icon: FileText,
        accentColor: 'from-amber-600 to-orange-700',
      },
      {
        id: 'client-portal',
        title: 'Portal Pengantin (Akses Personal Klien)',
        badge: 'Portal Pengantin',
        category: 'klien',
        description: 'Akses khusus bagi setiap pasangan pengantin untuk melacak progres pengerjaan foto/video, invoice tagihan, dan file deliverables.',
        hash: '#/portal',
        icon: Layers,
        accentColor: 'from-slate-600 to-slate-800',
      },
    ];
  }, []);

  // Filtered links
  const filteredLinks = useMemo(() => {
    return publicLinks.filter((link) => {
      const matchSearch =
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.hash.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === 'semua' || link.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [publicLinks, searchQuery, categoryFilter]);

  // Copy helper
  const handleCopyLink = (fullUrl: string, id: string) => {
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    showNotification('Tautan berhasil disalin ke clipboard!');
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  // WhatsApp share helper
  const handleShareWhatsApp = (title: string, fullUrl: string) => {
    const studioName = profile?.companyName || profile?.fullName || 'Studio Wedding';
    const message = `Halo! Terima kasih atas ketertarikan Anda pada layanan pernikahan kami di *${studioName}*.\n\nBerikut tautan *${title}* kami:\n${fullUrl}\n\nSilakan dibuka untuk melihat rincian lengkapnya. Bila ada hal yang ingin ditanyakan, kami dengan senang hati siap membantu! 😊`;
    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  // Download QR Code helper
  const handleDownloadQr = () => {
    const canvas = document.querySelector('#public-links-qrcode canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `QR-Code-${(qrModalData?.title || 'Link-Publik').replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showNotification('QR Code berhasil diunduh!');
    }
  };

  // Regions for package filter
  const packageRegions = useMemo(() => {
    const set = new Set<string>();
    packages.forEach((p) => {
      if (p.region) set.add(p.region);
    });
    return ['Semua', ...Array.from(set)];
  }, [packages]);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchSearch =
        pkg.name.toLowerCase().includes(packageSearch.toLowerCase()) ||
        (pkg.category || '').toLowerCase().includes(packageSearch.toLowerCase());
      const matchRegion = selectedRegion === 'Semua' || pkg.region === selectedRegion;
      return matchSearch && matchRegion;
    });
  }, [packages, packageSearch, selectedRegion]);

  // Portfolio categories
  const portfolioCategories = useMemo(() => {
    const set = new Set<string>();
    portfolios.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['Semua', ...Array.from(set)];
  }, [portfolios]);

  // Filtered portfolios
  const filteredPortfolios = useMemo(() => {
    if (selectedPortfolioCategory === 'Semua') return portfolios;
    return portfolios.filter((p) => p.category === selectedPortfolioCategory);
  }, [portfolios, selectedPortfolioCategory]);

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-5 md:p-8 space-y-8 animate-fade-in text-brand-text-primary">
      {/* ─── Hero Header Banner ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-amber-700 to-stone-900 text-white p-6 sm:p-8 md:p-10 shadow-xl border border-white/10">
        {/* Background glow & accents */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-amber-200">
              <Sparkles className="w-3.5 h-3.5" />
              Pusat Link Publik & Showcase Studio
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Tautan Publik, Paket, Portofolio & Booking
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light">
              Kelola dan bagikan seluruh tautan publik studio Anda dalam satu tempat. Calon pengantin dapat melihat paket pernikahan, menikmati portofolio karya, dan melakukan booking online secara langsung.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="#/showcase"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-stone-900 hover:bg-amber-50 font-bold text-sm shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <ExternalLink className="w-4 h-4 text-amber-600" />
              Buka Showcase Publik
            </a>
            <button
              onClick={() => handleCopyLink(`${baseUrl}#/showcase`, 'main-showcase')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md text-white font-semibold text-sm transition-all duration-200"
            >
              {copiedId === 'main-showcase' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Link Utama Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Link Utama</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Highlights Summary */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10">
            <p className="text-xs text-white/70 font-medium">Total Link Aktif</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-1">{publicLinks.length} Tautan</p>
          </div>
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10">
            <p className="text-xs text-white/70 font-medium">Paket Pernikahan</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-1">{packages.length} Paket</p>
          </div>
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10">
            <p className="text-xs text-white/70 font-medium">Portofolio Karya</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-1">{portfolios.length} Proyek</p>
          </div>
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10">
            <p className="text-xs text-white/70 font-medium">Formulir Booking</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-300 mt-1">Online & Siap</p>
          </div>
        </div>
      </div>

      {/* ─── Main Navigation Tabs ─── */}
      <div className="flex items-center justify-between border-b border-brand-border pb-1 overflow-x-auto gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('links')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 border ${
              activeTab === 'links'
                ? 'bg-brand-accent text-white border-brand-accent shadow-sm'
                : 'bg-brand-surface text-brand-text-secondary border-brand-border hover:bg-brand-input hover:text-brand-text-primary'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Semua Link Publik</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                activeTab === 'links' ? 'bg-white/25 text-white' : 'bg-brand-input text-brand-text-secondary'
              }`}
            >
              {publicLinks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 border ${
              activeTab === 'packages'
                ? 'bg-brand-accent text-white border-brand-accent shadow-sm'
                : 'bg-brand-surface text-brand-text-secondary border-brand-border hover:bg-brand-input hover:text-brand-text-primary'
            }`}
          >
            <PackageIcon className="w-4 h-4" />
            <span>Katalog Paket (Package)</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                activeTab === 'packages' ? 'bg-white/25 text-white' : 'bg-brand-input text-brand-text-secondary'
              }`}
            >
              {packages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 border ${
              activeTab === 'portfolio'
                ? 'bg-brand-accent text-white border-brand-accent shadow-sm'
                : 'bg-brand-surface text-brand-text-secondary border-brand-border hover:bg-brand-input hover:text-brand-text-primary'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Portofolio Karya (Portfolio)</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                activeTab === 'portfolio' ? 'bg-white/25 text-white' : 'bg-brand-input text-brand-text-secondary'
              }`}
            >
              {portfolios.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('booking')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 border ${
              activeTab === 'booking'
                ? 'bg-brand-accent text-white border-brand-accent shadow-sm'
                : 'bg-brand-surface text-brand-text-secondary border-brand-border hover:bg-brand-input hover:text-brand-text-primary'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Form Booking Pengantin</span>
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 1: SEMUA LINK PUBLIK
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'links' && (
        <div className="space-y-6">
          {/* Controls: Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-surface p-4 rounded-2xl border border-brand-border shadow-sm">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-secondary" />
              <input
                type="text"
                placeholder="Cari tautan publik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-brand-input border border-brand-border rounded-xl text-sm focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none text-brand-text-primary placeholder:text-brand-text-secondary"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {[
                { key: 'semua', label: 'Semua' },
                { key: 'utama', label: 'Tautan Utama' },
                { key: 'paket', label: 'Paket & Pricelist' },
                { key: 'booking', label: 'Formulir Pemesanan' },
                { key: 'klien', label: 'Klien & Portal' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setCategoryFilter(item.key as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    categoryFilter === item.key
                      ? 'bg-brand-accent text-white'
                      : 'bg-brand-input text-brand-text-secondary hover:text-brand-text-primary'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredLinks.map((link) => {
              const fullUrl = `${baseUrl}${link.hash}`;
              const isCopied = copiedId === link.id;
              const IconComp = link.icon;

              return (
                <div
                  key={link.id}
                  className="group relative bg-brand-surface border border-brand-border hover:border-brand-accent/50 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${link.accentColor} text-white flex items-center justify-center shadow-md shrink-0`}
                        >
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-brand-text-primary leading-tight">
                              {link.title}
                            </h3>
                            {link.isPopular && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                Populer
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-brand-text-secondary">
                            {link.badge}
                          </span>
                        </div>
                      </div>

                      {/* Route badge */}
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-brand-input border border-brand-border text-brand-text-secondary shrink-0">
                        {link.hash}
                      </span>
                    </div>

                    <p className="text-sm text-brand-text-secondary leading-relaxed mb-4 line-clamp-3">
                      {link.description}
                    </p>
                  </div>

                  {/* URL Preview Box */}
                  <div className="space-y-3 mt-auto pt-4 border-t border-brand-border/60">
                    <div className="flex items-center gap-2 bg-brand-input/70 border border-brand-border rounded-xl px-3 py-2 text-xs font-mono text-brand-text-secondary overflow-hidden">
                      <LinkIcon className="w-3.5 h-3.5 shrink-0 text-brand-text-secondary" />
                      <span className="truncate flex-1 select-all">{fullUrl}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {/* Copy Link */}
                      <button
                        onClick={() => handleCopyLink(fullUrl, link.id)}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                          isCopied
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-brand-surface hover:bg-brand-input text-brand-text-primary border-brand-border'
                        }`}
                        title="Salin Link ke Clipboard"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-brand-text-secondary" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>

                      {/* WhatsApp Share */}
                      <button
                        onClick={() => handleShareWhatsApp(link.title, fullUrl)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 transition-colors"
                        title="Kirim Pesan ke WhatsApp"
                      >
                        <WhatsappIcon className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kirim WA</span>
                      </button>

                      {/* QR Code */}
                      <button
                        onClick={() => setQrModalData({ title: link.title, url: fullUrl })}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-surface hover:bg-brand-input text-brand-text-primary border border-brand-border transition-colors"
                        title="Tampilkan QR Code"
                      >
                        <QrCodeIcon className="w-3.5 h-3.5 text-brand-text-secondary" />
                        <span>QR Code</span>
                      </button>

                      {/* Open Link */}
                      <a
                        href={link.hash}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent border border-brand-accent/30 transition-colors"
                        title="Buka Tautan di Tab Baru"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLinks.length === 0 && (
            <div className="text-center py-16 bg-brand-surface rounded-2xl border border-brand-border">
              <Globe className="w-10 h-10 text-brand-text-secondary mx-auto mb-3 opacity-40" />
              <p className="font-semibold text-brand-text-primary">Tidak ada tautan yang sesuai.</p>
              <p className="text-xs text-brand-text-secondary mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 2: KATALOG PAKET (PACKAGE)
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          {/* Header Info Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent p-5 rounded-2xl border border-emerald-500/20">
            <div>
              <h2 className="text-lg font-bold text-brand-text-primary">
                Katalog Paket Layanan & Pricelist Pernikahan
              </h2>
              <p className="text-sm text-brand-text-secondary mt-0.5">
                Bagikan tautan langsung ke paket tertentu atau arahkan calon pengantin ke seluruh katalog pricelist.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() =>
                  handleCopyLink(`${baseUrl}#/public-packages`, 'catalog-all-packages')
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-accent text-white font-semibold text-xs shadow-sm hover:bg-brand-accent/90 transition-all"
              >
                {copiedId === 'catalog-all-packages' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Link Katalog Paket</span>
                  </>
                )}
              </button>
              <a
                href="#/public-packages"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-brand-border bg-brand-surface hover:bg-brand-input text-brand-text-primary text-xs"
                title="Buka Halaman Paket Publik"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Search & Region Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-surface p-4 rounded-2xl border border-brand-border">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-secondary" />
              <input
                type="text"
                placeholder="Cari nama paket..."
                value={packageSearch}
                onChange={(e) => setPackageSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-brand-input border border-brand-border rounded-xl text-sm focus:ring-2 focus:ring-brand-accent outline-none text-brand-text-primary"
              />
            </div>

            {packageRegions.length > 2 && (
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                <span className="text-xs font-semibold text-brand-text-secondary mr-1">Wilayah:</span>
                {packageRegions.map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedRegion === reg
                        ? 'bg-brand-accent text-white'
                        : 'bg-brand-input text-brand-text-secondary hover:text-brand-text-primary'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Package Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => {
              const packageUrl = `${baseUrl}#/public-packages?package=${pkg.id}`;
              const isCopied = copiedId === `pkg-${pkg.id}`;

              return (
                <div
                  key={pkg.id}
                  className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-1.5">
                          {pkg.region ? `Wilayah ${pkg.region}` : 'Paket Layanan'}
                        </span>
                        <h3 className="text-lg font-bold text-brand-text-primary leading-tight">
                          {pkg.name}
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-brand-text-secondary shrink-0">
                        {pkg.durationOptions?.[0]?.label || pkg.processingTime || ''}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-4 pb-4 border-b border-brand-border">
                      <p className="text-xs text-brand-text-secondary font-medium">Harga Investasi</p>
                      <p className="text-2xl font-black text-brand-accent mt-0.5">
                        {formatCurrency(pkg.price)}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-brand-text-secondary mb-4 leading-relaxed line-clamp-3">
                      {[pkg.photographers, pkg.videographers, pkg.processingTime].filter(Boolean).join(' · ') || pkg.category}
                    </p>

                    {/* Deliverables / Features */}
                    {(() => {
                      const items: string[] = [
                        ...(pkg.digitalItems || []),
                        ...(pkg.physicalItems || []).map((p) => p.name),
                      ];
                      if (items.length === 0) return null;
                      return (
                        <div className="space-y-2 mb-4">
                          <p className="text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">
                            Yang Didapatkan:
                          </p>
                          <ul className="space-y-1.5">
                            {items.slice(0, 4).map((d: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-brand-text-primary">
                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{d}</span>
                              </li>
                            ))}
                            {items.length > 4 && (
                              <li className="text-[11px] text-brand-accent font-semibold pl-5">
                                +{items.length - 4} benefit lainnya
                              </li>
                            )}
                          </ul>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 bg-brand-input/40 border-t border-brand-border flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLink(packageUrl, `pkg-${pkg.id}`)}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isCopied
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : 'bg-brand-surface hover:bg-brand-input text-brand-text-primary border-brand-border'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-brand-text-secondary" />
                          <span>Salin Link Paket</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleShareWhatsApp(`Paket ${pkg.name}`, packageUrl)}
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40"
                      title="Share ke WhatsApp"
                    >
                      <WhatsappIcon className="w-4 h-4 text-emerald-600" />
                    </button>
                    <button
                      onClick={() => setQrModalData({ title: `Paket ${pkg.name}`, url: packageUrl })}
                      className="p-2 rounded-xl bg-brand-surface hover:bg-brand-input text-brand-text-primary border border-brand-border"
                      title="Lihat QR Code"
                    >
                      <QrCodeIcon className="w-4 h-4 text-brand-text-secondary" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPackages.length === 0 && (
            <div className="text-center py-16 bg-brand-surface rounded-2xl border border-brand-border">
              <PackageIcon className="w-10 h-10 text-brand-text-secondary mx-auto mb-3 opacity-40" />
              <p className="font-semibold text-brand-text-primary">Belum ada paket yang cocok.</p>
              <p className="text-xs text-brand-text-secondary mt-1">Silakan sesuaikan filter pencarian Anda.</p>
            </div>
          )}

          {/* Add-Ons Section */}
          {addOns.length > 0 && (
            <div className="mt-10 bg-brand-surface border border-brand-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4 border-b border-brand-border pb-3">
                <div>
                  <h3 className="text-base font-bold text-brand-text-primary">
                    Layanan Tambahan (Add-On Services)
                  </h3>
                  <p className="text-xs text-brand-text-secondary mt-0.5">
                    Pilihan upgrade yang dapat ditambahkan pengantin saat memilih paket.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-input text-brand-text-secondary">
                  {addOns.length} Add-On
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {addOns.map((addon) => (
                  <div
                    key={addon.id}
                    className="p-3.5 bg-brand-input/50 rounded-xl border border-brand-border flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-brand-text-primary">{addon.name}</p>
                      <p className="text-xs font-bold text-brand-accent mt-0.5">
                        {formatCurrency(addon.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 3: PORTOFOLIO KARYA (PORTFOLIO)
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          {/* Header Info Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent p-5 rounded-2xl border border-purple-500/20">
            <div>
              <h2 className="text-lg font-bold text-brand-text-primary">
                Galeri Portofolio & Hasil Karya Acara Pernikahan
              </h2>
              <p className="text-sm text-brand-text-secondary mt-0.5">
                Koleksi foto dan video pernikahan dari studio Anda yang dapat diakses publik oleh calon pengantin.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() =>
                  handleCopyLink(`${baseUrl}#/profile`, 'portfolio-all-link')
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-accent text-white font-semibold text-xs shadow-sm hover:bg-brand-accent/90 transition-all"
              >
                {copiedId === 'portfolio-all-link' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Link Halaman Portofolio</span>
                  </>
                )}
              </button>
              <a
                href="#/profile"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-brand-border bg-brand-surface hover:bg-brand-input text-brand-text-primary text-xs"
                title="Buka Portofolio Publik"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Category Filter */}
          {portfolioCategories.length > 2 && (
            <div className="flex flex-wrap items-center gap-2 bg-brand-surface p-3.5 rounded-2xl border border-brand-border">
              <span className="text-xs font-semibold text-brand-text-secondary mr-2">Kategori:</span>
              {portfolioCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedPortfolioCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    selectedPortfolioCategory === cat
                      ? 'bg-brand-text-primary text-brand-bg font-bold shadow-sm'
                      : 'bg-brand-input text-brand-text-secondary hover:text-brand-text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Portfolios Grid */}
          {loadingPortfolios ? (
            <div className="py-20 flex flex-col items-center justify-center text-brand-text-secondary">
              <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm font-medium">Memuat data portofolio...</p>
            </div>
          ) : filteredPortfolios.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPortfolios.map((portfolio) => {
                const thumb =
                  portfolio.cover_image_url ||
                  (portfolio.images && portfolio.images.length > 0 ? portfolio.images[0].url : null);
                const portfolioUrl = `${baseUrl}#/portfolio/${portfolio.id}`;
                const isCopied = copiedId === `port-${portfolio.id}`;

                return (
                  <div
                    key={portfolio.id}
                    className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Cover Thumbnail */}
                    <div className="relative aspect-video bg-stone-100 dark:bg-stone-900 overflow-hidden">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={portfolio.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-brand-text-secondary">
                          <Camera className="w-8 h-8 mb-2 opacity-30" />
                          <span className="text-xs">Belum ada foto</span>
                        </div>
                      )}

                      {/* Category Badge */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-black/60 text-white backdrop-blur-md uppercase tracking-wider">
                        {portfolio.category || 'Wedding'}
                      </span>

                      {/* Photo Count */}
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-md">
                        {portfolio.images?.length || 0} Foto
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="mb-4">
                        <h3 className="font-bold text-base text-brand-text-primary line-clamp-1">
                          {portfolio.title}
                        </h3>
                        {portfolio.youtube_url && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-rose-500 font-semibold mt-1">
                            <span>▶ Video YouTube Tersedia</span>
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3 border-t border-brand-border flex items-center gap-2">
                        <button
                          onClick={() => handleCopyLink(portfolioUrl, `port-${portfolio.id}`)}
                          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            isCopied
                              ? 'bg-emerald-500 text-white border-emerald-500'
                              : 'bg-brand-surface hover:bg-brand-input text-brand-text-primary border-brand-border'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-brand-text-secondary" />
                              <span>Salin Link</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleShareWhatsApp(portfolio.title, portfolioUrl)}
                          className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40"
                          title="Share ke WhatsApp"
                        >
                          <WhatsappIcon className="w-4 h-4 text-emerald-600" />
                        </button>
                        <a
                          href={`#/portfolio/${portfolio.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-brand-surface hover:bg-brand-input text-brand-text-primary border border-brand-border"
                          title="Buka Detail Portofolio"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-brand-surface rounded-2xl border border-brand-border">
              <Camera className="w-10 h-10 text-brand-text-secondary mx-auto mb-3 opacity-40" />
              <p className="font-semibold text-brand-text-primary">Belum ada proyek portofolio.</p>
              <p className="text-xs text-brand-text-secondary mt-1">
                Anda dapat menambahkan portofolio di menu <strong>Profil Vendor</strong>.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 4: FORM BOOKING PENGANTIN
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'booking' && (
        <div className="space-y-6">
          {/* Booking Link Callout */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 mb-2">
                Tautan Formulir Pemesanan Online
              </span>
              <h2 className="text-xl font-bold text-brand-text-primary">
                Formulir Booking Jadwal Acara Pernikahan
              </h2>
              <p className="text-xs sm:text-sm text-brand-text-secondary mt-1 max-w-xl">
                Tautan ini siap dibagikan ke calon pengantin untuk melakukan reservasi tanggal wedding mandiri, memilih paket, serta mengirimkan bukti transfer DP.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopyLink(`${baseUrl}#/public-booking`, 'form-booking-tab')}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs border transition-all ${
                  copiedId === 'form-booking-tab'
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-brand-accent text-white border-brand-accent hover:bg-brand-accent/90 shadow-sm'
                }`}
              >
                {copiedId === 'form-booking-tab' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Link Booking Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Link Booking</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleShareWhatsApp('Formulir Booking Wedding', `${baseUrl}#/public-booking`)}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs font-semibold"
              >
                <WhatsappIcon className="w-4 h-4 text-emerald-600" />
                <span>Kirim WA</span>
              </button>

              <button
                onClick={() =>
                  setQrModalData({
                    title: 'Formulir Booking Acara Pernikahan',
                    url: `${baseUrl}#/public-booking`,
                  })
                }
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-brand-surface hover:bg-brand-input text-brand-text-primary border border-brand-border text-xs font-semibold"
              >
                <QrCodeIcon className="w-4 h-4" />
                <span>QR Code</span>
              </button>

              <a
                href="#/public-booking"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-brand-surface hover:bg-brand-input text-brand-text-primary border border-brand-border text-xs font-semibold"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka Form ↗</span>
              </a>
            </div>
          </div>

          {/* Embedded Interactive Booking Form Preview Container */}
          <div className="bg-brand-surface border border-brand-border rounded-3xl overflow-hidden shadow-md">
            <div className="bg-brand-input/70 px-6 py-4 border-b border-brand-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono text-brand-text-secondary ml-2 font-medium">
                  {baseUrl}#/public-booking
                </span>
              </div>
              <span className="text-xs font-semibold text-brand-text-secondary">
                Pratinjau Interaktif Live
              </span>
            </div>

            <div className="p-4 sm:p-6 md:p-8">
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
        </div>
      )}

      {/* ─── QR Code Modal ─── */}
      {qrModalData && (
        <Modal
          isOpen={true}
          onClose={() => setQrModalData(null)}
          title={`QR Code: ${qrModalData.title}`}
        >
          <div className="p-4 flex flex-col items-center text-center space-y-4">
            <p className="text-xs text-brand-text-secondary max-w-sm">
              Scan QR Code ini menggunakan kamera smartphone untuk langsung membuka halaman publik.
            </p>

            {/* QR Code Canvas */}
            <div
              id="public-links-qrcode"
              className="p-5 bg-white rounded-2xl shadow-inner border border-gray-200 inline-block"
            >
              <QrCodeDisplay
                value={qrModalData.url}
                size={220}
                wrapperId="public-links-qrcode"
              />
            </div>

            {/* URL String */}
            <div className="w-full px-3 py-2 bg-brand-input rounded-xl text-xs font-mono text-brand-text-secondary break-all select-all">
              {qrModalData.url}
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2 w-full pt-2">
              <button
                onClick={handleDownloadQr}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-accent text-white font-semibold text-xs shadow-sm hover:bg-brand-accent/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Gambar QR (PNG)</span>
              </button>
              <button
                onClick={() => handleCopyLink(qrModalData.url, 'modal-qr-copy')}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-brand-border bg-brand-surface hover:bg-brand-input text-brand-text-primary font-semibold text-xs transition-colors"
              >
                {copiedId === 'modal-qr-copy' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PublicLinksHubPage;
