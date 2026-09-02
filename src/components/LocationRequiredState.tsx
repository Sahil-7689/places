import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { theme } from '../theme';
import { Icon } from './Icon';

interface LocationRequiredStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  onOpenSettings?: () => void;
}

export const LocationRequiredState: React.FC<LocationRequiredStateProps> = ({
  title = 'Location Access Required',
  description = 'We need access to your location to find the best spots around you. Please enable location services.',
  onRetry,
  onOpenSettings,
}) => {
  const handleOpenSettings = () => {
    if (onOpenSettings) {
      onOpenSettings();
    } else {
      Linking.openSettings().catch(() => {});
    }
  };

  return (
    <View style={[styles.card, theme.shadows.elevation1]}>
      {/* Icon Circle */}
      <View style={styles.iconCircle}>
        <Icon name="location_off" size={44} color={theme.colors.primary} filled />
      </View>

      {/* Text Info */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {onRetry && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onRetry}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleOpenSettings}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: theme.colors.primaryFixed,
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
  buttonContainer: {
    width: '100%',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  primaryButton: {
    backgroundColor: theme.colors.primaryContainer,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonText: {
    ...theme.typography.labelMd,
    color: theme.colors.onPrimary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    width: '100%',
  },
  secondaryButtonText: {
    ...theme.typography.labelMd,
    color: theme.colors.primary,
  },
});
