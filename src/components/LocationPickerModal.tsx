import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { theme } from '../theme';
import { Icon } from './Icon';
import { searchLocationSuggestions, LocationSuggestion } from '../services/api';

export interface LocationSelection {
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

interface LocationPickerModalProps {
  visible: boolean;
  onClose: () => void;
  currentCoords: { latitude: number; longitude: number };
  currentRadius: number;
  onSelectLocation: (selection: LocationSelection) => void;
}

interface DestinationPreset {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  emoji: string;
}

const POPULAR_DESTINATIONS: DestinationPreset[] = [
  { name: 'Jaipur', country: 'Rajasthan, India', latitude: 26.9124, longitude: 75.7873, emoji: '🏰' },
  { name: 'Agra (Taj Mahal)', country: 'Uttar Pradesh, India', latitude: 27.1751, longitude: 78.0421, emoji: '🕌' },
  { name: 'New Delhi', country: 'Delhi, India', latitude: 28.6139, longitude: 77.2090, emoji: '🏛️' },
  { name: 'Mumbai', country: 'Maharashtra, India', latitude: 18.9220, longitude: 72.8347, emoji: '🌊' },
  { name: 'Varanasi', country: 'Uttar Pradesh, India', latitude: 25.3176, longitude: 82.9739, emoji: '🪔' },
  { name: 'Goa', country: 'India', latitude: 15.2993, longitude: 74.1240, emoji: '🏖️' },
  { name: 'Paris', country: 'France', latitude: 48.8584, longitude: 2.2945, emoji: '🗼' },
  { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, emoji: '🇬🇧' },
  { name: 'Rome', country: 'Italy', latitude: 41.8902, longitude: 12.4922, emoji: '🏛️' },
  { name: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.0060, emoji: '🗽' },
  { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, emoji: '⛩️' },
  { name: 'Dubai', country: 'UAE', latitude: 25.2048, longitude: 55.2708, emoji: '🏙️' },
];

const RADIUS_OPTIONS = [
  { label: '3 km', value: 3000 },
  { label: '5 km', value: 5000 },
  { label: '10 km', value: 10000 },
  { label: '20 km', value: 20000 },
  { label: '50 km', value: 50000 },
];

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  visible,
  onClose,
  currentCoords,
  currentRadius,
  onSelectLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedRadius, setSelectedRadius] = useState<number>(currentRadius || 5000);

  // Manual Coordinates
  const [showCoordsInput, setShowCoordsInput] = useState<boolean>(false);
  const [latInput, setLatInput] = useState<string>(currentCoords.latitude.toString());
  const [lonInput, setLonInput] = useState<string>(currentCoords.longitude.toString());
  const [coordError, setCoordError] = useState<string>('');

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Autocomplete search debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setIsSearching(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const results = await searchLocationSuggestions(searchQuery);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery]);

  const handleSelectSuggestion = (item: LocationSuggestion) => {
    onSelectLocation({
      name: item.name || item.formatted?.split(',')[0] || 'Selected Location',
      latitude: item.latitude,
      longitude: item.longitude,
      radius: selectedRadius,
    });
    setSearchQuery('');
    setSuggestions([]);
    onClose();
  };

  const handleSelectPreset = (preset: DestinationPreset) => {
    onSelectLocation({
      name: `${preset.name}, ${preset.country}`,
      latitude: preset.latitude,
      longitude: preset.longitude,
      radius: selectedRadius,
    });
    onClose();
  };

  const handleApplyCustomCoords = () => {
    const lat = parseFloat(latInput);
    const lon = parseFloat(lonInput);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setCoordError('Latitude must be between -90 and 90');
      return;
    }

    if (isNaN(lon) || lon < -180 || lon > 180) {
      setCoordError('Longitude must be between -180 and 180');
      return;
    }

    setCoordError('');
    onSelectLocation({
      name: `${lat.toFixed(3)}°, ${lon.toFixed(3)}°`,
      latitude: lat,
      longitude: lon,
      radius: selectedRadius,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, theme.shadows.elevation2]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Icon name="location_on" size={24} color={theme.colors.primary} filled />
              <Text style={styles.title}>Pick Your Location</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Live Search Input */}
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Icon name="travel_explore" size={20} color={theme.colors.primary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search any city, landmark, or place..."
                placeholderTextColor={theme.colors.outline}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
              {isSearching ? <ActivityIndicator size="small" color={theme.colors.primary} /> : null}
            </View>
          </View>

          {/* Autocomplete Dropdown List */}
          {suggestions.length > 0 && (
            <View style={styles.suggestionsBox}>
              <Text style={styles.suggestionsHeader}>Matching Locations</Text>
              {suggestions.map((item, idx) => (
                <TouchableOpacity
                  key={`${item.latitude}-${item.longitude}-${idx}`}
                  style={styles.suggestionItem}
                  onPress={() => handleSelectSuggestion(item)}
                  activeOpacity={0.7}
                >
                  <Icon name="location_on" size={18} color={theme.colors.primary} />
                  <View style={styles.suggestionTextContainer}>
                    <Text style={styles.suggestionTitle}>{item.name}</Text>
                    <Text style={styles.suggestionSubtitle} numberOfLines={1}>
                      {item.formatted}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Search Radius Selector */}
            <Text style={styles.sectionHeader}>Search Radius</Text>
            <View style={styles.radiusRow}>
              {RADIUS_OPTIONS.map((opt) => {
                const isActive = selectedRadius === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setSelectedRadius(opt.value)}
                    style={[styles.radiusChip, isActive && styles.radiusChipActive]}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.radiusText, isActive && styles.radiusTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Popular Tourist Destinations */}
            <Text style={styles.sectionHeader}>Popular Tourist Destinations</Text>
            <View style={styles.presetsGrid}>
              {POPULAR_DESTINATIONS.map((preset) => {
                const isSelected =
                  Math.abs(preset.latitude - currentCoords.latitude) < 0.01 &&
                  Math.abs(preset.longitude - currentCoords.longitude) < 0.01;

                return (
                  <TouchableOpacity
                    key={preset.name}
                    onPress={() => handleSelectPreset(preset)}
                    style={[styles.presetCard, isSelected && styles.presetCardActive]}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                    <View style={styles.presetTextCol}>
                      <Text style={[styles.presetName, isSelected && styles.presetNameActive]} numberOfLines={1}>
                        {preset.name}
                      </Text>
                      <Text style={styles.presetCountry} numberOfLines={1}>
                        {preset.country}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Manual Coordinate Toggle */}
            <TouchableOpacity
              onPress={() => setShowCoordsInput(!showCoordsInput)}
              style={styles.coordsToggle}
              activeOpacity={0.7}
            >
              <Text style={styles.coordsToggleText}>
                {showCoordsInput ? '▼ Hide Manual GPS Input' : '▶ Enter Exact GPS Coordinates'}
              </Text>
            </TouchableOpacity>

            {showCoordsInput && (
              <View style={styles.coordsBox}>
                <View style={styles.inputsRow}>
                  <View style={styles.inputCol}>
                    <Text style={styles.inputLabel}>Latitude (-90 to 90)</Text>
                    <TextInput
                      style={styles.coordTextInput}
                      keyboardType="numeric"
                      value={latInput}
                      onChangeText={setLatInput}
                      placeholder="e.g. 26.9124"
                      placeholderTextColor={theme.colors.outline}
                    />
                  </View>

                  <View style={styles.inputCol}>
                    <Text style={styles.inputLabel}>Longitude (-180 to 180)</Text>
                    <TextInput
                      style={styles.coordTextInput}
                      keyboardType="numeric"
                      value={lonInput}
                      onChangeText={setLonInput}
                      placeholder="e.g. 75.7873"
                      placeholderTextColor={theme.colors.outline}
                    />
                  </View>
                </View>

                {coordError ? <Text style={styles.errorText}>⚠️ {coordError}</Text> : null}

                <TouchableOpacity
                  onPress={handleApplyCustomCoords}
                  style={styles.applyBtn}
                  activeOpacity={0.85}
                >
                  <Text style={styles.applyBtnText}>Apply Coordinates & Search</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.outlineVariant,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    ...theme.typography.headlineMd,
    color: theme.colors.onSurface,
    fontWeight: '700',
    fontSize: 18,
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.outline,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.onSurface,
  },
  suggestionsBox: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primaryFixed,
    padding: 8,
    maxHeight: 180,
  },
  suggestionsHeader: {
    ...theme.typography.labelSm,
    color: theme.colors.primary,
    fontWeight: '700',
    marginBottom: 6,
    paddingHorizontal: 6,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.md,
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.outlineVariant,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionTitle: {
    ...theme.typography.labelMd,
    color: theme.colors.onSurface,
    fontWeight: '700',
  },
  suggestionSubtitle: {
    ...theme.typography.labelSm,
    color: theme.colors.onSurfaceVariant,
    fontSize: 11,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  sectionHeader: {
    ...theme.typography.labelMd,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 10,
    fontSize: 13,
  },
  radiusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  radiusChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  radiusChipActive: {
    backgroundColor: theme.colors.primaryFixed,
    borderColor: theme.colors.primary,
  },
  radiusText: {
    ...theme.typography.labelSm,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '600',
  },
  radiusTextActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: '48.5%',
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 8,
  },
  presetCardActive: {
    backgroundColor: theme.colors.primaryFixed,
    borderColor: theme.colors.primary,
  },
  presetEmoji: {
    fontSize: 20,
  },
  presetTextCol: {
    flex: 1,
  },
  presetName: {
    ...theme.typography.labelMd,
    color: theme.colors.onSurface,
    fontWeight: '700',
    fontSize: 13,
  },
  presetNameActive: {
    color: theme.colors.primary,
  },
  presetCountry: {
    ...theme.typography.labelSm,
    color: theme.colors.outline,
    fontSize: 11,
  },
  coordsToggle: {
    marginTop: 16,
    paddingVertical: 8,
  },
  coordsToggleText: {
    ...theme.typography.labelMd,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  coordsBox: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.lg,
    padding: 14,
    gap: 12,
    marginTop: 8,
  },
  inputsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputCol: {
    flex: 1,
  },
  inputLabel: {
    ...theme.typography.labelSm,
    color: theme.colors.onSurfaceVariant,
    fontSize: 11,
    marginBottom: 4,
    fontWeight: '600',
  },
  coordTextInput: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: theme.colors.onSurface,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    fontWeight: '600',
  },
  applyBtn: {
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyBtnText: {
    color: theme.colors.onPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
});
