import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from './src/theme';
import { ScreenState, TouristPlace } from './src/types';
import { LocationPermissionScreen } from './src/screens/LocationPermissionScreen';
import { LoadingScreen } from './src/screens/LoadingScreen';
import { NearbyPlacesScreen } from './src/screens/NearbyPlacesScreen';
import { PlaceDetailsScreen } from './src/screens/PlaceDetailsScreen';
import { AppStatesScreen } from './src/screens/AppStatesScreen';

export default function App() {
  const [fontsLoaded] = useFonts({
    ...MaterialIcons.font,
  });
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('permission');
  const [selectedPlace, setSelectedPlace] = useState<TouristPlace | null>(null);

  // Natural flow handlers
  const handleAllowLocation = () => {
    setCurrentScreen('loading');
    setTimeout(() => {
      setCurrentScreen('places');
    }, 1800);
  };

  const handleNotNow = () => {
    setCurrentScreen('places');
  };

  const handlePlacePress = (place: TouristPlace) => {
    setSelectedPlace(place);
    setCurrentScreen('place_details');
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Active Screen Flow */}
      {currentScreen === 'permission' && (
        <LocationPermissionScreen
          onAllowLocation={handleAllowLocation}
          onNotNow={handleNotNow}
        />
      )}

      {currentScreen === 'loading' && (
        <LoadingScreen />
      )}

      {currentScreen === 'places' && (
        <NearbyPlacesScreen
          onPlacePress={handlePlacePress}
          onLocationPress={() => setCurrentScreen('permission')}
          onOpenStatesPreview={() => setCurrentScreen('states_preview')}
        />
      )}

      {currentScreen === 'place_details' && selectedPlace && (
        <PlaceDetailsScreen
          place={selectedPlace}
          onBack={() => setCurrentScreen('places')}
        />
      )}

      {currentScreen === 'states_preview' && (
        <AppStatesScreen
          onBack={() => setCurrentScreen('places')}
          onRetry={() => {
            setCurrentScreen('loading');
            setTimeout(() => setCurrentScreen('places'), 1500);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
