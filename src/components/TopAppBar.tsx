import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { theme } from '../theme';
import { Icon } from './Icon';

interface TopAppBarProps {
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  onLocationPress?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title = 'Places Near You',
  subtitle = 'Jaipur, Rajasthan',
  onRefresh,
  onLocationPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onLocationPress}
            style={styles.iconButton}
          >
            <Icon name="location_on" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        </View>

        {onRefresh && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onRefresh}
            style={styles.refreshButton}
          >
            <Icon name="refresh" size={22} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.surfaceContainerHigh,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 8 : 0,
    zIndex: 40,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.marginMobile,
    paddingVertical: theme.spacing.sm,
    height: 60,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconButton: {
    padding: 6,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceContainerLow,
  },
  textContainer: {
    justifyContent: 'center',
  },
  title: {
    ...theme.typography.headlineMd,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  subtitle: {
    ...theme.typography.labelSm,
    color: theme.colors.onSurfaceVariant,
    marginTop: -2,
  },
  refreshButton: {
    padding: 8,
    borderRadius: theme.borderRadius.full,
  },
});
