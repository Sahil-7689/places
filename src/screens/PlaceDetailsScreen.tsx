import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { theme } from '../theme';
import { TouristPlace } from '../types';
import { Icon } from '../components/Icon';

interface PlaceDetailsScreenProps {
  place: TouristPlace;
  onBack: () => void;
}

export const PlaceDetailsScreen: React.FC<PlaceDetailsScreenProps> = ({
  place,
  onBack,
}) => {
  const handleOpenMaps = async () => {
    const lat = place.latitude ?? 26.9124;
    const lon = place.longitude ?? 75.7873;
    const label = encodeURIComponent(place.name);

    // Platform-specific Maps URL schemes
    const scheme = Platform.select({
      ios: `maps:0,0?q=${label}@${lat},${lon}`,
      android: `geo:${lat},${lon}?q=${lat},${lon}(${label})`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`,
    });

    const webFallbackUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

    try {
      if (scheme) {
        const supported = await Linking.canOpenURL(scheme);
        if (supported) {
          await Linking.openURL(scheme);
          return;
        }
      }
      // Fallback to standard web Google Maps
      await Linking.openURL(webFallbackUrl);
    } catch (err) {
      console.warn('[PlaceDetailsScreen] Could not open maps URL:', err);
      // Direct browser fallback
      Linking.openURL(webFallbackUrl).catch(() => {});
    }
  };

  // Generate intelligent contextual description if not provided
  const getAboutText = (): string => {
    if (place.description) {
      return place.description;
    }

    const category = place.category || 'tourist attraction';
    return `${place.name} is a renowned ${category.toLowerCase()} located in ${place.location}. Known for its cultural significance and visitor appeal, it is one of the most prominent tourist attractions in the region.`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />

      {/* Top App Bar with Back Button */}
      <View style={styles.appBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Icon name="explore" size={24} color={theme.colors.primary} />
          <Text style={styles.backText}>← Places</Text>
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Place Details</Text>
        <View style={styles.appBarPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Hero Card */}
        <View style={[styles.heroCard, theme.shadows.elevation1]}>
          {place.imageUrl && (
            <View style={styles.heroImageWrapper}>
              <Image source={{ uri: place.imageUrl }} style={styles.heroImage} resizeMode="cover" />
              <View style={styles.heroOverlay} />
            </View>
          )}

          <View style={styles.heroContent}>
            <View style={styles.badgeRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{place.category || 'Historical'}</Text>
              </View>

              {place.rating !== undefined && (
                <View style={styles.ratingBadge}>
                  <Icon name="star" size={14} color={theme.colors.tertiary} />
                  <Text style={styles.ratingText}>{place.rating.toFixed(1)}</Text>
                </View>
              )}
            </View>

            <Text style={styles.placeName}>{place.name}</Text>

            <View style={styles.distanceRow}>
              <Icon name="location_on" size={18} color={theme.colors.primary} />
              <Text style={styles.distanceText}>{place.distance}</Text>
            </View>
          </View>
        </View>

        {/* Location / Address Section */}
        <View style={[styles.infoSection, theme.shadows.elevation1]}>
          <View style={styles.sectionHeaderRow}>
            <Icon name="map" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Location</Text>
          </View>
          <Text style={styles.addressText}>{place.location}</Text>

          {place.latitude !== undefined && place.longitude !== undefined && (
            <View style={styles.coordsContainer}>
              <Text style={styles.coordsLabel}>Coordinates:</Text>
              <Text style={styles.coordsValue}>
                {place.latitude.toFixed(4)}° N, {place.longitude.toFixed(4)}° E
              </Text>
            </View>
          )}
        </View>

        {/* About Section */}
        <View style={[styles.infoSection, theme.shadows.elevation1]}>
          <View style={styles.sectionHeaderRow}>
            <Icon name="photo_camera" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          <Text style={styles.aboutText}>{getAboutText()}</Text>
        </View>

        {/* Action Button: Open in Maps */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleOpenMaps}
          style={[styles.mapsButton, theme.shadows.elevation2]}
        >
          <Icon name="explore" size={22} color={theme.colors.onPrimary} filled />
          <Text style={styles.mapsButtonText}>Open in Google Maps</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.marginMobile,
    paddingVertical: 12,
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.outlineVariant,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 80,
  },
  backText: {
    ...theme.typography.labelMd,
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  appBarTitle: {
    ...theme.typography.headlineMd,
    color: theme.colors.onSurface,
    fontWeight: '700',
    fontSize: 17,
  },
  appBarPlaceholder: {
    minWidth: 80,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.marginMobile,
    paddingTop: theme.spacing.lg,
    paddingBottom: 40,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    gap: theme.spacing.md,
  },
  heroCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  heroImageWrapper: {
    height: 190,
    width: '100%',
    position: 'relative',
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  heroContent: {
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    backgroundColor: theme.colors.primaryFixed,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.md,
  },
  categoryText: {
    ...theme.typography.labelMd,
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 186, 0, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    gap: 4,
  },
  ratingText: {
    ...theme.typography.labelMd,
    color: theme.colors.onSurface,
    fontWeight: '700',
    fontSize: 13,
  },
  placeName: {
    ...theme.typography.headlineLgMobile,
    color: theme.colors.onSurface,
    fontWeight: '800',
    marginTop: 4,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  distanceText: {
    ...theme.typography.bodyMd,
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  infoSection: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  sectionTitle: {
    ...theme.typography.labelMd,
    color: theme.colors.onSurface,
    fontWeight: '700',
    fontSize: 15,
  },
  addressText: {
    ...theme.typography.bodyMd,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 22,
    fontSize: 14,
  },
  coordsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.outlineVariant,
  },
  coordsLabel: {
    ...theme.typography.labelSm,
    color: theme.colors.outline,
    fontWeight: '600',
  },
  coordsValue: {
    ...theme.typography.labelSm,
    color: theme.colors.onSurfaceVariant,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  aboutText: {
    ...theme.typography.bodyMd,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 22,
    fontSize: 14,
  },
  mapsButton: {
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: theme.borderRadius.full,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  mapsButtonText: {
    ...theme.typography.labelMd,
    color: theme.colors.onPrimary,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
