import { useCallback, useState } from 'react';
import { Shell } from './components/Shell';
import {
  INITIAL_KYC_QUEUE,
  INITIAL_NOTIFICATIONS,
  INITIAL_SURPLUS_LISTINGS,
} from './data/initialData';
import {
  NavRoute,
  NgoKycApplication,
  NotificationItem,
  PersonaRole,
  SurplusListing,
  ToastMessage,
  UnmetNeed,
} from './types';
import { CentralDispatchView } from './views/CentralDispatchView';
import { DonorDashboardView } from './views/DonorDashboardView';
import { NgoDiscoveryView } from './views/NgoDiscoveryView';
import { PublicPortalView } from './views/PublicPortalView';
import { SafetyAuditView } from './views/SafetyAuditView';
import { VolunteersFleetView } from './views/VolunteersFleetView';

const ROUTE_TO_PERSONA: Record<NavRoute, PersonaRole> = {
  'dispatch-control': 'admin',
  'surplus-manifest': 'donor',
  'ngo-directory': 'ngo',
  'volunteer-dispatch': 'volunteer',
  'food-safety-audit': 'admin',
  home: 'public',
};

const PERSONA_TO_ROUTE: Record<PersonaRole, NavRoute> = {
  admin: 'dispatch-control',
  donor: 'surplus-manifest',
  ngo: 'ngo-directory',
  volunteer: 'volunteer-dispatch',
  public: 'home',
};

export default function App() {
  const [activeRoute, setActiveRoute] = useState<NavRoute>('dispatch-control');
  const [activePersona, setActivePersona] = useState<PersonaRole>('admin');

  const [surplusListings, setSurplusListings] = useState<SurplusListing[]>(INITIAL_SURPLUS_LISTINGS);
  const [kycQueue] = useState<NgoKycApplication[]>(INITIAL_KYC_QUEUE);
  const [pendingKycCount, setPendingKycCount] = useState<number>(28);
  const [unmetNeeds, setUnmetNeeds] = useState<UnmetNeed[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (text: string, tone: 'info' | 'success' | 'warning' = 'info') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, text, tone }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const pushNotification = useCallback((title: string, detail: string) => {
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title,
        detail,
        timeAgo: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  }, []);

  const handleNavigate = (route: NavRoute) => {
    setActiveRoute(route);
    setActivePersona(ROUTE_TO_PERSONA[route]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePersonaChange = (role: PersonaRole) => {
    setActivePersona(role);
    setActiveRoute(PERSONA_TO_ROUTE[role]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddSurplusListing = (
    draft: Omit<SurplusListing, 'id' | 'manifestCode' | 'status'>
  ) => {
    const seq = 987 + surplusListings.length;
    const newListing: SurplusListing = {
      ...draft,
      id: `donor-new-${Date.now()}`,
      manifestCode: `MNF-2024-${seq}`,
      status: 'awaiting_claim',
    };
    setSurplusListings((prev) => [newListing, ...prev]);
    pushNotification(
      `New Surplus Posted (${newListing.manifestCode})`,
      `${newListing.donorName}: ${newListing.quantity} ${newListing.unit} in ${newListing.locality}.`
    );
  };

  const handleClaimListing = (listingId: string, ngoName: string) => {
    setSurplusListings((prev) =>
      prev.map((item) =>
        item.id === listingId
          ? {
              ...item,
              status: 'claimed',
              claimedByNgo: ngoName,
              assignedVolunteer: 'Karthik R. (Fleet #14)',
              etaText: 'Pickup ETA 12m',
            }
          : item
      )
    );
    pushNotification(
      `Surplus Claimed by ${ngoName}`,
      `Courier Karthik R. assigned for immediate pickup.`
    );
  };

  const handleCancelListing = (listingId: string) => {
    setSurplusListings((prev) => prev.filter((item) => item.id !== listingId));
    showToast('Manifest listing withdrawn from active rescue grid.', 'warning');
  };

  const handleBumpListing = (listingId: string) => {
    setSurplusListings((prev) =>
      prev.map((item) =>
        item.id === listingId
          ? { ...item, viewersCount: (item.viewersCount || 2) + 2 }
          : item
      )
    );
    showToast('Priority alert bumped to 8 nearby certified NGO nodes.', 'info');
  };

  const handleApproveKyc = (_ngoId: string, ngoName: string) => {
    setPendingKycCount((prev) => Math.max(0, prev - 1));
    showToast(`${ngoName} approved for operations.`, 'success');
    pushNotification('NGO KYC Approved', `${ngoName} cleared FSSAI & 80G verification.`);
  };

  const handleSimulateUrgentIntake = () => {
    const seq = 990 + surplusListings.length;
    const urgentBatch: SurplusListing = {
      id: `urgent-${Date.now()}`,
      manifestCode: `MNF-2024-${seq}`,
      donorName: 'Marriott Whitefield Banquet',
      donorLocation: 'EPIP Zone, Whitefield • Urgent Dinner Surplus',
      locality: 'Whitefield',
      category: 'cooked',
      title: '120 Packed Vegetarian Dinners',
      description: 'Urgent corporate event surplus hot-held at 66°C in insulated trays.',
      quantity: 120,
      unit: 'meals',
      dietary: 'Pure Veg',
      thermalHolding: 'hot',
      tempLabel: 'Packed at 66°C',
      expiryLabel: 'Urgent < 75m',
      urgent: true,
      distanceKm: 1.9,
      rating: 4.9,
      status: 'awaiting_claim',
      handlingSpec: 'FSSAI Checklist Signed',
    };
    setSurplusListings((prev) => [urgentBatch, ...prev]);
    showToast(
      'Incoming surplus detected: Marriott Whitefield (120 packed dinners). Matching closest EV volunteer...',
      'info'
    );
    pushNotification(
      'Urgent Intake Broadcast',
      'Marriott Whitefield added 120 packed dinners to Live Rescue Marketplace.'
    );
  };

  const handlePostUnmetNeed = (need: Omit<UnmetNeed, 'id' | 'postedAt'>) => {
    const newNeed: UnmetNeed = {
      ...need,
      id: `need-${Date.now()}`,
      postedAt: 'Just now',
    };
    setUnmetNeeds((prev) => [newNeed, ...prev]);
    pushNotification(
      `NGO Unmet Need: ${need.campName}`,
      `Requested ${need.quantity} ${need.needType} (${need.window}).`
    );
  };

  return (
    <Shell
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      activePersona={activePersona}
      onPersonaChange={handlePersonaChange}
      notifications={notifications}
      onMarkAllRead={() =>
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      }
      toasts={toasts}
    >
      {activeRoute === 'dispatch-control' && (
        <CentralDispatchView
          kycQueue={kycQueue}
          pendingKycCount={pendingKycCount}
          onApproveKyc={handleApproveKyc}
          onSimulateIntake={handleSimulateUrgentIntake}
          onShowToast={showToast}
          surplusListings={surplusListings}
        />
      )}

      {activeRoute === 'surplus-manifest' && (
        <DonorDashboardView
          listings={surplusListings}
          onAddListing={handleAddSurplusListing}
          onCancelListing={handleCancelListing}
          onBumpListing={handleBumpListing}
          onShowToast={showToast}
        />
      )}

      {activeRoute === 'ngo-directory' && (
        <NgoDiscoveryView
          listings={surplusListings}
          unmetNeeds={unmetNeeds}
          onClaimListing={handleClaimListing}
          onPostUnmetNeed={handlePostUnmetNeed}
          onShowToast={showToast}
        />
      )}

      {activeRoute === 'volunteer-dispatch' && (
        <VolunteersFleetView listings={surplusListings} onShowToast={showToast} />
      )}

      {activeRoute === 'food-safety-audit' && (
        <SafetyAuditView listings={surplusListings} onShowToast={showToast} />
      )}

      {activeRoute === 'home' && (
        <PublicPortalView listings={surplusListings} onNavigate={handleNavigate} />
      )}
    </Shell>
  );
}
