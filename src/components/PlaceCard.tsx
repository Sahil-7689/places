import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { TouristPlace } from '../types';
import { Icon } from './Icon';

interface PlaceCardProps {
  place: TouristPlace;
  onPress?: () => void;
  onToggleFavorite?: (id: string) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  onPress,
  onToggleFavorite,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={[styles.card, theme.shadows.elevation1]}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: place.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Subtle Overlay */}
        <View style={styles.imageOverlay} />

        {/* Favorite Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onToggleFavorite?.(place.id)}
          style={styles.favoriteButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon
            name="favorite"
            size={20}
            color={place.isFavorite ? theme.colors.error : theme.colors.outline}
            filled={place.isFavorite}
          />
        </TouchableOpacity>

        {/* Rating Badge */}
        <View style={styles.ratingBadge}>
          <Icon name="star" size={14} color={theme.colors.tertiary} />
          <Text style={styles.ratingText}>{place.rating.toFixed(1)}</Text>
        </View>
      </View>

      {/* Card Details */}
      <View style={styles.content}>
        {/* Title & Category Badge */}
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {place.name}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{place.category}</Text>
          </View>
        </View>

        {/* Location Row */}
        <View style={styles.metaRow}>
          <Icon name="location_on" size={16} color={theme.colors.onSurfaceVariant} />
          <Text style={styles.metaText} numberOfLines={1}>
            {place.location}
          </Text>
        </View>

        {/* Distance Row */}
        <View style={styles.metaRow}>
          <Icon name="directions_car" size={16} color={theme.colors.onSurfaceVariant} />
          <Text style={styles.metaText}>{place.distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  imageContainer: {
    height: 192,
    width: '100%',
    position: 'relative',
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  favoriteButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: theme.spacing.md,
    left: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  ratingText: {
    ...theme.typography.labelMd,
    color: theme.colors.onSurface,
    fontWeight: '700',
  },
  content: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    ...theme.typography.headlineMd,
    color: theme.colors.onSurface,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: theme.colors.primaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.md,
  },
  categoryText: {
    ...theme.typography.labelMd,
    color: theme.colors.primary,
    fontSize: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    ...theme.typography.bodyMd,
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    flex: 1,
  },
});
