import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
} from 'react-native';
import { theme } from '../theme';
import { Icon } from '../components/Icon';

const { width } = Dimensions.get('window');

interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  title = 'Finding amazing places near you...',
  subtitle = 'Curating personalized recommendations for your next adventure.',
}) => {
  // Animation for pulse rings
  const ringAnim1 = useRef(new Animated.Value(0)).current;
  const ringAnim2 = useRef(new Animated.Value(0)).current;

  // Animation for center dot pulsing
  const dotAnim = useRef(new Animated.Value(0)).current;

  // Animation for horizontal progress slide bar
  const slideAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    // Ring 1 animation
    const ring1Loop = Animated.loop(
      Animated.timing(ringAnim1, {
        toValue: 1,
        duration: 2000,
        easing: Easing.bezier(0.215, 0.61, 0.355, 1),
        useNativeDriver: true,
      })
    );

    // Ring 2 animation with delay
    const ring2Loop = Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(ringAnim2, {
          toValue: 1,
          duration: 2000,
          easing: Easing.bezier(0.215, 0.61, 0.355, 1),
          useNativeDriver: true,
        }),
      ])
    );

    // Center icon pulse
    const dotLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.bezier(0.455, 0.03, 0.515, 0.955),
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.bezier(0.455, 0.03, 0.515, 0.955),
          useNativeDriver: true,
        }),
      ])
    );

    // Slide progress bar
    const slideLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    ring1Loop.start();
    ring2Loop.start();
    dotLoop.start();
    slideLoop.start();

    return () => {
      ring1Loop.stop();
      ring2Loop.stop();
      dotLoop.stop();
      slideLoop.stop();
    };
  }, [ringAnim1, ringAnim2, dotAnim, slideAnim]);

  const ringStyle = (anim: Animated.Value) => ({
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 0.8, 1],
          outputRange: [0.8, 2.2, 2.5],
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 0.8, 1],
      outputRange: [0.6, 0.1, 0],
    }),
  });

  const dotScale = dotAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.08],
  });

  const progressBarTranslate = slideAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-60, 160],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      <View style={styles.container}>
        {/* Subtle Ambient Background Glowing Spots */}
        <View style={[styles.ambientGlow, styles.glowTopLeft]} />
        <View style={[styles.ambientGlow, styles.glowBottomRight]} />

        {/* Center Loading Indicator */}
        <View style={styles.indicatorContainer}>
          {/* Animated concentric pulse rings */}
          <Animated.View style={[styles.ring, ringStyle(ringAnim1)]} />
          <Animated.View style={[styles.ring, ringStyle(ringAnim2)]} />

          {/* Central Compass Bubble */}
          <Animated.View
            style={[
              styles.centerCircle,
              theme.shadows.elevation2,
              { transform: [{ scale: dotScale }] },
            ]}
          >
            <Icon name="explore" size={36} color={theme.colors.onPrimary} filled />
          </Animated.View>
        </View>

        {/* Text Section */}
        <View style={styles.textSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Indeterminate Animated Progress Bar */}
        <View style={styles.progressBarTrack}>
          <Animated.View
            style={[
              styles.progressBarThumb,
              {
                transform: [{ translateX: progressBarTranslate }],
              },
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.marginMobile,
    position: 'relative',
    overflow: 'hidden',
  },
  ambientGlow: {
    position: 'absolute',
    borderRadius: theme.borderRadius.full,
    opacity: 0.15,
  },
  glowTopLeft: {
    top: -50,
    left: -50,
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: theme.colors.primaryFixedDim,
  },
  glowBottomRight: {
    bottom: -50,
    right: -50,
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: theme.colors.tertiaryFixedDim,
  },
  indicatorContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  centerCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  textSection: {
    alignItems: 'center',
    maxWidth: 320,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.headlineLgMobile,
    color: theme.colors.onSurface,
    textAlign: 'center',
    fontWeight: '700',
  },
  subtitle: {
    ...theme.typography.bodyMd,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  progressBarTrack: {
    width: 200,
    height: 4,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarThumb: {
    width: 70,
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  },
});
