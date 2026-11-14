/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/public/Hero';
import { HowItWorks } from './components/public/HowItWorks';
import { Marketplace } from './components/public/Marketplace';
import { FoodRescueMap } from './components/public/FoodRescueMap';
import { ImpactPage } from './components/public/ImpactPage';
import { AboutPage } from './components/public/AboutPage';
import { DonorDashboard } from './components/dashboards/DonorDashboard';
import { NgoDashboard } from './components/dashboards/NgoDashboard';
import { VolunteerDashboard } from './components/dashboards/VolunteerDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { AuthModal } from './components/common/AuthModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { api } from './services/api';
import type { Donation, ImpactStats, User } from './types';

function MainApp() {
  const { currentUser, switchPersona, demoUsers } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [donations, setDonations] = useState<Donation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<ImpactStats | undefined>(undefined);
  const [isNewDonationModalOpen, setIsNewDonationModalOpen] = useState(false);
  const [selectedMapDonationId, setSelectedMapDonationId] = useState<string | undefined>(undefined);

  const refreshPlatformData = async () => {
    try {
      const [allDonations, allUsers, analyticsRes] = await Promise.all([
        api.getDonations(),
        api.getDemoUsers(),
        api.getAnalytics(),
      ]);
      setDonations(allDonations);
      setUsers(allUsers);
      setStats(analyticsRes.stats);
    } catch (err) {
      console.error('Error refreshing platform data:', err);
    }
  };

  useEffect(() => {
    refreshPlatformData();
  }, []);

  const handleOpenNewDonation = () => {
    // If not donor, switch to donor first
    if (currentUser?.role !== 'donor') {
      const donor = demoUsers.find((u) => u.role === 'donor') || demoUsers[0];
      if (donor) switchPersona(donor);
      setCurrentTab('donor');
    }
    setIsNewDonationModalOpen(true);
  };

  const handleSelectDonationOnMap = (donation: Donation) => {
    setSelectedMapDonationId(donation.id);
    setCurrentTab('map');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF7] text-[#263238]">
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNewDonationModal={handleOpenNewDonation}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            <Hero
              stats={stats}
              onExploreFood={() => setCurrentTab('explore')}
              onDonateFood={handleOpenNewDonation}
              onJoinVolunteer={() => {
                const vol = demoUsers.find((u) => u.role === 'volunteer');
                if (vol) switchPersona(vol);
                setCurrentTab('volunteer');
              }}
              onOpenMap={() => setCurrentTab('map')}
            />

            <HowItWorks
              onDonateClick={handleOpenNewDonation}
              onExploreClick={() => setCurrentTab('explore')}
            />

            {/* Featured Active Marketplace Preview */}
            <div className="py-12 bg-[#F7FAF7] border-t border-neutral-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7D32]">Live Surplus Dispatch</span>
                    <h2 className="text-2xl font-extrabold text-[#1B4332] tracking-tight mt-1">
                      Recent Food Donations in Bengaluru
                    </h2>
                  </div>
                  <button
                    onClick={() => setCurrentTab('explore')}
                    className="text-xs font-bold text-[#2E7D32] hover:text-[#1B4332] hover:underline self-start sm:self-auto cursor-pointer"
                  >
                    View All Active Listings →
                  </button>
                </div>

                <Marketplace
                  donations={donations.slice(0, 3)}
                  onRefresh={refreshPlatformData}
                  onOpenNewDonation={handleOpenNewDonation}
                  onSelectDonationOnMap={handleSelectDonationOnMap}
                />
              </div>
            </div>
          </>
        )}

        {currentTab === 'explore' && (
          <Marketplace
            donations={donations}
            onRefresh={refreshPlatformData}
            onOpenNewDonation={handleOpenNewDonation}
            onSelectDonationOnMap={handleSelectDonationOnMap}
          />
        )}

        {currentTab === 'map' && (
          <FoodRescueMap
            donations={donations}
            users={users}
            selectedDonationId={selectedMapDonationId}
            onSelectDonation={(d) => {
              // Could inspect details
            }}
          />
        )}

        {currentTab === 'how-it-works' && (
          <div className="py-6">
            <HowItWorks
              onDonateClick={handleOpenNewDonation}
              onExploreClick={() => setCurrentTab('explore')}
            />
          </div>
        )}

        {currentTab === 'impact' && <ImpactPage />}

        {currentTab === 'about' && <AboutPage />}

        {currentTab === 'donor' && (
          <DonorDashboard
            isOpenCreateModal={isNewDonationModalOpen}
            onCloseCreateModal={() => setIsNewDonationModalOpen(false)}
          />
        )}

        {currentTab === 'ngo' && <NgoDashboard />}

        {currentTab === 'volunteer' && <VolunteerDashboard />}

        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals & Drawers */}
      <AuthModal />
      <NotificationDrawer onNavigateToDonation={(id) => setCurrentTab('explore')} />

      {/* Footer */}
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MainApp />
      </NotificationProvider>
    </AuthProvider>
  );
}
