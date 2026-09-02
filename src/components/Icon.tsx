import React from 'react';
import { Text, TextStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
  filled?: boolean;
}

const GLYPH_MAP: Record<string, string> = {
  location_on: '📍',
  location_off: '🚫',
  explore: '🧭',
  favorite: '❤️',
  favorite_border: '🤍',
  refresh: '🔄',
  star: '★',
  directions_car: '🚗',
  map: '🗺️',
  photo_camera: '📷',
  travel_explore: '🔍',
  error: '⚠️',
  person: '👤',
};

const NAME_MAP: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  location_on: 'location-on',
  location_off: 'location-off',
  explore: 'explore',
  favorite: 'favorite',
  favorite_border: 'favorite-border',
  refresh: 'refresh',
  star: 'star',
  directions_car: 'directions-car',
  map: 'map',
  photo_camera: 'photo-camera',
  travel_explore: 'travel-explore',
  error: 'error',
  person: 'person',
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#000',
  style,
  filled = false,
}) => {
  try {
    let iconName = NAME_MAP[name] || (name as any);
    if (name === 'favorite' && !filled) {
      iconName = 'favorite-border';
    }
    return <MaterialIcons name={iconName} size={size} color={color} style={style} />;
  } catch {
    const glyph = GLYPH_MAP[name] || '•';
    return (
      <Text style={[{ fontSize: size * 0.85, color, textAlign: 'center' }, style]}>
        {glyph}
      </Text>
    );
  }
};
