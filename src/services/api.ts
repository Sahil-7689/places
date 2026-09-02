import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { TouristPlace } from '../types';
import { MOCK_PLACES } from '../data/mockPlaces';

/**
 * -------------------------------------------------------------
 * 🌐 PRODUCTION CLOUD API CONFIGURATION
 * -------------------------------------------------------------
 * Once you deploy your backend to Render or any cloud provider:
 * Replace this URL with your deployed HTTPS endpoint:
 * Example: 'https://tourist-places-api.onrender.com/api/v1'
 */
export const PRODUCTION_API_URL: string | null = null; // Set to 'https://your-render-app.onrender.com/api/v1' for production APK

/**
 * Fallback category imagery
 */
const CATEGORY_IMAGES: Record<string, string> = {
  Historical: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80',
  Museum: 'https://images.unsplash.com/photo-1565034946487-077786996e27?w=800&q=80',
  Park: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=800&q=80',
  Heritage: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
  Monument: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
  Nature: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
  Sightseeing: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
  Attraction: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
  Landmark: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800&q=80',
};

const getDevelopmentHostIp = (): string | null => {
  try {
    const hostUri =
      Constants.expoConfig?.hostUri ||
      (Constants as any).manifest?.debuggerHost ||
      (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;

    if (hostUri) {
      const ip = hostUri.split(':')[0];
      if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
        return ip;
      }
    }
  } catch {
    // Ignore error
  }
  return null;
};

const getBackendBaseUrls = (): string[] => {
  const urls: string[] = [];

  // 1. High Priority: Production Deployed Cloud HTTPS URL
  if (PRODUCTION_API_URL && PRODUCTION_API_URL.startsWith('http')) {
    urls.push(PRODUCTION_API_URL);
  }

  // 2. Development: Dynamic host IP from Expo debugger
  const detectedHostIp = getDevelopmentHostIp();
  if (detectedHostIp) {
    urls.push(`http://${detectedHostIp}:5000/api/v1`);
  }

  // 3. Local network fallbacks
  urls.push('http://192.168.1.39:5000/api/v1');

  if (Platform.OS === 'android') {
    urls.push('http://10.0.2.2:5000/api/v1');
  }

  urls.push('http://localhost:5000/api/v1');
  urls.push('http://127.0.0.1:5000/api/v1');

  return Array.from(new Set(urls));
};

export interface BackendPlaceResponse {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  distance: number;
}

export interface FetchPlacesOptions {
  latitude: number;
  longitude: number;
  radius?: number;
}

export interface LocationSuggestion {
  name: string;
  formatted: string;
  latitude: number;
  longitude: number;
}

/**
 * Autocomplete search for any location/city/landmark worldwide
 */
export async function searchLocationSuggestions(queryText: string): Promise<LocationSuggestion[]> {
  if (!queryText || queryText.trim().length === 0) {
    return [];
  }

  const candidateUrls = getBackendBaseUrls();

  for (const baseUrl of candidateUrls) {
    try {
      const url = `${baseUrl}/places/geocode?text=${encodeURIComponent(queryText)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) continue;

      const data = await response.json();
      if (data.success && Array.isArray(data.data?.locations)) {
        return data.data.locations;
      }
    } catch {
      // Try next
    }
  }

  return [];
}

/**
 * Fetch top 5 nearby tourist attractions from the deployed Cloud / Node.js backend
 */
export async function fetchNearbyTouristPlaces({
  latitude,
  longitude,
  radius = 5000,
}: FetchPlacesOptions): Promise<TouristPlace[]> {
  const candidateUrls = getBackendBaseUrls();

  for (const baseUrl of candidateUrls) {
    try {
      const url = `${baseUrl}/places/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.data?.places)) {
        console.log(`[API] ✅ Successfully fetched from: ${baseUrl}`);
        return data.data.places.map((place: BackendPlaceResponse): TouristPlace => ({
          id: String(place.id),
          name: place.name,
          category: place.category || 'Historical',
          location: place.address,
          distance: `${place.distance} km away`,
          latitude: place.latitude,
          longitude: place.longitude,
          rating: 4.6,
          imageUrl: CATEGORY_IMAGES[place.category] || CATEGORY_IMAGES.Landmark,
          isFavorite: false,
        }));
      }
    } catch {
      // Try next candidate URL
    }
  }

  console.log('[API] Backend unreachable from current network, using local fallback data');
  return MOCK_PLACES;
}
