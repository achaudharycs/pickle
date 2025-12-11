export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  priceLevel: 1 | 2 | 3 | 4;
  rating: number;
  reviewCount: number;
  distance: number; // miles from user
  estimatedTime: number; // minutes to eat there
  isQuickBite: boolean;
  servesHotFood: boolean;
  servesColdFood: boolean;
  healthScore: number; // 1-5, 5 being healthiest
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  imageUrl: string;
  hours: string;
  phone?: string;
}

export interface UserPreferences {
  mealType: 'quick' | 'full' | null;
  temperature: 'hot' | 'cold' | 'both' | null;
  budget: 1 | 2 | 3 | 4 | null;
  timeAvailable: 15 | 30 | 60 | 120 | null;
  maxDistance: 0.5 | 2 | 5 | null;
  healthPreference: 'healthy' | 'indulgent' | 'any' | null;
}

export interface UserReview {
  id: string;
  restaurantId: string;
  rating: number;
  tags: string[];
  notes: string;
  dateVisited: string;
  createdAt: string;
}

export interface SavedCategory {
  id: string;
  name: string;
  restaurantIds: string[];
}

export interface Question {
  id: keyof UserPreferences;
  title: string;
  subtitle: string;
  options: QuestionOption[];
}

export interface QuestionOption {
  value: string | number;
  label: string;
  icon?: string;
}
