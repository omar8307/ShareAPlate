import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, UserCheck, ChevronDown, LogOut, CheckCircle, ShieldAlert } from 'lucide-react';
import type { UserRole } from '../../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenNewDonationModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenNewDonationModal }) => {
  const { currentUser, demoUsers, switchPersona, logout, openAuthModal } = useAuth();
  const { unreadCount, setIsOpen: setOpenNotifs, isOpen: notifsOpen } = useNotifications();
  const [isPersonaDropdownOpen, setIsPersonaDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'explore', label: 'Explore Food' },
    { id: 'map', label: 'Rescue Map' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'impact', label: 'Impact' },
    { id: 'about', label: 'About Us' },
  ];

  // Role dashboard tabs
  const getRoleDashboardLabel = (role?: UserRole) => {
    switch (role) {
      case 'donor':
        return 'Donor Portal';
      case 'ngo':
        return 'NGO Portal';
      case 'volunteer':
        return 'Volunteer Hub';
      case 'admin':
        return 'Admin Console';
      default:
        return 'Dashboard';
    }
  };

  return (
    <>
      {/* Demo Persona Quick Switcher Bar */}
      <div className="bg-[#1B4332] text-xs text-white/90 border-b border-[#2E7D32]/30 px-4 py-1.5 flex items-center justify-between overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#74C69D] flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" /> Demo Switcher:
          </span>
          <span className="text-white/70 hidden sm:inline">Testing 4 roles in Bengaluru</span>
        </div>

        <div className="flex items-center gap-1.5">
          {demoUsers.slice(0, 5).map((user) => {
            const isActive = currentUser?.id === user.id;
            return (
              <button
                key={user.id}
                onClick={() => {
                  switchPersona(user);
                  setCurrentTab(user.role);
                }}
                className={`px-2.5 py-0.5 rounded text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#74C69D] text-[#1B4332] font-bold shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white/90'
                }`}
              >
                {user.role === 'donor' && '👨‍🍳 Donor'}
                {user.role === 'ngo' && (user.isVerified ? '🏢 Verified NGO' : '⏳ Pending NGO')}
                {user.role === 'volunteer' && '🚴 Volunteer'}
                {user.role === 'admin' && '🛡️ Admin'}
                <span className="opacity-75 text-[11px] ml-1">({user.name.split(' ')[0]})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-5 Nav Links) — Zone 3 (1 Primary Action) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark */}
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-[#1B4332] whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-[#2E7D32] flex items-center justify-center text-white text-lg font-black shadow-sm">
              S
            </span>
            <span>
              Share<span className="text-[#2E7D32]">A</span>Plate
            </span>
          </button>

          {/* Zone 2: 4-5 Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer border-b-2 ${
                    isActive
                      ? 'border-[#2E7D32] text-[#1B4332] font-semibold'
                      : 'border-transparent hover:text-[#2E7D32]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* If user is logged in, link to their dedicated dashboard */}
            {currentUser && (
              <button
                onClick={() => setCurrentTab(currentUser.role)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer border-b-2 ${
                  currentTab === currentUser.role
                    ? 'border-[#2E7D32] text-[#1B4332] font-bold'
                    : 'border-transparent text-[#2E7D32] font-medium hover:text-[#1B4332]'
                }`}
              >
                {getRoleDashboardLabel(currentUser.role)}
              </button>
            )}
          </nav>

          {/* Zone 3: 1 Primary Action Area */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notification Bell */}
            <button
              onClick={() => setOpenNotifs(!notifsOpen)}
              className="relative p-2 rounded-lg text-neutral-600 hover:text-[#2E7D32] hover:bg-neutral-50 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#F4A261] text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsPersonaDropdownOpen(!isPersonaDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-300 bg-neutral-50/80 text-xs font-medium text-neutral-800 transition-colors whitespace-nowrap shrink-0"
                >
                  <div className="w-6 h-6 rounded-full bg-[#2E7D32] text-white font-bold flex items-center justify-center text-xs">
                    {currentUser.name[0]}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="font-semibold text-neutral-900 leading-tight">{currentUser.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-neutral-500 capitalize">{currentUser.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {/* Dropdown Menu */}
                {isPersonaDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="text-xs font-semibold text-neutral-900">{currentUser.name}</p>
                      <p className="text-[11px] text-neutral-500 truncate">{currentUser.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-[#2E7D32] uppercase tracking-wider">
                          Role: {currentUser.role}
                        </span>
                        {currentUser.role === 'ngo' && (
                          currentUser.isVerified ? (
                            <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5">
                              <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-700 font-medium flex items-center gap-0.5">
                              <ShieldAlert className="w-3 h-3 text-amber-600" /> Pending Review
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setCurrentTab(currentUser.role);
                          setIsPersonaDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-[#F7FAF7] hover:text-[#2E7D32]"
                      >
                        Go to {getRoleDashboardLabel(currentUser.role)}
                      </button>

                      {currentUser.role === 'donor' && onOpenNewDonationModal && (
                        <button
                          onClick={() => {
                            onOpenNewDonationModal();
                            setIsPersonaDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-[#2E7D32] hover:bg-[#F7FAF7]"
                        >
                          + Post New Food Donation
                        </button>
                      )}
                    </div>

                    <div className="border-t border-neutral-100 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsPersonaDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#2E7D32] rounded-lg hover:bg-[#1B4332] transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                Sign In
              </button>
            )}

            {/* Quick Primary CTA: "Donate Food" */}
            <button
              onClick={() => {
                if (currentUser?.role === 'donor' && onOpenNewDonationModal) {
                  onOpenNewDonationModal();
                } else {
                  // Switch to donor and open donor dashboard
                  const donorUser = demoUsers.find((u) => u.role === 'donor') || demoUsers[0];
                  if (donorUser) switchPersona(donorUser);
                  setCurrentTab('donor');
                  if (onOpenNewDonationModal) {
                    setTimeout(() => onOpenNewDonationModal(), 100);
                  }
                }
              }}
              className="hidden sm:inline-flex px-3.5 py-2 text-xs font-bold text-white bg-[#F4A261] rounded-lg hover:bg-[#e7924d] transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              Donate Food
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
