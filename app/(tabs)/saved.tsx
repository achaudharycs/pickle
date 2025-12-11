import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import { RestaurantCard } from '../../components/RestaurantCard';
import { usePreferences } from '../../context/PreferencesContext';
import { mockRestaurants } from '../../data/restaurants';

export default function SavedScreen() {
  const { savedCategories, addCategory } = usePreferences();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('favorites');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const selectedCategory = savedCategories.find(c => c.id === selectedCategoryId);
  const savedRestaurants = selectedCategory
    ? mockRestaurants.filter(r => selectedCategory.restaurantIds.includes(r.id))
    : [];

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowAddModal(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal
        style={styles.categoryTabs}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryTabsContent}
      >
        {savedCategories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryTab,
              selectedCategoryId === category.id && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategoryId(category.id)}
          >
            <Text
              style={[
                styles.categoryTabText,
                selectedCategoryId === category.id && styles.categoryTabTextActive,
              ]}
            >
              {category.name}
            </Text>
            <Text style={styles.categoryCount}>{category.restaurantIds.length}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.addCategoryButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addCategoryText}>+ Add</Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {savedRestaurants.length > 0 ? (
          <>
            {savedRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
            <View style={styles.bottomPadding} />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No saved restaurants yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Save restaurants from the explore tab to see them here
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={showAddModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAddModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Category</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Category name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleAddCategory}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  categoryTabs: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    maxHeight: 60,
  },
  categoryTabsContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    alignItems: 'center',
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    gap: 6,
  },
  categoryTabActive: {
    backgroundColor: '#E8F5E9',
  },
  categoryTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTabTextActive: {
    color: '#4CAF50',
  },
  categoryCount: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  addCategoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  addCategoryText: {
    fontSize: 14,
    color: '#999',
  },
  list: {
    flex: 1,
    paddingTop: 8,
  },
  bottomPadding: {
    height: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
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
    padding: 24,
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
  modalInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
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
