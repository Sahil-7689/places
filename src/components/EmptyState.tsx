import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Icon } from './Icon';

interface EmptyStateProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onRetry?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No places found nearby',
  description = "We couldn't find any destinations matching your current filters. Try expanding your search area.",
  buttonText = 'Try Again',
  onRetry,
}) => {
  return (
    <View style={[styles.card, theme.shadows.elevation1]}>
      {/* Icon Circle */}
      <View style={styles.iconCircle}>
        <Icon name="travel_explore" size={44} color={theme.colors.outline} />
      </View>

      {/* Text Info */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {/* Action Button */}
      {onRetry && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onRetry}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 340,
    width: '100%',
    marginVertical: theme.spacing.md,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.headlineMd,
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  description: {
    ...theme.typography.bodyMd,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  button: {
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.full,
    minWidth: 140,
    alignItems: 'center',
  },
  buttonText: {
    ...theme.typography.labelMd,
    color: theme.colors.onPrimary,
  },
});
