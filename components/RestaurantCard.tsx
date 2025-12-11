import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Restaurant } from '../types';
import { usePreferences } from '../context/PreferencesContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
  compact?: boolean;
}

export function RestaurantCard({ restaurant, compact = false }: RestaurantCardProps) {
  const router = useRouter();
  const { isRestaurantSaved } = usePreferences();
  const saved = isRestaurantSaved(restaurant.id);

  const priceLabel = '$'.repeat(restaurant.priceLevel);

  const handlePress = () => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactContainer} onPress={handlePress} activeOpacity={0.7}>
        <Image source={{ uri: restaurant.imageUrl }} style={styles.compactImage} />
        <View style={styles.compactInfo}>
          <Text style={styles.compactName} numberOfLines={1}>{restaurant.name}</Text>
          <Text style={styles.compactDetails}>
            {restaurant.rating} | {priceLabel} | {restaurant.distance.toFixed(1)} mi
          </Text>
        </View>
        {saved && <Text style={styles.savedBadge}>*</Text>}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <Image source={{ uri: restaurant.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
          {saved && <Text style={styles.savedBadge}>*</Text>}
        </View>
        <Text style={styles.cuisine}>{restaurant.cuisine.join(' | ')}</Text>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Rating</Text>
            <Text style={styles.detailValue}>{restaurant.rating}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.detailValue}>{priceLabel}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Distance</Text>
            <Text style={styles.detailValue}>{restaurant.distance.toFixed(1)} mi</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{restaurant.estimatedTime} min</Text>
          </View>
        </View>
        <View style={styles.tags}>
          {restaurant.isQuickBite && <Text style={styles.tag}>Quick Bite</Text>}
          {restaurant.healthScore >= 4 && <Text style={styles.tag}>Healthy</Text>}
          {restaurant.servesHotFood && <Text style={styles.tag}>Hot</Text>}
          {restaurant.servesColdFood && <Text style={styles.tag}>Cold</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  savedBadge: {
    fontSize: 20,
    color: '#4CAF50',
    marginLeft: 8,
  },
  cuisine: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  details: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  tag: {
    backgroundColor: '#E8F5E9',
    color: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '500',
  },
  compactContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  compactImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  compactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  compactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  compactDetails: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
});
