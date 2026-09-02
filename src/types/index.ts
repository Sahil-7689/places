export interface TouristPlace {
  id: string;
  name: string;
  category: string;
  location: string;
  distance: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  imageUrl?: string;
  isFavorite?: boolean;
  description?: string;
}

export type AppTab = 'explore' | 'saved' | 'trips' | 'profile';

export type ScreenState = 'permission' | 'loading' | 'places' | 'place_details' | 'states_preview';
export type AppStateView = 'no_places' | 'location_required' | 'error';
