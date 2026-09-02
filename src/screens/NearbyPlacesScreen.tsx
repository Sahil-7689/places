import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  StatusBar,
  Text,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../theme';
import { TouristPlace, AppTab } from '../types';
import { MOCK_PLACES } from '../data/mockPlaces';
import { fetchNearbyTouristPlaces } from '../services/api';
import { TopAppBar } from '../components/TopAppBar';
import { PlaceCard } from '../components/PlaceCard';
import { BottomNavBar } from '../components/BottomNavBar';
import { Icon } from '../components/Icon';

interface NearbyPlacesScreenProps {
  onPlacePress?: (place: TouristPlace) => void;
  onLocationPress?: () => void;
  onOpenStatesPreview?: () => void;
}

export const NearbyPlacesScreen: React.FC<NearbyPlacesScreenProps> = ({
  onPlacePress,
  onLocationPress,
}) => {
  const [places, setPlaces] = useState<TouristPlace[]>(MOCK_PLACES);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AppTab>('explore');

  // Coordinates: Default user location
  const coords = {
    latitude: 26.9124,
    longitude: 75.7873,
  };

  const loadPlaces = useCallback(async () => {
    try {
      const data = await fetchNearbyTouristPlaces({
        latitude: coords.latitude,
        longitude: coords.longitude,
        radius: 5000,
      });

      if (data && data.length > 0) {
        setPlaces(data);
      }
    } catch (err) {
      console.warn('[NearbyPlacesScreen] Error fetching places:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [coords.latitude, coords.longitude]);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  const handleToggleFavorite = useCallback((id: string) => {
    setPlaces((prevPlaces) =>
      prevPlaces.map((place) =>
        place.id === id ? { ...place, isFavorite: !place.isFavorite } : place
      )
    );
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadPlaces();
  }, [loadPlaces]);

  // Filter places based on active tab
  const displayedPlaces =
    activeTab === 'saved' ? places.filter((p) => p.isFavorite) : places;

  const renderItem = useCallback(
    ({ item }: { item: TouristPlace }) => (
      <PlaceCard
        place={item}
        onPress={() => onPlacePress?.(item)}
        onToggleFavorite={handleToggleFavorite}
      />
    ),
    [onPlacePress, handleToggleFavorite]
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="travel_explore" size={48} color={theme.colors.outline} />
      <Text style={styles.emptyTitle}>
        {activeTab === 'saved' ? 'No saved places yet' : 'No places found'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'saved'
          ? 'Tap the heart icon on any card to save your favorite attractions.'
          : 'Pull down to refresh and discover tourist attractions near you.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />

      {/* Clean Top Header */}
      <TopAppBar
        title={activeTab === 'saved' ? 'Saved Places' : 'Places Near You'}
        subtitle={activeTab === 'saved' ? `${displayedPlaces.length} locations` : 'Jaipur, Rajasthan'}
        onRefresh={handleRefresh}
        onLocationPress={onLocationPress}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loaderText}>Discovering tourist attractions near you...</Text>
        </View>
      ) : (
        /* Main Places Feed */
        <FlatList
          data={displayedPlaces}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}

      {/* Bottom Navigation */}
      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loaderText: {
    ...theme.typography.bodyMd,
    color: theme.colors.onSurfaceVariant,
  },
  listContent: {
    paddingHorizontal: theme.spacing.marginMobile,
    paddingTop: theme.spacing.lg,
    paddingBottom: 100, // accommodate bottom tab bar
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 10,
  },
  emptyTitle: {
    ...theme.typography.headlineMd,
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginTop: 8,
  },
  emptySubtitle: {
    ...theme.typography.bodyMd,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
});
