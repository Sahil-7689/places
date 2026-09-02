import axios from 'axios';
import { config } from '../config/env';
import { TouristPlace, NearbyPlacesQuery } from '../types/places.types';

export interface GeocodedLocation {
  name: string;
  formatted: string;
  city?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export class PlacesService {
  /**
   * Calculates the great-circle distance between two geographic coordinates using the Haversine formula.
   * @returns Distance in kilometers rounded to 1 decimal place
   */
  public calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const EARTH_RADIUS_KM = 6371;

    const toRad = (degrees: number): number => (degrees * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const radLat1 = toRad(lat1);
    const radLat2 = toRad(lat2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = EARTH_RADIUS_KM * c;

    return Math.round(distance * 10) / 10;
  }

  /**
   * Map Geoapify categories / place names to human-friendly tourist categories
   */
  public inferCategory(categories: string[] = [], name: string = ''): string {
    const lowerName = name.toLowerCase();

    if (
      categories.includes('tourism.historic') ||
      categories.includes('heritage') ||
      categories.includes('building.historic') ||
      lowerName.includes('fort') ||
      lowerName.includes('palace') ||
      lowerName.includes('castle')
    ) {
      return 'Historical';
    }

    if (
      categories.includes('entertainment.museum') ||
      categories.includes('tourism.sights.museum') ||
      lowerName.includes('museum')
    ) {
      return 'Museum';
    }

    if (
      categories.includes('leisure.park') ||
      categories.includes('national_park') ||
      lowerName.includes('park') ||
      lowerName.includes('garden')
    ) {
      return 'Park';
    }

    if (
      categories.includes('tourism.sights') ||
      categories.includes('tourism.monument') ||
      lowerName.includes('monument') ||
      lowerName.includes('memorial')
    ) {
      return 'Monument';
    }

    if (categories.includes('tourism.attraction')) {
      return 'Attraction';
    }

    return 'Landmark';
  }

  /**
   * Geocoding autocomplete for location search
   */
  public async geocodeLocation(text: string): Promise<GeocodedLocation[]> {
    if (!text || text.trim().length === 0) {
      return [];
    }

    if (!config.geoapifyApiKey) {
      return [];
    }

    try {
      const url = 'https://api.geoapify.com/v1/geocode/autocomplete';
      const response = await axios.get(url, {
        params: {
          text: text.trim(),
          limit: 6,
          apiKey: config.geoapifyApiKey,
        },
        timeout: 6000,
      });

      const features = response.data?.features || [];
      return features.map((f: any) => ({
        name: f.properties.name || f.properties.city || f.properties.formatted?.split(',')[0] || 'Location',
        formatted: f.properties.formatted || '',
        city: f.properties.city || f.properties.county,
        country: f.properties.country,
        latitude: f.properties.lat,
        longitude: f.properties.lon,
      }));
    } catch (error: any) {
      console.warn('[PlacesService Geocode Warning]:', error?.message || error);
      return [];
    }
  }

  /**
   * Fetches top 5 nearby tourist attractions using Geoapify Places API
   */
  public async getNearbyTouristPlaces(query: NearbyPlacesQuery): Promise<TouristPlace[]> {
    const { latitude, longitude, radius = config.defaultSearchRadius } = query;

    if (!config.geoapifyApiKey || config.geoapifyApiKey.trim().length === 0) {
      const err: any = new Error('GEOAPIFY_API_KEY is not configured on the server');
      err.statusCode = 502;
      throw err;
    }

    try {
      // Geoapify supported tourist categories
      const categories = 'tourism.sights,tourism.attraction,heritage,entertainment.museum,building.historic,leisure.park';
      const url = 'https://api.geoapify.com/v2/places';

      const response = await axios.get(url, {
        params: {
          categories,
          filter: `circle:${longitude},${latitude},${radius}`,
          bias: `proximity:${longitude},${latitude}`,
          limit: 20,
          apiKey: config.geoapifyApiKey,
        },
        timeout: 10000,
      });

      const features = response.data?.features || [];

      if (!features || features.length === 0) {
        return [];
      }

      const places: TouristPlace[] = features.map((feature: any) => {
        const props = feature.properties || {};
        const placeLat: number = props.lat ?? feature.geometry?.coordinates?.[1] ?? latitude;
        const placeLon: number = props.lon ?? feature.geometry?.coordinates?.[0] ?? longitude;
        const distance = this.calculateHaversineDistance(latitude, longitude, placeLat, placeLon);
        const name = props.name || props.formatted?.split(',')[0] || 'Tourist Attraction';
        const category = this.inferCategory(props.categories || [], name);

        const address =
          props.address_line2 ||
          props.formatted ||
          props.street ||
          `${category} Attraction`;

        return {
          id: String(props.place_id || `geo-${placeLat}-${placeLon}`),
          name,
          address,
          latitude: placeLat,
          longitude: placeLon,
          category,
          distance,
        };
      });

      // Filter duplicate names
      const uniquePlaces = places.filter(
        (place, index, self) =>
          index === self.findIndex((p) => p.name.toLowerCase() === place.name.toLowerCase())
      );

      // Sort by proximity
      uniquePlaces.sort((a, b) => a.distance - b.distance);

      // Return exactly 5 places
      return uniquePlaces.slice(0, config.maxResultsCount);
    } catch (error: any) {
      console.error('[PlacesService Geoapify Error]:', error?.message || error);
      const upstreamError: any = new Error('Unable to fetch nearby tourist places');
      upstreamError.statusCode = 502;
      throw upstreamError;
    }
  }
}

export const placesService = new PlacesService();
