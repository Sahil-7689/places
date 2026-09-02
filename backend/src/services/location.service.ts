/**
 * Location and Geometry Utilities
 */

/**
 * Calculates the great-circle distance between two geographic coordinates using the Haversine formula.
 * @param lat1 Latitude of first point in decimal degrees
 * @param lon1 Longitude of first point in decimal degrees
 * @param lat2 Latitude of second point in decimal degrees
 * @param lon2 Longitude of second point in decimal degrees
 * @returns Distance in kilometers rounded to 1 decimal place
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const EARTH_RADIUS_KM = 6371;

  const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const radLat1 = toRadians(lat1);
  const radLat2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 10) / 10;
}

/**
 * Infer human-friendly category name from Google Places API types or place name keywords
 */
export function inferCategory(types: string[] = [], name: string = ''): string {
  const lowerName = name.toLowerCase();

  if (lowerName.includes('fort') || lowerName.includes('palace') || lowerName.includes('castle') || types.includes('castle')) {
    return 'Historical';
  }
  if (lowerName.includes('museum') || types.includes('museum') || types.includes('art_gallery')) {
    return 'Museum';
  }
  if (lowerName.includes('park') || lowerName.includes('garden') || types.includes('park')) {
    return 'Park';
  }
  if (lowerName.includes('temple') || lowerName.includes('church') || lowerName.includes('mosque') || types.includes('place_of_worship') || types.includes('hindu_temple') || types.includes('church') || types.includes('mosque')) {
    return 'Heritage';
  }
  if (lowerName.includes('monument') || lowerName.includes('memorial') || lowerName.includes('tower') || types.includes('monument')) {
    return 'Monument';
  }
  if (lowerName.includes('lake') || lowerName.includes('waterfall') || lowerName.includes('mountain') || lowerName.includes('valley') || types.includes('natural_feature')) {
    return 'Nature';
  }
  if (types.includes('tourist_attraction')) {
    return 'Sightseeing';
  }

  return 'Landmark';
}

/**
 * Curated high-resolution fallback photography by category
 */
const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  Historical: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80',
  Museum: 'https://images.unsplash.com/photo-1565034946487-077786996e27?w=800&q=80',
  Park: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=800&q=80',
  Heritage: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
  Monument: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
  Nature: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
  Sightseeing: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
  Landmark: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800&q=80',
};

export function getDefaultImageForCategory(category: string): string {
  return CATEGORY_DEFAULT_IMAGES[category] || CATEGORY_DEFAULT_IMAGES.Landmark;
}
