import React, { useState } from 'react';
import { SHAREAMEAL_LOGO_URL } from '../data/initialData';
import { NavRoute, NotificationItem, PersonaRole, ToastMessage } from '../types';

interface ShellProps {
  activeRoute: NavRoute;
  onNavigate: (route: NavRoute) => void;
  activePersona: PersonaRole;
  onPersonaChange: (role: PersonaRole) => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  toasts: ToastMessage[];
  children: React.ReactNode;
}

const NAV_ITEMS: { route: NavRoute; icon: string; label: string }[] = [
  { route: 'dispatch-control', icon: 'hub', label: 'Live Fleet Dispatch' },
  { route: 'surplus-manifest', icon: 'inventory_2', label: 'Surplus Manifest' },
  { route: 'ngo-directory', icon: 'home_work', label: 'NGO Shelters' },
  { route: 'volunteer-dispatch', icon: 'electric_moped', label: 'Volunteers on Duty' },
  { route: 'food-safety-audit', icon: 'verified', label: 'Safety & Temperature' },
];

export const BrandLogo: React.FC<{ className?: string }> = ({ className = 'h-7 w-auto' }) => {
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed) {
    return (
      <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
      </div>
    );
  }

  return (
    <img
      src={SHAREAMEAL_LOGO_URL}
      alt="ShareAMeal Official Logo"
      referrerPolicy="no-referrer"
      className={`${className} object-contain shrink-0`}
      onError={() => setImgFailed(true)}
    />
  );
};

export const Shell: React.FC<ShellProps> = ({
  activeRoute,
  onNavigate,
  activePersona,
  onPersonaChange,
  notifications,
  onMarkAllRead,
  toasts,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNavClick = (route: NavRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  const SidebarContent = (
    <div className="flex flex-col justify-between h-full py-4">
      <div className="flex flex-col gap-4 px-4">
        <div className="flex items-center justify-between px-1 py-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <BrandLogo className="h-7 w-auto" />
            <div className="flex flex-col min-w-0">
              <span className="font-headline text-[18px] font-semibold text-primary leading-tight truncate">
                ShareAMeal
              </span>
              <span className="text-[11px] font-semibold tracking-[0.04em] text-secondary truncate">
                Logistics Control
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close navigation menu"
            className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="px-1">
          <div className="bg-surface-container-high rounded-lg p-2.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                Active Hub
              </span>
              <span className="text-xs font-semibold text-primary">BLR Central</span>
            </div>
            <div className="text-xs text-outline mt-1">Indiranagar Dispatch Node</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1 text-xs font-medium" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleNavClick(item.route)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-4 flex flex-col gap-2.5">
        <div className="bg-secondary-container/40 p-3 rounded-lg flex flex-col gap-1">
          <span className="text-[11px] text-secondary font-bold uppercase tracking-wider">
            Network Velocity
          </span>
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-headline text-lg font-bold text-primary tabular-nums">
              34 min
            </span>
            <span className="text-[11px] font-semibold text-secondary">Avg Pickup ETA</span>
          </div>
          <p className="text-xs text-on-surface-variant tabular-nums">
            99.4% cold-chain compliance
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeRoute === 'home'
              ? 'bg-primary-container text-on-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Exit to Public Portal</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-surface-container-low z-40 flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-primary/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative z-10 w-64 max-w-[82vw] h-full bg-surface-container-low shadow-2xl">
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Main Column */}
      <div className="lg:pl-64">
        <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-30 flex items-center justify-between px-4 sm:px-6 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              aria-label="Open navigation menu"
              className="lg:hidden p-2 rounded-lg text-primary hover:bg-surface-container cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>

            <BrandLogo className="h-8 w-auto hidden sm:block" />

            <div className="relative flex items-center bg-surface-container rounded-lg px-2.5 py-1.5">
              <label className="sr-only" htmlFor="dash-role-switcher">
                Switch Persona
              </label>
              <select
                id="dash-role-switcher"
                value={activePersona}
                onChange={(e) => onPersonaChange(e.target.value as PersonaRole)}
                className="bg-transparent text-xs font-medium text-on-surface focus:outline-none cursor-pointer pr-2"
              >
                <option value="admin">Admin Operations</option>
                <option value="ngo">Shelter / NGO Partner</option>
                <option value="donor">Food Donor</option>
                <option value="volunteer">Rescue Volunteer</option>
                <option value="public">Public View</option>
              </select>
            </div>

            <div className="hidden xl:flex items-center gap-1.5 bg-surface-container-high px-3 py-1.5 rounded-full text-[11px] font-semibold text-on-surface-variant whitespace-nowrap">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              <span>Bengaluru Central Cluster Active</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 relative">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setNotifOpen((prev) => !prev)}
              className="relative p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error ring-2 ring-surface" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 p-4 z-50">
                <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-surface-container">
                  <span className="font-headline text-sm font-bold text-primary">
                    Cluster Notifications ({unreadCount} unread)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onMarkAllRead();
                      setNotifOpen(false);
                    }}
                    className="text-xs font-semibold text-secondary hover:text-primary cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg text-left ${
                        n.read ? 'bg-surface-container-low/60' : 'bg-secondary-container/25'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-primary">{n.title}</span>
                        <span className="text-[10px] text-outline shrink-0">{n.timeAgo}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">{n.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => onNavigate('dispatch-control')}
              aria-label="Operator profile"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary cursor-pointer hover:bg-primary-container transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </button>
          </div>
        </header>

        <main className="w-full pt-20 bg-surface min-h-screen px-4 sm:px-6 pb-10">
          <div className="flex flex-col w-full">{children}</div>
        </main>
      </div>

      {/* Toast Stack */}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-primary text-on-primary text-xs font-medium px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 pointer-events-auto"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary-container shrink-0">
              {toast.tone === 'warning' ? 'warning' : 'info'}
            </span>
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
