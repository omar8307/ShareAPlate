import React, { useState } from 'react';
import {
  SurplusFoodItem,
  NGORequirement,
  VolunteerMission,
  AppNotification,
  RoleTabKey,
} from './types/foodRescue';
import {
  INITIAL_FOOD_ITEMS,
  INITIAL_NGO_REQUIREMENTS,
  INITIAL_MISSION,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MarketplaceTab } from './components/MarketplaceTab';
import { DonorHubTab } from './components/DonorHubTab';
import { NGOPortalTab } from './components/NGOPortalTab';
import { VolunteerTab } from './components/VolunteerTab';
import { ImpactTab } from './components/ImpactTab';
import { HowItWorksTab } from './components/HowItWorksTab';
import { AdminOversightTab } from './components/AdminOversightTab';
import {
  ClaimModal,
  SafetyModal,
  TimelineModal,
  TaxReceiptModal,
} from './components/Modals';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<RoleTabKey>('marketplace');

  // Shared Data State
  const [foodItems, setFoodItems] = useState<SurplusFoodItem[]>(INITIAL_FOOD_ITEMS);
  const [ngoRequirements, setNgoRequirements] = useState<NGORequirement[]>(
    INITIAL_NGO_REQUIREMENTS
  );
  const [currentMission, setCurrentMission] = useState<VolunteerMission>(INITIAL_MISSION);
  const [notifications, setNotifications] = useState<AppNotification[]>(
    INITIAL_NOTIFICATIONS
  );
  const [currentRole, setCurrentRole] = useState<'ngo' | 'donor' | 'volunteer'>('ngo');
  const [volunteerPoints, setVolunteerPoints] = useState<number>(420);

  // Live KPI counters
  const [totalRescuedKg, setTotalRescuedKg] = useState<number>(18450);
  const [totalMeals, setTotalMeals] = useState<number>(52180);

  // Modal States
  const [claimModalItem, setClaimModalItem] = useState<SurplusFoodItem | null>(null);
  const [safetyModalItem, setSafetyModalItem] = useState<SurplusFoodItem | null>(null);
  const [timelineModalItem, setTimelineModalItem] = useState<SurplusFoodItem | null>(null);
  const [isTaxReceiptOpen, setIsTaxReceiptOpen] = useState(false);

  // Tab switching with smooth scrolling to content
  const handleSelectTab = (tab: RoleTabKey, scroll: boolean = false) => {
    setActiveTab(tab);
    if (scroll) {
      const el = document.getElementById('role-navigation-bar');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Quick donate button action
  const handleQuickDonate = () => {
    setActiveTab('donor-hub');
    const el = document.getElementById('role-navigation-bar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Add new food surplus from Donor Hub
  const handleAddNewDonation = (newItem: SurplusFoodItem) => {
    setFoodItems((prev) => [newItem, ...prev]);
    setTotalRescuedKg((prev) => prev + newItem.quantityKg);
    setTotalMeals((prev) => prev + newItem.servings);

    // New notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Surplus Live on Radar',
      message: `${newItem.title} (${newItem.quantityKg} kg / ${newItem.servings} meals) posted in ${newItem.location}.`,
      time: 'Just now',
      type: 'urgent',
      read: false,
      actionTab: 'marketplace',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Add new NGO requirement
  const handleAddRequirement = (newReq: NGORequirement) => {
    setNgoRequirements((prev) => [newReq, ...prev]);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Shelter Need Broadcasted',
      message: `${newReq.ngoName} requested ${newReq.portions} meals for tonight in ${newReq.location}.`,
      time: 'Just now',
      type: 'info',
      read: false,
      actionTab: 'ngo-portal',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Confirm claim by NGO
  const handleConfirmClaim = (item: SurplusFoodItem, ngoName: string, otp: string) => {
    // Update item status
    setFoodItems((prev) =>
      prev.map((f) =>
        f.id === item.id
          ? { ...f, status: 'claimed' as const, claimedByNGO: ngoName, pickupOtp: otp }
          : f
      )
    );

    // Update active volunteer mission to mirror this real claim!
    setCurrentMission({
      id: `mission-${item.id}`,
      code: otp,
      foodTitle: item.title,
      donor: item.donorName,
      donorAddress: item.location,
      shelter: ngoName.split('(')[0].trim(),
      shelterAddress: 'Austin Town Shelter Point, Bengaluru',
      quantity: `${item.servings} Meals (${item.quantityKg} kg)`,
      stage: 1,
      otp: otp,
      thermalCargoTemp: 68,
      estMinutes: 16,
      distance: `${item.distanceKm} km`,
      ngoContact: 'Ravi Kumar (+91 98450 12891)',
    });

    // Add notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Surplus Claimed & Route Queued',
      message: `${ngoName.split('(')[0]} claimed ${item.title}. Pickup OTP: ${otp}.`,
      time: 'Just now',
      type: 'success',
      read: false,
      actionTab: 'volunteer-task',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Simulate admin new buffet surplus
  const handleSimulateNewSurplus = () => {
    const simItem: SurplusFoodItem = {
      id: `item-sim-${Date.now()}`,
      title: 'Buffet Tawa Pulao & Raita',
      donorName: 'Novotel TechPark Lounge',
      donorType: 'Banquet Hall',
      category: 'Cooked Meals',
      dietary: 'Pure Veg',
      quantityKg: 30,
      servings: 90,
      cookTime: '30 mins ago',
      storage: 'Hot Pack',
      storageTempDesc: '>65°C Insulated Hot Carrier',
      urgency: 'Urgent',
      deadline: '10:15 PM',
      location: 'Whitefield ITPL Main Gate',
      distanceKm: 6.2,
      mapCoords: {
        lat: 12.982,
        lng: 77.729,
        xPercent: 72,
        yPercent: 38,
        pinNumber: 8,
      },
      smartMatchPercent: 97,
      recommendedNGO: 'Asha Community Kitchen',
      safetyNotes:
        'Prepared under 5-star hotel hygiene standards. Aluminum sealed foil. FSSAI certified kitchen.',
      fssaiLicense: 'FSSAI #11219334000998',
      allergens: ['Dairy (raita separate)'],
      status: 'available',
      createdAt: 'Just now',
      timeline: [
        { time: 'Just now', event: 'Corporate dining surplus packed hot.', actor: 'Sous Chef' },
      ],
    };
    handleAddNewDonation(simItem);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="bg-surface font-sans text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary-container selection:text-white">
      {/* Fixed Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => handleSelectTab(tab, true)}
        onQuickDonate={handleQuickDonate}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        totalRescuedKg={totalRescuedKg}
        totalMeals={totalMeals}
      />

      {/* Main Body */}
      <main className="w-full pt-28 bg-surface flex-1">
        {/* Hero Section */}
        <HeroSection
          onSelectTab={(tab) => handleSelectTab(tab, true)}
          activeSurplusCount={foodItems.filter((i) => i.status === 'available').length}
          totalRescuedKg={totalRescuedKg}
          totalMealsServed={totalMeals}
        />

        {/* Sticky Role Switcher Navigation Bar */}
        <section
          id="role-navigation-bar"
          className="sticky top-28 z-40 bg-surface/95 backdrop-blur-md px-4 md:px-8 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border-b border-surface-container"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto pb-1">
            <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-xl">
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] transition-all cursor-pointer ${
                  activeTab === 'marketplace'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface font-medium'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                <span>1. Marketplace & Map</span>
              </button>

              <button
                onClick={() => setActiveTab('donor-hub')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] transition-all cursor-pointer ${
                  activeTab === 'donor-hub'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface font-medium'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">restaurant</span>
                <span>2. Donor Hub & AI</span>
              </button>

              <button
                onClick={() => setActiveTab('ngo-portal')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] transition-all cursor-pointer ${
                  activeTab === 'ngo-portal'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface font-medium'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">hub</span>
                <span>3. NGO Match Portal</span>
              </button>

              <button
                onClick={() => setActiveTab('volunteer-task')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] transition-all cursor-pointer ${
                  activeTab === 'volunteer-task'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface font-medium'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
                <span>4. Volunteer & QR Verify</span>
              </button>

              <button
                onClick={() => setActiveTab('impact-analytics')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] transition-all cursor-pointer ${
                  activeTab === 'impact-analytics'
                    ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface font-medium'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">query_stats</span>
                <span>5. Impact & Analytics</span>
              </button>
            </div>

            <div className="hidden xl:flex items-center gap-2 shrink-0">
              <span className="text-[12px] text-on-surface-variant font-medium">
                Active Zone:
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                Bengaluru South & East
              </span>
            </div>
          </div>
        </section>

        {/* Dynamic Tab Panels Container */}
        <div id="tab-content" className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
          {activeTab === 'marketplace' && (
            <MarketplaceTab
              items={foodItems}
              onOpenClaimModal={(item) => setClaimModalItem(item)}
              onOpenSafetyModal={(item) => setSafetyModalItem(item)}
              onOpenTimelineModal={(item) => setTimelineModalItem(item)}
            />
          )}

          {activeTab === 'donor-hub' && (
            <DonorHubTab
              onAddNewDonation={handleAddNewDonation}
              onOpenTaxReceipt={() => setIsTaxReceiptOpen(true)}
            />
          )}

          {activeTab === 'ngo-portal' && (
            <NGOPortalTab
              items={foodItems}
              requirements={ngoRequirements}
              onOpenClaimModal={(item) => setClaimModalItem(item)}
              onAddRequirement={handleAddRequirement}
            />
          )}

          {activeTab === 'volunteer-task' && (
            <VolunteerTab
              mission={currentMission}
              onUpdateMissionStage={(stage) =>
                setCurrentMission((prev) => ({ ...prev, stage }))
              }
              volunteerPoints={volunteerPoints}
              onAddPoints={(pts) => setVolunteerPoints((prev) => prev + pts)}
            />
          )}

          {activeTab === 'impact-analytics' && <ImpactTab />}

          {activeTab === 'how-it-works' && (
            <HowItWorksTab
              onExploreMarketplace={() => handleSelectTab('marketplace', true)}
              onStartDonating={() => handleSelectTab('donor-hub', true)}
            />
          )}

          {activeTab === 'admin-oversight' && (
            <AdminOversightTab onSimulateNewSurplus={handleSimulateNewSurplus} />
          )}
        </div>
      </main>

      {/* Global Modals */}
      <ClaimModal
        isOpen={!!claimModalItem}
        item={claimModalItem}
        onClose={() => setClaimModalItem(null)}
        onConfirmClaim={handleConfirmClaim}
      />

      <SafetyModal
        isOpen={!!safetyModalItem}
        item={safetyModalItem}
        onClose={() => setSafetyModalItem(null)}
      />

      <TimelineModal
        isOpen={!!timelineModalItem}
        item={timelineModalItem}
        onClose={() => setTimelineModalItem(null)}
      />

      <TaxReceiptModal
        isOpen={isTaxReceiptOpen}
        onClose={() => setIsTaxReceiptOpen(false)}
      />

      {/* Footer */}
      <Footer onSelectTab={(tab) => handleSelectTab(tab, true)} />
    </div>
  );
}
