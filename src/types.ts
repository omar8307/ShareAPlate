export type NavRoute =
  | 'dispatch-control'
  | 'surplus-manifest'
  | 'ngo-directory'
  | 'volunteer-dispatch'
  | 'food-safety-audit'
  | 'home';

export type PersonaRole = 'admin' | 'ngo' | 'donor' | 'volunteer' | 'public';

export type DietaryType = 'Pure Veg' | 'Non-Veg' | 'Halal' | 'Egg / Veg Mix';

export type ThermalHolding = 'hot' | 'cold' | 'ambient';

export interface SurplusListing {
  id: string;
  manifestCode: string;
  donorName: string;
  donorLocation: string;
  locality: 'Indiranagar' | 'Koramangala' | 'Whitefield' | 'Jayanagar';
  category: 'cooked' | 'bakery' | 'groceries' | 'packaged';
  title: string;
  description: string;
  quantity: number;
  unit: 'meals' | 'kg' | 'crates';
  dietary: DietaryType;
  thermalHolding: ThermalHolding;
  tempLabel: string;
  expiryLabel: string;
  urgent: boolean;
  distanceKm: number;
  rating: number;
  status: 'awaiting_claim' | 'claimed' | 'en_route' | 'delivered';
  claimedByNgo?: string;
  assignedVolunteer?: string;
  etaText?: string;
  handlingSpec: string;
  imageUrl?: string;
  imageAlt?: string;
  viewersCount?: number;
  pickupWindow?: string;
  fssaiNotice?: string;
}

export interface NgoKycApplication {
  id: string;
  initials: string;
  name: string;
  trustReg: string;
  beneficiaryTarget: string;
  locationFacility: string;
  statusBadge: string;
  statusTone: 'warning' | 'ready' | 'review';
  facilityPhotoUrl: string;
  facilityCoords: string;
  docs: {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    previewLabel: string;
  }[];
}

export interface StandbyRescueTask {
  id: string;
  routeTitle: string;
  payloadSummary: string;
  statusLabel: string;
  tone: 'secondary' | 'tertiary';
  donorPin: string;
  ngoContact: string;
  distanceKm: string;
}

export interface ThermalSensorCard {
  id: string;
  title: string;
  statusLabel: string;
  reading: string;
  targetLabel: string;
  deviceLabel: string;
  subStatus: string;
  footerLabel: string;
  footerValue: string;
  progressPct: number;
  kind: 'cold' | 'hot';
}

export interface UnmetNeed {
  id: string;
  campName: string;
  needType: 'Dry Ration Kits' | 'Cooked Hot Meals';
  quantity: number;
  window: string;
  notes: string;
  postedAt: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  tone?: 'info' | 'success' | 'warning';
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  timeAgo: string;
  read: boolean;
}
