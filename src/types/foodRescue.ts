export type FoodCategory = 'Cooked Meals' | 'Bakery' | 'Raw Ingredients' | 'Dairy';
export type UrgencyLevel = 'Urgent' | 'High' | 'Medium';
export type DietaryType = 'Pure Veg' | 'Vegan' | 'Non-Veg';
export type StorageType = 'Hot Pack' | 'Room Temp' | 'Chilled Pack' | 'Cold Storage';

export interface TimelineEvent {
  time: string;
  event: string;
  actor: string;
}

export interface SurplusFoodItem {
  id: string;
  title: string;
  donorName: string;
  donorType: 'Caterer' | 'Bakery' | 'Corporate Canteen' | 'Wholesale' | 'Banquet Hall';
  category: FoodCategory;
  dietary: DietaryType;
  quantityKg: number;
  servings: number;
  cookTime: string;
  storage: StorageType;
  storageTempDesc: string;
  urgency: UrgencyLevel;
  deadline: string;
  location: string;
  distanceKm: number;
  mapCoords: {
    lat: number;
    lng: number;
    xPercent: number;
    yPercent: number;
    pinNumber: number;
  };
  smartMatchPercent: number;
  recommendedNGO: string;
  safetyNotes: string;
  fssaiLicense: string;
  allergens: string[];
  status: 'available' | 'claimed' | 'in_transit' | 'delivered';
  claimedByNGO?: string;
  pickupOtp?: string;
  createdAt: string;
  timeline: TimelineEvent[];
}

export interface NGORequirement {
  id: string;
  ngoName: string;
  ngoCode: string;
  portions: number;
  location: string;
  dietary: string;
  targetTime: string;
  urgency: string;
  timestamp: string;
}

export interface VolunteerMission {
  id: string;
  code: string;
  foodTitle: string;
  donor: string;
  donorAddress: string;
  shelter: string;
  shelterAddress: string;
  quantity: string;
  stage: 1 | 2 | 3;
  otp: string;
  thermalCargoTemp: number;
  estMinutes: number;
  distance: string;
  ngoContact: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'urgent' | 'success' | 'info';
  read: boolean;
  actionTab?: RoleTabKey;
}

export type RoleTabKey =
  | 'marketplace'
  | 'donor-hub'
  | 'ngo-portal'
  | 'volunteer-task'
  | 'impact-analytics'
  | 'how-it-works'
  | 'admin-oversight';
