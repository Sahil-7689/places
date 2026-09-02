import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { theme } from '../theme';
import { AppStateView } from '../types';
import { EmptyState } from '../components/EmptyState';
import { LocationRequiredState } from '../components/LocationRequiredState';
import { ErrorState } from '../components/ErrorState';
import { Icon } from '../components/Icon';

interface AppStatesScreenProps {
  onBack?: () => void;
  onRetry?: () => void;
}

export const AppStatesScreen: React.FC<AppStatesScreenProps> = ({
  onBack,
  onRetry,
}) => {
  const [selectedState, setSelectedState] = useState<AppStateView>('no_places');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>System Status</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* State Switcher Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setSelectedState('no_places')}
          style={[
            styles.segmentTab,
            selectedState === 'no_places' && styles.activeSegmentTab,
          ]}
        >
          <Text
            style={[
              styles.segmentText,
              selectedState === 'no_places' && styles.activeSegmentText,
            ]}
          >
            Empty
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedState('location_required')}
          style={[
            styles.segmentTab,
            selectedState === 'location_required' && styles.activeSegmentTab,
          ]}
        >
          <Text
            style={[
              styles.segmentText,
              selectedState === 'location_required' && styles.activeSegmentText,
            ]}
          >
            Permission
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedState('error')}
          style={[
            styles.segmentTab,
            selectedState === 'error' && styles.activeSegmentTab,
          ]}
        >
          <Text
            style={[
              styles.segmentText,
              selectedState === 'error' && styles.activeSegmentText,
            ]}
          >
            Error
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {selectedState === 'no_places' && (
          <EmptyState onRetry={onRetry} />
        )}

        {selectedState === 'location_required' && (
          <LocationRequiredState onRetry={onRetry} />
        )}

        {selectedState === 'error' && (
          <ErrorState onRetry={onRetry} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.marginMobile,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.surfaceContainerHigh,
  },
  backButton: {
    padding: 6,
  },
  backText: {
    ...theme.typography.labelMd,
    color: theme.colors.primary,
  },
  headerTitle: {
    ...theme.typography.headlineMd,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainer,
    marginHorizontal: theme.spacing.marginMobile,
    marginVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    padding: 4,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
  },
  activeSegmentTab: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    ...theme.typography.labelSm,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '600',
  },
  activeSegmentText: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.marginMobile,
    paddingVertical: theme.spacing.lg,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
});
