import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, UserReview, SavedCategory } from '../types';

interface PreferencesContextType {
  preferences: UserPreferences;
  setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  resetPreferences: () => void;
  reviews: UserReview[];
  addReview: (review: Omit<UserReview, 'id' | 'createdAt'>) => void;
  savedCategories: SavedCategory[];
  addCategory: (name: string) => void;
  saveRestaurant: (restaurantId: string, categoryId: string) => void;
  removeRestaurant: (restaurantId: string, categoryId: string) => void;
  isRestaurantSaved: (restaurantId: string) => boolean;
  getSavedCategoryForRestaurant: (restaurantId: string) => SavedCategory | undefined;
}

const defaultPreferences: UserPreferences = {
  mealType: null,
  temperature: null,
  budget: null,
  timeAvailable: null,
  maxDistance: null,
  healthPreference: null,
};

const defaultCategories: SavedCategory[] = [
  { id: 'favorites', name: 'Favorites', restaurantIds: [] },
  { id: 'want-to-try', name: 'Want to Try', restaurantIds: [] },
];

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [savedCategories, setSavedCategories] = useState<SavedCategory[]>(defaultCategories);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedReviews = await AsyncStorage.getItem('reviews');
      const storedCategories = await AsyncStorage.getItem('savedCategories');

      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      }
      if (storedCategories) {
        setSavedCategories(JSON.parse(storedCategories));
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  const setPreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  const addReview = async (review: Omit<UserReview, 'id' | 'createdAt'>) => {
    const newReview: UserReview = {
      ...review,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    await AsyncStorage.setItem('reviews', JSON.stringify(updatedReviews));
  };

  const addCategory = async (name: string) => {
    const newCategory: SavedCategory = {
      id: Date.now().toString(),
      name,
      restaurantIds: [],
    };
    const updatedCategories = [...savedCategories, newCategory];
    setSavedCategories(updatedCategories);
    await AsyncStorage.setItem('savedCategories', JSON.stringify(updatedCategories));
  };

  const saveRestaurant = async (restaurantId: string, categoryId: string) => {
    const updatedCategories = savedCategories.map(category => {
      if (category.id === categoryId && !category.restaurantIds.includes(restaurantId)) {
        return {
          ...category,
          restaurantIds: [...category.restaurantIds, restaurantId],
        };
      }
      return category;
    });
    setSavedCategories(updatedCategories);
    await AsyncStorage.setItem('savedCategories', JSON.stringify(updatedCategories));
  };

  const removeRestaurant = async (restaurantId: string, categoryId: string) => {
    const updatedCategories = savedCategories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          restaurantIds: category.restaurantIds.filter(id => id !== restaurantId),
        };
      }
      return category;
    });
    setSavedCategories(updatedCategories);
    await AsyncStorage.setItem('savedCategories', JSON.stringify(updatedCategories));
  };

  const isRestaurantSaved = (restaurantId: string): boolean => {
    return savedCategories.some(category => category.restaurantIds.includes(restaurantId));
  };

  const getSavedCategoryForRestaurant = (restaurantId: string): SavedCategory | undefined => {
    return savedCategories.find(category => category.restaurantIds.includes(restaurantId));
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        setPreference,
        resetPreferences,
        reviews,
        addReview,
        savedCategories,
        addCategory,
        saveRestaurant,
        removeRestaurant,
        isRestaurantSaved,
        getSavedCategoryForRestaurant,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
