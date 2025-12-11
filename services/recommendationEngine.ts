import { Restaurant, UserPreferences } from '../types';

export function filterRestaurants(
  restaurants: Restaurant[],
  preferences: UserPreferences
): Restaurant[] {
  let filtered = [...restaurants];

  // Filter by meal type (quick bite vs full meal)
  if (preferences.mealType === 'quick') {
    filtered = filtered.filter(r => r.isQuickBite);
  } else if (preferences.mealType === 'full') {
    filtered = filtered.filter(r => !r.isQuickBite);
  }

  // Filter by temperature preference
  if (preferences.temperature === 'hot') {
    filtered = filtered.filter(r => r.servesHotFood);
  } else if (preferences.temperature === 'cold') {
    filtered = filtered.filter(r => r.servesColdFood);
  }
  // 'both' or null means no filter

  // Filter by budget
  if (preferences.budget !== null) {
    filtered = filtered.filter(r => r.priceLevel <= preferences.budget!);
  }

  // Filter by time available
  if (preferences.timeAvailable !== null) {
    // Account for travel time (rough estimate: 5 min walking per 0.5 miles)
    filtered = filtered.filter(r => {
      const travelTime = r.distance * 10; // minutes
      const totalTime = r.estimatedTime + travelTime;
      return totalTime <= preferences.timeAvailable!;
    });
  }

  // Filter by distance
  if (preferences.maxDistance !== null) {
    filtered = filtered.filter(r => r.distance <= preferences.maxDistance!);
  }

  // Filter by health preference
  if (preferences.healthPreference === 'healthy') {
    filtered = filtered.filter(r => r.healthScore >= 4);
  } else if (preferences.healthPreference === 'indulgent') {
    filtered = filtered.filter(r => r.healthScore <= 2);
  }
  // 'any' or null means no filter

  return filtered;
}

export function sortRestaurants(
  restaurants: Restaurant[],
  _preferences: UserPreferences
): Restaurant[] {
  return [...restaurants].sort((a, b) => {
    // Primary: Rating (higher is better)
    const ratingDiff = b.rating - a.rating;
    if (Math.abs(ratingDiff) > 0.2) {
      return ratingDiff;
    }

    // Secondary: Distance (closer is better)
    const distanceDiff = a.distance - b.distance;
    if (Math.abs(distanceDiff) > 0.3) {
      return distanceDiff;
    }

    // Tertiary: Review count (more reviews = more reliable)
    return b.reviewCount - a.reviewCount;
  });
}

export function getRecommendations(
  restaurants: Restaurant[],
  preferences: UserPreferences
): Restaurant[] {
  const filtered = filterRestaurants(restaurants, preferences);
  const sorted = sortRestaurants(filtered, preferences);
  return sorted;
}

export function getTopPick(
  restaurants: Restaurant[],
  preferences: UserPreferences
): Restaurant | null {
  const recommendations = getRecommendations(restaurants, preferences);
  return recommendations[0] || null;
}

export function hasActiveFilters(preferences: UserPreferences): boolean {
  return Object.values(preferences).some(value => value !== null);
}

export function getActiveFilterCount(preferences: UserPreferences): number {
  return Object.values(preferences).filter(value => value !== null).length;
}
