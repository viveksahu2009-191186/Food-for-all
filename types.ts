
export enum FoodCategory {
  COOKED = 'Cooked Meals',
  GROCERY = 'Groceries',
  BAKERY = 'Bakery Items',
  PRODUCE = 'Fresh Produce',
  DAIRY = 'Dairy & Eggs',
  BULK_RELIEF = 'Bulk Relief Supply'
}

export enum FoodType {
  VEG = 'Vegetarian',
  NON_VEG = 'Non-Vegetarian',
  VEGAN = 'Vegan'
}

export enum DonationStatus {
  AVAILABLE = 'Available',
  REQUESTED = 'Requested',
  CLAIMED_BY_VOLUNTEER = 'In Transit',
  COLLECTED = 'Delivered',
  EXPIRED = 'Expired',
  EMERGENCY_PRIORITY = 'High Priority Relief'
}

export enum RiskLevel {
  LOW = 'Low Risk',
  MEDIUM = 'Moderate Risk',
  HIGH = 'High Risk'
}

export interface AchievementBadge {
  id: string;
  name: string;
  icon: string;
  color: string;
  unlockedAt?: string;
}

export interface FoodItem {
  id: string;
  donorId: string;
  donorName: string;
  donorRating: number;
  title: string;
  description: string;
  category: FoodCategory;
  foodType: FoodType;
  quantity: string;
  prepTime: string;
  expiryWindow: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  imageUrl: string;
  status: DonationStatus;
  createdAt: string;
  allergens: string[];
  priorityScore?: number;
  riskLevel: RiskLevel;
  safetyNotes: string;
  hygieneVerified: boolean;
  isReliefMode: boolean;
  claimedById?: string;
  volunteerId?: string;
}

export interface User {
  id: string;
  name: string;
  type: 'household' | 'restaurant' | 'ngo' | 'volunteer' | 'temple' | 'hostel' | 'municipality' | 'shelter' | 'anganwadi';
  avatar: string;
  rating: number;
  completedDonations: number;
  verified: boolean;
  badges: AchievementBadge[];
  totalKgSaved: number;
}
