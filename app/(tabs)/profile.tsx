import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { usePreferences } from '../../context/PreferencesContext';

export default function ProfileScreen() {
  const { reviews, savedCategories, resetPreferences } = usePreferences();

  const totalSaved = savedCategories.reduce(
    (sum, category) => sum + category.restaurantIds.length,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>@</Text>
          </View>
          <Text style={styles.username}>Pickle User</Text>
          <Text style={styles.subtitle}>Finding great food since today</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{reviews.length}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalSaved}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{savedCategories.length}</Text>
            <Text style={styles.statLabel}>Lists</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Reviews</Text>
          {reviews.length > 0 ? (
            reviews.slice(0, 5).map(review => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewRating}>
                    {'*'.repeat(review.rating)}
                  </Text>
                  <Text style={styles.reviewDate}>
                    {new Date(review.dateVisited).toLocaleDateString()}
                  </Text>
                </View>
                {review.notes && (
                  <Text style={styles.reviewNotes} numberOfLines={2}>
                    {review.notes}
                  </Text>
                )}
                {review.tags.length > 0 && (
                  <View style={styles.reviewTags}>
                    {review.tags.map(tag => (
                      <Text key={tag} style={styles.reviewTag}>
                        {tag}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              No reviews yet. Visit a restaurant and leave your thoughts!
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Notification Preferences</Text>
            <Text style={styles.settingArrow}>&gt;</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Location Settings</Text>
            <Text style={styles.settingArrow}>&gt;</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>About Pickle</Text>
            <Text style={styles.settingArrow}>&gt;</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={resetPreferences}>
            <Text style={[styles.settingText, styles.resetText]}>
              Reset Preferences
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coming Soon</Text>
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonItem}>
              AI-powered recommendations that learn from your reviews
            </Text>
            <Text style={styles.comingSoonItem}>
              Share lists with friends
            </Text>
            <Text style={styles.comingSoonItem}>
              Real restaurant data from Google Places
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Pickle v1.0.0</Text>
          <Text style={styles.footerSubtext}>Made with care</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    color: '#4CAF50',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  reviewItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewRating: {
    fontSize: 16,
    color: '#FFD700',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewNotes: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  reviewTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  reviewTag: {
    fontSize: 12,
    color: '#4CAF50',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  emptyText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#999',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  settingArrow: {
    fontSize: 16,
    color: '#ccc',
  },
  resetText: {
    color: '#E53935',
  },
  comingSoon: {
    paddingHorizontal: 16,
    gap: 12,
  },
  comingSoonItem: {
    fontSize: 14,
    color: '#666',
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 4,
  },
});
