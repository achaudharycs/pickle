import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { RestaurantCard } from '../../components/RestaurantCard';
import { usePreferences } from '../../context/PreferencesContext';
import { mockRestaurants } from '../../data/restaurants';
import { getRecommendations, hasActiveFilters } from '../../services/recommendationEngine';

type ViewMode = 'list' | 'map';
type SortOption = 'rating' | 'distance' | 'price';

export default function ExploreScreen() {
  const { preferences } = usePreferences();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');

  const filteredByPrefs = hasActiveFilters(preferences)
    ? getRecommendations(mockRestaurants, preferences)
    : mockRestaurants;

  const filteredBySearch = searchQuery
    ? filteredByPrefs.filter(
        r =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : filteredByPrefs;

  const sorted = [...filteredBySearch].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
        return a.distance - b.distance;
      case 'price':
        return a.priceLevel - b.priceLevel;
      default:
        return 0;
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants or cuisines..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.controls}>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
              List
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
            onPress={() => setViewMode('map')}
          >
            <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
              Map
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort:</Text>
          {(['rating', 'distance', 'price'] as SortOption[]).map(option => (
            <TouchableOpacity
              key={option}
              style={[styles.sortButton, sortBy === option && styles.sortButtonActive]}
              onPress={() => setSortBy(option)}
            >
              <Text style={[styles.sortButtonText, sortBy === option && styles.sortButtonTextActive]}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {hasActiveFilters(preferences) && (
        <View style={styles.filterBadge}>
          <Text style={styles.filterBadgeText}>
            Filtered by your preferences
          </Text>
        </View>
      )}

      {viewMode === 'list' ? (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          <Text style={styles.resultsCount}>{sorted.length} restaurants</Text>
          {sorted.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
          <View style={styles.bottomPadding} />
        </ScrollView>
      ) : (
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>Map View</Text>
            <Text style={styles.mapPlaceholderSubtext}>
              {sorted.length} restaurants in your area
            </Text>
            <Text style={styles.mapNote}>
              (Map requires device location permissions)
            </Text>
          </View>
          <ScrollView
            horizontal
            style={styles.mapCards}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mapCardsContent}
          >
            {sorted.slice(0, 5).map(restaurant => (
              <View key={restaurant.id} style={styles.mapCard}>
                <RestaurantCard restaurant={restaurant} compact />
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  controls: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4,
    marginBottom: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: '#4CAF50',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  sortButtonActive: {
    backgroundColor: '#E8F5E9',
  },
  sortButtonText: {
    fontSize: 13,
    color: '#666',
  },
  sortButtonTextActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  filterBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterBadgeText: {
    fontSize: 13,
    color: '#4CAF50',
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  bottomPadding: {
    height: 20,
  },
  mapContainer: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#999',
  },
  mapPlaceholderSubtext: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
  },
  mapNote: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 16,
  },
  mapCards: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  mapCardsContent: {
    paddingHorizontal: 8,
  },
  mapCard: {
    width: 300,
    marginHorizontal: 8,
  },
});
