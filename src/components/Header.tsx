import React, { useState } from 'react';
import { RoleTabKey, AppNotification } from '../types/foodRescue';

interface HeaderProps {
  activeTab: RoleTabKey;
  onSelectTab: (tab: RoleTabKey) => void;
  onQuickDonate: () => void;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  currentRole: 'ngo' | 'donor' | 'volunteer';
  onChangeRole: (role: 'ngo' | 'donor' | 'volunteer') => void;
  totalRescuedKg: number;
  totalMeals: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onQuickDonate,
  notifications,
  onMarkNotificationRead,
  currentRole,
  onChangeRole,
  totalRescuedKg,
  totalMeals,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleProfiles = {
    ngo: {
      name: 'Kavitha S.',
      badge: 'Verified NGO',
      org: 'Feeding Hope Trust',
      icon: 'corporate_fare',
      color: 'bg-primary',
    },
    donor: {
      name: 'Chef Rajesh M.',
      badge: 'Food Donor',
      org: 'Grand Palace Caterers',
      icon: 'restaurant',
      color: 'bg-tertiary-container',
    },
    volunteer: {
      name: 'Arjun K.',
      badge: 'Transit Rider',
      org: 'BLR Rapid Squad',
      icon: 'two_wheeler',
      color: 'bg-secondary',
    },
  };

  const currentProfile = roleProfiles[currentRole];

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container">
      <div className="h-28 max-w-7xl mx-auto px-4 md:px-6 flex flex-col justify-between py-2">
        {/* Top zone: Brand, Primary Links, Quick CTA & Profile */}
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Brand */}
          <div
            className="flex items-center gap-3 shrink-0 cursor-pointer"
            onClick={() => onSelectTab('marketplace')}
          >
            <img
              alt="ShareAPlate Brand Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UjhHx0tcsDpPfuanUwyKlVzyq4uXOcYXVBTmrdgR5QCDW_pSke6NMV298_u_xglucjt0VeY9aIuSzL98QjoyQp-oGHvimDeYSzC7Wp8oUpJhhT3cZcfYCnqguCRh6u7IIJ58DtuS38IbzymKjIfTyVHCk1mW9E0dMY_6qOCx9YeC_bVDKJVWEj9eClOmJnsGPPGNhvzIAI_TI34fodpAPfFilSBeay8u1IGV_gulA5"
            />
            <div className="flex flex-col">
              <span className="text-[20px] leading-tight font-bold tracking-tight text-primary">
                ShareAPlate
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                <span className="text-[11px] text-on-surface-variant font-semibold tracking-wide">
                  Live Rescue Network (Bengaluru)
                </span>
              </div>
            </div>
          </div>

          {/* Primary Nav Links */}
          <nav className="hidden xl:flex items-center gap-6 text-[15px]">
            <button
              onClick={() => onSelectTab('marketplace')}
              className={`transition-colors font-semibold ${
                activeTab === 'marketplace'
                  ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Marketplace & Map
            </button>
            <button
              onClick={() => onSelectTab('how-it-works')}
              className={`transition-colors font-semibold ${
                activeTab === 'how-it-works'
                  ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => onSelectTab('impact-analytics')}
              className={`transition-colors font-semibold ${
                activeTab === 'impact-analytics'
                  ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Impact & Analytics
            </button>
            <button
              onClick={() => onSelectTab('admin-oversight')}
              className={`transition-colors font-semibold ${
                activeTab === 'admin-oversight'
                  ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Admin Oversight
            </button>
          </nav>

          {/* Actions on right */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Demo cluster badge */}
            <div className="hidden md:flex items-center px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-medium">
              <span className="material-symbols-outlined text-[14px] text-tertiary mr-1">tune</span>
              <span>Demo Mode: Active (Bengaluru Grid)</span>
            </div>

            {/* Quick Donate CTA */}
            <button
              onClick={onQuickDonate}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-tertiary-container text-on-tertiary-container text-[13px] font-semibold hover:bg-tertiary hover:text-on-tertiary transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Quick Donate</span>
            </button>

            {/* Notification Button */}
            <div className="relative">
              <button
                aria-label="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-surface-container-lowest shadow-2xl border border-surface-container p-4 flex flex-col gap-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[14px] text-on-surface">Live Network Alerts</span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        notifications.forEach((n) => onMarkNotificationRead(n.id));
                      }}
                      className="text-[11px] text-primary hover:underline font-semibold"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          onMarkNotificationRead(n.id);
                          if (n.actionTab) {
                            onSelectTab(n.actionTab);
                            setShowNotifications(false);
                          }
                        }}
                        className={`p-2.5 rounded-xl cursor-pointer transition-colors flex items-start gap-2.5 ${
                          n.read
                            ? 'bg-surface-container-low text-on-surface-variant opacity-80'
                            : 'bg-secondary-fixed/30 border border-primary/20 text-on-surface shadow-xs'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-[18px] mt-0.5 ${
                            n.type === 'urgent'
                              ? 'text-error animate-pulse'
                              : n.type === 'success'
                              ? 'text-primary'
                              : 'text-tertiary'
                          }`}
                        >
                          {n.type === 'urgent'
                            ? 'emergency'
                            : n.type === 'success'
                            ? 'check_circle'
                            : 'info'}
                        </span>
                        <div className="flex flex-col gap-0.5 text-left flex-1">
                          <span className="text-[12px] font-bold text-on-surface">{n.title}</span>
                          <span className="text-[11px] text-on-surface-variant leading-tight">
                            {n.message}
                          </span>
                          <span className="text-[10px] text-outline mt-1">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile & Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 pl-2 p-1 rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
              >
                <div
                  className={`w-8 h-8 rounded-full ${currentProfile.color} flex items-center justify-center text-white`}
                >
                  <span className="material-symbols-outlined text-on-primary text-[18px]">
                    {currentProfile.icon}
                  </span>
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-[13px] text-on-surface font-semibold leading-tight">
                    {currentProfile.name}
                  </span>
                  <span className="text-[10px] text-primary-container leading-none font-bold uppercase tracking-wider">
                    {currentProfile.badge}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                  expand_more
                </span>
              </button>

              {/* Role Switcher Menu */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface-container-lowest shadow-2xl border border-surface-container p-3 flex flex-col gap-2 z-50">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase px-2">
                    Switch Test Persona:
                  </span>
                  <button
                    onClick={() => {
                      onChangeRole('ngo');
                      onSelectTab('ngo-portal');
                      setShowRoleMenu(false);
                    }}
                    className={`flex items-center gap-2.5 p-2 rounded-xl text-left text-[12px] transition-colors ${
                      currentRole === 'ngo' ? 'bg-secondary-container font-bold' : 'hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-primary text-[18px]">corporate_fare</span>
                    <div>
                      <div className="font-semibold text-on-surface">Kavitha S. (NGO Shelter)</div>
                      <div className="text-[10px] text-on-surface-variant">Feeding Hope Trust</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      onChangeRole('donor');
                      onSelectTab('donor-hub');
                      setShowRoleMenu(false);
                    }}
                    className={`flex items-center gap-2.5 p-2 rounded-xl text-left text-[12px] transition-colors ${
                      currentRole === 'donor' ? 'bg-secondary-container font-bold' : 'hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-tertiary text-[18px]">restaurant</span>
                    <div>
                      <div className="font-semibold text-on-surface">Chef Rajesh M. (Caterer)</div>
                      <div className="text-[10px] text-on-surface-variant">Grand Palace Caterers</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      onChangeRole('volunteer');
                      onSelectTab('volunteer-task');
                      setShowRoleMenu(false);
                    }}
                    className={`flex items-center gap-2.5 p-2 rounded-xl text-left text-[12px] transition-colors ${
                      currentRole === 'volunteer' ? 'bg-secondary-container font-bold' : 'hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-secondary text-[18px]">two_wheeler</span>
                    <div>
                      <div className="font-semibold text-on-surface">Arjun K. (Volunteer Rider)</div>
                      <div className="text-[10px] text-on-surface-variant">BLR Rapid Squad</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary zone: Workspace Switcher Tabs & Live KPI ticker */}
        <div className="flex items-center justify-between gap-4 h-9 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] text-on-surface-variant mr-1 font-medium">Workspace:</span>
            <nav className="flex items-center gap-1">
              <button
                onClick={() => onSelectTab('marketplace')}
                className={`px-2.5 py-0.5 rounded-full text-[12px] transition-all cursor-pointer ${
                  activeTab === 'marketplace'
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                Public View
              </button>
              <button
                onClick={() => onSelectTab('donor-hub')}
                className={`px-2.5 py-0.5 rounded-full text-[12px] transition-all cursor-pointer ${
                  activeTab === 'donor-hub'
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                Donor Hub
              </button>
              <button
                onClick={() => onSelectTab('ngo-portal')}
                className={`px-2.5 py-0.5 rounded-full text-[12px] transition-all cursor-pointer ${
                  activeTab === 'ngo-portal'
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                NGO Portal
              </button>
              <button
                onClick={() => onSelectTab('volunteer-task')}
                className={`px-2.5 py-0.5 rounded-full text-[12px] transition-all cursor-pointer ${
                  activeTab === 'volunteer-task'
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                Volunteer Tasks
              </button>
              <button
                onClick={() => onSelectTab('impact-analytics')}
                className={`px-2.5 py-0.5 rounded-full text-[12px] transition-all cursor-pointer ${
                  activeTab === 'impact-analytics'
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                Impact & Analytics
              </button>
              <button
                onClick={() => onSelectTab('admin-oversight')}
                className={`px-2.5 py-0.5 rounded-full text-[12px] transition-all cursor-pointer ${
                  activeTab === 'admin-oversight'
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                Admin Oversight
              </button>
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-0.5 rounded-md bg-surface-container-low text-on-surface-variant text-[11px] font-medium shrink-0">
            <span className="text-tertiary font-bold">⚡ Today:</span>
            <span>{totalRescuedKg.toLocaleString()} kg Rescued</span>
            <span className="text-outline-variant">•</span>
            <span>{totalMeals.toLocaleString()} Meals Provided</span>
            <span className="text-outline-variant">•</span>
            <span>48 Active NGOs</span>
            <span className="text-outline-variant">•</span>
            <span>Avg Pickup: 28 mins</span>
          </div>
        </div>
      </div>
    </header>
  );
};
