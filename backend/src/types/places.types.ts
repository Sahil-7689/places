export interface TouristPlace {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  distance: number; // in kilometers rounded to 1 decimal place
}

export interface NearbyPlacesQuery {
  latitude: number;
  longitude: number;
  radius?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface NearbyPlacesResponseData {
  places: TouristPlace[];
}
