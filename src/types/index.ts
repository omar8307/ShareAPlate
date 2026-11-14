export type UserRole = 'donor' | 'ngo' | 'volunteer' | 'admin';

export type FoodCategory =
  | 'Cooked Meals'
  | 'Packaged Food'
  | 'Bakery Products'
  | 'Fruits'
  | 'Vegetables'
  | 'Raw Ingredients'
  | 'Dairy Products'
  | 'Other';

export type DonationStatus =
  | 'Draft'
  | 'Available'
  | 'Claimed'
  | 'Pickup Scheduled'
  | 'Pickup in Progress'
  | 'Picked Up'
  | 'In Transit'
  | 'Delivered'
  | 'Expired'
  | 'Cancelled'
  | 'Rejected'
  | 'Reported';

export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  organizationName?: string;
  donorType?: 'Restaurant' | 'Bakery' | 'Hotel' | 'Catering' | 'Household' | 'Grocery' | 'Event Organizer';
  address: string;
  location: {
    lat: number;
    lng: number;
    area: string;
  };
  isVerified?: boolean; // For NGOs
  verificationDocuments?: string[];
  beneficiaryCount?: number; // For NGOs
  avatarUrl?: string;
  rating?: number;
  completedDonationsCount?: number;
  totalKgDonated?: number;
  totalHoursVolunteered?: number;
  badges?: string[];
  createdAt: string;
}

export interface StatusHistoryEntry {
  status: DonationStatus;
  timestamp: string;
  updatedBy: string;
  actorRole: UserRole;
  note?: string;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  donorType: string;
  donorPhone: string;
  foodName: string;
  category: FoodCategory;
  description: string;
  quantity: number;
  unit: 'kg' | 'packets' | 'boxes' | 'liters' | 'portions';
  estimatedMeals: number;
  imageUrl: string;
  isVegetarian: boolean;
  dietaryTags: string[]; // 'Vegan', 'Halal', 'Jain', 'Gluten-Free', etc.
  allergens: string[]; // 'Nuts', 'Dairy', 'Soy', 'None', etc.
  packagingType: string; // 'Compostable Boxes', 'Steel Containers', 'Sealed Packets', etc.
  preparationTime: string;
  storageConditions: 'Refrigerated (below 4°C)' | 'Room Temperature (Dry)' | 'Hot Holding (>60°C)' | 'Frozen';
  pickupLocation: {
    address: string;
    lat: number;
    lng: number;
    area: string;
    specialInstructions?: string;
  };
  pickupStartTime: string;
  pickupDeadline: string;
  status: DonationStatus;
  urgency: UrgencyLevel;
  claimedByNgoId?: string;
  claimedByNgoName?: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  verificationToken: string;
  otpCode: string; // 6-digit fallback
  statusHistory: StatusHistoryEntry[];
  isRecurring?: boolean;
  recurringFrequency?: 'Daily' | 'Weekly';
  safetyChecklistConfirmed: boolean;
  aiSafetyNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NgoRequirement {
  id: string;
  ngoId: string;
  ngoName: string;
  category: FoodCategory;
  requiredQuantity: number;
  unit: string;
  beneficiaryCount: number;
  requiredDate: string;
  area: string;
  urgency: UrgencyLevel;
  isVegetarianOnly: boolean;
  specialNotes?: string;
  isFulfilled: boolean;
  createdAt: string;
}

export interface VolunteerTask {
  id: string;
  donationId: string;
  volunteerId?: string;
  volunteerName?: string;
  ngoId: string;
  ngoName: string;
  donorName: string;
  foodName: string;
  quantityText: string;
  pickupAddress: string;
  pickupCoords: { lat: number; lng: number };
  deliveryAddress: string;
  deliveryCoords: { lat: number; lng: number };
  estimatedDistanceKm: number;
  deadline: string;
  status: 'Available' | 'Assigned' | 'Picked Up' | 'In Transit' | 'Completed' | 'Cancelled';
  pickupConfirmedAt?: string;
  deliveryConfirmedAt?: string;
  notes?: string;
}

export interface PlatformNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'claim' | 'pickup' | 'delivery' | 'safety' | 'verification' | 'system';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface ImpactStats {
  totalFoodRescuedKg: number;
  totalMealsProvided: number;
  totalDonationsCompleted: number;
  activeDonationsCount: number;
  verifiedNgosCount: number;
  activeVolunteersCount: number;
  co2PreventedKg: number;
  waterSavedLiters: number;
  successRatePercent: number;
}

export interface SmartMatchResult {
  ngoId: string;
  ngoName: string;
  distanceKm: number;
  matchScore: number; // 0 - 100
  breakdown: {
    locationScore: number;
    quantityScore: number;
    timeScore: number;
    categoryScore: number;
  };
  explanation: string;
  beneficiaries: number;
  preferredCategories: string[];
}
