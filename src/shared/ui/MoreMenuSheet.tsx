import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ViewType } from '../../types';
import {
  TargetIcon,
  ClipboardListIcon,
  CalendarIcon,
  FileTextIcon,
  BriefcaseIcon,
  PackageIcon,
  LightbulbIcon,
  ImageIcon,
  UserCircleIcon,
  ChartPieIcon,
  SettingsIcon,
  XIcon,
} from '../../constants';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MoreMenuItem {
  view: ViewType;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color?: string; // optional tint colour for the tile bg
}

interface MoreMenuGroup {
  id: string;
  title: string;
  items: MoreMenuItem[];
}

interface MoreMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: ViewType;
  handleNavigation: (view: ViewType) => void;
}

// ─── Menu data ────────────────────────────────────────────────────────────────
// Everything that is NOT already a primary bottom-nav tab
// (Dashboard, Proyek, Klien, Keuangan are handled by the main 4 tabs)

const MORE_MENU_GROUPS: MoreMenuGroup[] = [
  {
    id: 'pengantin',
    title: 'Pengelolaan Pengantin',
    items: [
      { view: ViewType['Calon Pengantin'], label: 'Calon Pengantin', icon: TargetIcon,        color: 'rgba(99,102,241,0.12)'  },
      { view: ViewType.BOOKING,            label: 'Booking Jadwal',  icon: ClipboardListIcon, color: 'rgba(20,184,166,0.12)'  },
      { view: ViewType.CALENDAR,           label: 'Jadwal Wedding',  icon: CalendarIcon,      color: 'rgba(245,158,11,0.12)'  },
      { view: ViewType.CONTRACTS,          label: 'Kontrak Digital', icon: FileTextIcon,      color: 'rgba(239,68,68,0.12)'   },
    ],
  },
  {
    id: 'layanan',
    title: 'Layanan & Produk',
    items: [
      { view: ViewType.PACKAGES,    label: 'Layanan / Package',    icon: PackageIcon,    color: 'rgba(16,185,129,0.12)' },
      { view: ViewType.PROMO_CODES, label: 'Voucher',              icon: LightbulbIcon,  color: 'rgba(251,191,36,0.12)' },
      { view: ViewType.GALLERY,     label: 'Pricelist Publik',     icon: ImageIcon,      color: 'rgba(139,92,246,0.12)' },
    ],
  },
  {
    id: 'vendor',
    title: 'Vendor & Tim',
    items: [
      { view: ViewType.TEAM,           label: 'Tim / Vendor',  icon: BriefcaseIcon,  color: 'rgba(59,130,246,0.12)'  },
      { view: ViewType.CLIENT_REPORTS, label: 'Testimoni',     icon: ChartPieIcon,   color: 'rgba(236,72,153,0.12)'  },
      { view: ViewType.VENDOR_PROFILE, label: 'Profil Vendor', icon: UserCircleIcon, color: 'rgba(14,165,233,0.12)'  },
    ],
  },
  {
    id: 'sistem',
    title: 'Sistem',
    items: [
      { view: ViewType.SETTINGS, label: 'Pengaturan', icon: SettingsIcon, color: 'rgba(107,114,128,0.12)' },
    ],
  },
];

// Which views live in the "more" sheet (used externally to determine active tab)
export const MORE_VIEWS: ViewType[] = MORE_MENU_GROUPS.flatMap(g =>
  g.items.map(i => i.view),
);

// ─── Drag-to-dismiss hook ─────────────────────────────────────────────────────

function useDragDismiss(onClose: () => void, enabled: boolean) {
  const [dragY, setDragY]   = useState(0);
  const startYRef           = useRef(0);
  const isDraggingRef       = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    isDraggingRef.current = true;
    startYRef.current     = e.touches[0].clientY;
    setDragY(0);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const delta = e.touches[0].clientY - startYRef.current;
    if (delta > 0) setDragY(delta); // only allow downward drag
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (dragY > 80) {
      onClose();
    } else {
      setDragY(0);
    }
  }, [dragY, onClose]);

  // Mouse (desktop) equivalents
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startYRef.current     = e.clientY;
    setDragY(0);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const delta = e.clientY - startYRef.current;
      if (delta > 0) setDragY(delta);
    };
    const onMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setDragY(prev => {
        if (prev > 80) { onClose(); return 0; }
        return 0;
      });
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
    };
  }, [enabled, onClose]);

  return { dragY, onTouchStart, onTouchMove, onTouchEnd, onMouseDown };
}

// ─── Component ────────────────────────────────────────────────────────────────

export const MoreMenuSheet: React.FC<MoreMenuSheetProps> = ({
  isOpen,
  onClose,
  activeView,
  handleNavigation,
}) => {
  const [visible,  setVisible]  = useState(false); // controls mount
  const [animIn,   setAnimIn]   = useState(false);  // drives slide animation

  const { dragY, onTouchStart, onTouchMove, onTouchEnd, onMouseDown } =
    useDragDismiss(onClose, isOpen);

  // ── Open/close animation sequencing ────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      // Small rAF delay so the initial translateY is painted before we animate
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
    } else {
      setAnimIn(false);
      const t = setTimeout(() => setVisible(false), 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // ── Body scroll lock ────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ── Keyboard dismiss ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!visible) return null;

  const handleItemClick = (view: ViewType) => {
    handleNavigation(view);
    onClose();
  };

  return createPortal(
    <>
      {/* ── Backdrop ────────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position:   'fixed',
          inset:      0,
          zIndex:     55,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          opacity:    animIn ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* ── Sheet panel ─────────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu Lainnya"
        style={{
          position:        'fixed',
          bottom:          0,
          left:            0,
          right:           0,
          zIndex:          56,
          maxHeight:       '85vh',
          display:         'flex',
          flexDirection:   'column',
          borderTopLeftRadius:  '24px',
          borderTopRightRadius: '24px',
          // Design tokens resolved to CSS vars the project already uses
          background:      'var(--color-surface)',
          boxShadow:       '0 -8px 40px rgba(0,0,0,0.25)',
          transform:       `translateY(${animIn ? dragY + 'px' : '100%'})`,
          transition:      dragY > 0 ? 'none' : 'transform 0.35s cubic-bezier(0.32,0.72,0,1)',
          willChange:      'transform',
          // safe-area bottom padding applied to inner scroll, not the panel itself
        }}
      >
        {/* Drag handle area */}
        <div
          style={{ width: '100%', paddingTop: 12, paddingBottom: 8, cursor: 'grab', flexShrink: 0 }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          aria-hidden="true"
        >
          <div
            style={{
              width:        44,
              height:       5,
              borderRadius: 3,
              background:   'var(--color-border)',
              margin:       '0 auto',
            }}
          />
        </div>

        {/* Header */}
        <div
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            padding:        '0 20px 12px',
            flexShrink:     0,
            borderBottom:   '1px solid var(--color-border)',
          }}
        >
          <span
            style={{
              fontSize:   17,
              fontWeight: 700,
              color:      'var(--color-text-light)',
              letterSpacing: '-0.3px',
            }}
          >
            Menu Lainnya
          </span>
          <button
            onClick={onClose}
            aria-label="Tutup menu"
            style={{
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              width:           36,
              height:          36,
              borderRadius:    '50%',
              border:          'none',
              background:      'var(--color-input)',
              cursor:          'pointer',
              color:           'var(--color-text-secondary)',
              transition:      'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-accent)';
              (e.currentTarget as HTMLButtonElement).style.color      = '#fff';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-input)';
              (e.currentTarget as HTMLButtonElement).style.color      = 'var(--color-text-secondary)';
            }}
          >
            <XIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Scrollable group content */}
        <div
          style={{
            overflowY:                'auto',
            flex:                     1,
            padding:                  '16px 16px',
            paddingBottom:            'calc(16px + var(--safe-area-inset-bottom, 0px))',
            WebkitOverflowScrolling:  'touch' as React.CSSProperties['WebkitOverflowScrolling'],
            overscrollBehavior:       'contain',
          }}
        >
          {MORE_MENU_GROUPS.map((group, gi) => (
            <section key={group.id} style={{ marginBottom: gi < MORE_MENU_GROUPS.length - 1 ? 24 : 0 }}>
              {/* Group label */}
              <p
                style={{
                  fontSize:      10,
                  fontWeight:    700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color:         'var(--color-text-secondary)',
                  marginBottom:  10,
                  paddingLeft:   4,
                }}
              >
                {group.title}
              </p>

              {/* 3-column grid */}
              <div
                style={{
                  display:             'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap:                 10,
                }}
              >
                {group.items.map(item => {
                  const isActive = activeView === item.view;
                  return (
                    <button
                      key={item.view}
                      onClick={() => handleItemClick(item.view)}
                      aria-label={item.label}
                      aria-current={isActive ? 'page' : undefined}
                      style={{
                        display:        'flex',
                        flexDirection:  'column',
                        alignItems:     'center',
                        justifyContent: 'center',
                        gap:            6,
                        padding:        '14px 8px',
                        borderRadius:   16,
                        border:         isActive
                          ? '2px solid var(--color-accent)'
                          : '2px solid transparent',
                        background: isActive
                          ? 'var(--color-accent)'
                          : (item.color || 'var(--color-input)'),
                        cursor:     'pointer',
                        transition: 'all 0.18s ease',
                        minHeight:  80,
                        // subtle shadow for active
                        boxShadow: isActive
                          ? '0 4px 16px rgba(var(--color-accent-rgb, 99,102,241),0.35)'
                          : 'none',
                      }}
                    >
                      {/* Icon */}
                      <div
                        style={{
                          width:           40,
                          height:          40,
                          borderRadius:    12,
                          display:         'flex',
                          alignItems:      'center',
                          justifyContent:  'center',
                          background:      isActive
                            ? 'rgba(255,255,255,0.2)'
                            : 'var(--color-surface)',
                          flexShrink:      0,
                          transition:      'background 0.18s ease',
                        }}
                      >
                        <item.icon
                          style={{
                            width:  20,
                            height: 20,
                            color: isActive
                              ? '#ffffff'
                              : 'var(--color-accent)',
                          }}
                        />
                      </div>

                      {/* Label */}
                      <span
                        style={{
                          fontSize:   10,
                          fontWeight: isActive ? 700 : 600,
                          color:      isActive
                            ? '#ffffff'
                            : 'var(--color-text-primary)',
                          textAlign:  'center',
                          lineHeight: 1.3,
                          wordBreak:  'break-word',
                        }}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes moreSheetIn {
          from { transform: translateY(100%); }
          to   { transform: translateY(0);    }
        }
      `}</style>
    </>,
    document.body,
  );
};

export default MoreMenuSheet;
