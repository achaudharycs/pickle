import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Question, QuestionOption } from '../types';

interface QuestionCardProps {
  question: Question;
  selectedValue: string | number | null;
  onSelect: (value: string | number) => void;
}

export function QuestionCard({ question, selectedValue, onSelect }: QuestionCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{question.title}</Text>
      <Text style={styles.subtitle}>{question.subtitle}</Text>
      <View style={styles.optionsContainer}>
        {question.options.map((option: QuestionOption) => (
          <TouchableOpacity
            key={String(option.value)}
            style={[
              styles.option,
              selectedValue === option.value && styles.optionSelected,
            ]}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.7}
          >
            {option.icon && <Text style={styles.optionIcon}>{option.icon}</Text>}
            <Text
              style={[
                styles.optionLabel,
                selectedValue === option.value && styles.optionLabelSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  option: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  optionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  optionLabelSelected: {
    color: '#4CAF50',
  },
});
