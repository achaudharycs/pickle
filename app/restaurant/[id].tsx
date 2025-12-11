import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Modal,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { mockRestaurants } from '../../data/restaurants';
import { usePreferences } from '../../context/PreferencesContext';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    savedCategories,
    saveRestaurant,
    removeRestaurant,
    isRestaurantSaved,
    getSavedCategoryForRestaurant,
    addReview,
    reviews,
  } = usePreferences();

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewTags, setReviewTags] = useState<string[]>([]);

  const restaurant = mockRestaurants.find(r => r.id === id);
  const userReviews = reviews.filter(r => r.restaurantId === id);

  if (!restaurant) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Restaurant not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.notFoundLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const saved = isRestaurantSaved(restaurant.id);
  const savedCategory = getSavedCategoryForRestaurant(restaurant.id);
  const priceLabel = '$'.repeat(restaurant.priceLevel);

  const handleOpenMaps = () => {
    const url = `https://maps.apple.com/?address=${encodeURIComponent(restaurant.address)}`;
    Linking.openURL(url);
  };

  const handleCall = () => {
    if (restaurant.phone) {
      Linking.openURL(`tel:${restaurant.phone}`);
    }
  };

  const handleSave = (categoryId: string) => {
    if (savedCategory) {
      removeRestaurant(restaurant.id, savedCategory.id);
    }
    saveRestaurant(restaurant.id, categoryId);
    setShowSaveModal(false);
  };

  const handleUnsave = () => {
    if (savedCategory) {
      removeRestaurant(restaurant.id, savedCategory.id);
    }
  };

  const handleSubmitReview = () => {
    addReview({
      restaurantId: restaurant.id,
      rating: reviewRating,
      notes: reviewNotes,
      tags: reviewTags,
      dateVisited: new Date().toISOString().split('T')[0],
    });
    setShowReviewModal(false);
    setReviewRating(5);
    setReviewNotes('');
    setReviewTags([]);
  };

  const tagOptions = ['Great for dates', 'Fast service', 'Good portions', 'Worth the price', 'Cozy atmosphere'];

  const toggleTag = (tag: string) => {
    setReviewTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: restaurant.imageUrl }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => (saved ? handleUnsave() : setShowSaveModal(true))}
          >
            <Text style={[styles.saveButtonText, saved && styles.saveButtonTextSaved]}>
              {saved ? '* Saved' : '+ Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.cuisine}>{restaurant.cuisine.join(' | ')}</Text>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{restaurant.rating}</Text>
            <Text style={styles.statLabel}>{restaurant.reviewCount} reviews</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{priceLabel}</Text>
            <Text style={styles.statLabel}>Price</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{restaurant.distance.toFixed(1)}</Text>
            <Text style={styles.statLabel}>miles away</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <TouchableOpacity style={styles.infoRow} onPress={handleOpenMaps}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{restaurant.address}</Text>
            <Text style={styles.infoAction}>Open Maps</Text>
          </TouchableOpacity>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hours</Text>
            <Text style={styles.infoValue}>{restaurant.hours}</Text>
          </View>

          {restaurant.phone && (
            <TouchableOpacity style={styles.infoRow} onPress={handleCall}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{restaurant.phone}</Text>
              <Text style={styles.infoAction}>Call</Text>
            </TouchableOpacity>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Eat Time</Text>
            <Text style={styles.infoValue}>~{restaurant.estimatedTime} min</Text>
          </View>
        </View>

        <View style={styles.tags}>
          {restaurant.isQuickBite && <Text style={styles.tag}>Quick Bite</Text>}
          {restaurant.healthScore >= 4 && <Text style={styles.tag}>Healthy</Text>}
          {restaurant.healthScore <= 2 && <Text style={styles.tag}>Indulgent</Text>}
          {restaurant.servesHotFood && <Text style={styles.tag}>Hot Food</Text>}
          {restaurant.servesColdFood && <Text style={styles.tag}>Cold Food</Text>}
        </View>

        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => setShowReviewModal(true)}
        >
          <Text style={styles.reviewButtonText}>Write a Review</Text>
        </TouchableOpacity>

        {userReviews.length > 0 && (
          <View style={styles.reviewsSection}>
            <Text style={styles.reviewsTitle}>Your Reviews</Text>
            {userReviews.map(review => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewRating}>
                    {'*'.repeat(review.rating)}{'_'.repeat(5 - review.rating)}
                  </Text>
                  <Text style={styles.reviewDate}>
                    {new Date(review.dateVisited).toLocaleDateString()}
                  </Text>
                </View>
                {review.notes && <Text style={styles.reviewNotes}>{review.notes}</Text>}
                {review.tags.length > 0 && (
                  <View style={styles.reviewTagsContainer}>
                    {review.tags.map(tag => (
                      <Text key={tag} style={styles.reviewTag}>{tag}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      <Modal visible={showSaveModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSaveModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save to...</Text>
            {savedCategories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={styles.modalOption}
                onPress={() => handleSave(category.id)}
              >
                <Text style={styles.modalOptionText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showReviewModal} transparent animationType="slide">
        <View style={styles.reviewModalOverlay}>
          <View style={styles.reviewModalContent}>
            <Text style={styles.modalTitle}>Write a Review</Text>

            <View style={styles.ratingSelector}>
              <Text style={styles.ratingLabel}>Rating</Text>
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setReviewRating(star)}
                  >
                    <Text style={[
                      styles.ratingStar,
                      star <= reviewRating && styles.ratingStarSelected
                    ]}>
                      *
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              style={styles.reviewInput}
              placeholder="Share your experience..."
              value={reviewNotes}
              onChangeText={setReviewNotes}
              multiline
              numberOfLines={4}
            />

            <View style={styles.tagSelector}>
              <Text style={styles.tagSelectorLabel}>Tags (optional)</Text>
              <View style={styles.tagOptions}>
                {tagOptions.map(tag => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagOption,
                      reviewTags.includes(tag) && styles.tagOptionSelected
                    ]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={[
                      styles.tagOptionText,
                      reviewTags.includes(tag) && styles.tagOptionTextSelected
                    ]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowReviewModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSubmitReview}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  saveButtonTextSaved: {
    color: '#4CAF50',
  },
  cuisine: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  infoSection: {
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    width: 80,
    fontSize: 14,
    color: '#999',
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  infoAction: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    gap: 8,
  },
  tag: {
    backgroundColor: '#E8F5E9',
    color: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 13,
    fontWeight: '500',
  },
  reviewButton: {
    marginTop: 24,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewsSection: {
    marginTop: 24,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  reviewCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewRating: {
    fontSize: 16,
    color: '#FFD700',
    letterSpacing: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewNotes: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  reviewTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  reviewTag: {
    fontSize: 11,
    color: '#4CAF50',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  notFoundText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  notFoundLink: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  reviewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  reviewModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  ratingSelector: {
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingStar: {
    fontSize: 32,
    color: '#ddd',
  },
  ratingStarSelected: {
    color: '#FFD700',
  },
  reviewInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  tagSelector: {
    marginBottom: 20,
  },
  tagSelectorLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tagOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  tagOptionSelected: {
    backgroundColor: '#E8F5E9',
  },
  tagOptionText: {
    fontSize: 13,
    color: '#666',
  },
  tagOptionTextSelected: {
    color: '#4CAF50',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  modalButtonPrimary: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalButtonTextPrimary: {
    color: '#fff',
  },
});
