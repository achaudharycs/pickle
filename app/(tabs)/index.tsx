import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { QuestionCard } from '../../components/QuestionCard';
import { RestaurantCard } from '../../components/RestaurantCard';
import { usePreferences } from '../../context/PreferencesContext';
import { questions, mockRestaurants } from '../../data/restaurants';
import { getRecommendations, getActiveFilterCount } from '../../services/recommendationEngine';
import { UserPreferences } from '../../types';

export default function HomeScreen() {
  const router = useRouter();
  const { preferences, setPreference, resetPreferences } = usePreferences();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const recommendations = getRecommendations(mockRestaurants, preferences);
  const activeFilters = getActiveFilterCount(preferences);
  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectOption = (value: string | number) => {
    const key = currentQuestion.id as keyof UserPreferences;
    setPreference(key, value as UserPreferences[typeof key]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleReset = () => {
    resetPreferences();
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleViewAll = () => {
    router.push('/explore');
  };

  if (showResults) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {recommendations.length > 0
              ? `Found ${recommendations.length} matches!`
              : 'No matches found'}
          </Text>
          <Text style={styles.resultsSubtitle}>
            Based on {activeFilters} preference{activeFilters !== 1 ? 's' : ''}
          </Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Start Over</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.resultsList} showsVerticalScrollIndicator={false}>
          {recommendations.length > 0 ? (
            <>
              <Text style={styles.topPickLabel}>Top Pick</Text>
              <RestaurantCard restaurant={recommendations[0]} />
              {recommendations.length > 1 && (
                <>
                  <Text style={styles.otherPicksLabel}>Other Options</Text>
                  {recommendations.slice(1, 5).map(restaurant => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} compact />
                  ))}
                  {recommendations.length > 5 && (
                    <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAll}>
                      <Text style={styles.viewAllText}>
                        View all {recommendations.length} results
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </>
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                Try adjusting your preferences to find more options
              </Text>
            </View>
          )}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progress}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentQuestionIndex + 1} of {questions.length}
        </Text>
      </View>

      <ScrollView
        style={styles.questionContainer}
        contentContainerStyle={styles.questionContent}
        showsVerticalScrollIndicator={false}
      >
        <QuestionCard
          question={currentQuestion}
          selectedValue={preferences[currentQuestion.id]}
          onSelect={handleSelectOption}
        />
      </ScrollView>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
          onPress={handleBack}
          disabled={currentQuestionIndex === 0}
        >
          <Text
            style={[styles.navButtonText, currentQuestionIndex === 0 && styles.navButtonTextDisabled]}
          >
            Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  progress: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  questionContainer: {
    flex: 1,
  },
  questionContent: {
    paddingVertical: 20,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: '#999',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  resultsHeader: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  resultsSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  resetButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  resultsList: {
    flex: 1,
  },
  topPickLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  otherPicksLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  viewAllButton: {
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    alignItems: 'center',
  },
  viewAllText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noResults: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});
