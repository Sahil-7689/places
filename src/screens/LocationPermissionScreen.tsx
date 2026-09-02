import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  Platform,
  StatusBar,
} from 'react-native';
import { theme } from '../theme';
import { Icon } from '../components/Icon';

interface LocationPermissionScreenProps {
  onAllowLocation?: () => void;
  onNotNow?: () => void;
}

export const LocationPermissionScreen: React.FC<LocationPermissionScreenProps> = ({
  onAllowLocation,
  onNotNow,
}) => {
  // Animation values for concentric radar rings
  const pulseAnim1 = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createPulse = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.bezier(0.4, 0, 0.6, 1),
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = createPulse(pulseAnim1, 0);
    const anim2 = createPulse(pulseAnim2, 500);
    const anim3 = createPulse(pulseAnim3, 1000);

    Animated.parallel([anim1, anim2, anim3]).start();
  }, [pulseAnim1, pulseAnim2, pulseAnim3]);

  const getRingStyle = (anim: Animated.Value) => ({
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.85, 1.15, 1],
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.5, 1],
    }),
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surfaceContainerLowest} />
      <View style={styles.container}>
        {/* App Logo / Branding */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Icon name="explore" size={32} color={theme.colors.primary} filled />
            <Text style={styles.brandText}>Tourist Places</Text>
          </View>
        </View>

        {/* Radar / Illustration Area */}
        <View style={styles.illustrationContainer}>
          {/* Concentric Pulse Rings */}
          <Animated.View
            style={[
              styles.pulseRing,
              { width: 192, height: 192, backgroundColor: 'rgba(0, 102, 255, 0.10)' },
              getRingStyle(pulseAnim1),
            ]}
          />
          <Animated.View
            style={[
              styles.pulseRing,
              { width: 160, height: 160, backgroundColor: 'rgba(0, 102, 255, 0.20)' },
              getRingStyle(pulseAnim2),
            ]}
          />
          <Animated.View
            style={[
              styles.pulseRing,
              { width: 128, height: 128, backgroundColor: 'rgba(0, 102, 255, 0.30)' },
              getRingStyle(pulseAnim3),
            ]}
          />

          {/* Central Location Pin Circle */}
          <View style={[styles.centerCircle, theme.shadows.elevation2]}>
            <Icon name="location_on" size={48} color={theme.colors.primaryContainer} filled />
          </View>

          {/* Floating Element: Map Badge */}
          <View style={[styles.floatingBadge, styles.badgeTopRight]}>
            <Icon name="map" size={20} color={theme.colors.tertiary} filled />
          </View>

          {/* Floating Element: Camera Badge */}
          <View style={[styles.floatingBadge, styles.badgeBottomLeft]}>
            <Icon name="photo_camera" size={20} color={theme.colors.secondary} filled />
          </View>
        </View>

        {/* Text Copy */}
        <View style={styles.textSection}>
          <Text style={styles.title}>Discover Places Near You</Text>
          <Text style={styles.description}>
            Allow location access to discover popular tourist attractions and places around you.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onAllowLocation}
            style={[styles.primaryButton, theme.shadows.elevation1]}
          >
            <Text style={styles.primaryButtonText}>Allow Location Access</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onNotNow}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Not Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerLowest,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.marginMobile,
    paddingVertical: theme.spacing.xl,
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 16 : 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    ...theme.typography.headlineMd,
    color: theme.colors.primary,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  illustrationContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: theme.spacing.lg,
  },
  pulseRing: {
    position: 'absolute',
    borderRadius: theme.borderRadius.full,
  },
  centerCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  floatingBadge: {
    position: 'absolute',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.full,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 15,
  },
  badgeTopRight: {
    top: 8,
    right: 8,
  },
  badgeBottomLeft: {
    bottom: 8,
    left: 8,
  },
  textSection: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  title: {
    ...theme.typography.headlineLgMobile,
    color: theme.colors.onSurface,
    textAlign: 'center',
    fontWeight: '700',
  },
  description: {
    ...theme.typography.bodyMd,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 22,
  },
  actions: {
    width: '100%',
    maxWidth: 360,
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  primaryButton: {
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: theme.borderRadius.full,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...theme.typography.labelMd,
    color: theme.colors.onPrimary,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: theme.borderRadius.full,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  secondaryButtonText: {
    ...theme.typography.labelMd,
    color: theme.colors.outline,
    fontWeight: '600',
  },
});
