export type Location = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  isSelected?: boolean;
};

export interface LocationDetails {
  country?: string;
  region?: string;
  district?: string;
  street?: string;
  house?: string;
  postalCode?: string;
  fullAddress?: string;
  latitude: number;
  longitude: number;
}


export type LocationSelectorView = 'list' | 'map' | 'confirm';