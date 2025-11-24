import { useState, useEffect } from 'react';
import type { LocationDetails } from '../types';

type Location = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  inLocationDetails:LocationDetails;
  isSelected?: boolean;
};

export const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    const savedLocations = localStorage.getItem('savedLocations');
    const savedSelected = localStorage.getItem('currentLocation');
    
    if (savedLocations) {
      try {
        const parsedLocations = JSON.parse(savedLocations);
        setLocations(parsedLocations);
        
        if (savedSelected) {
          const current = JSON.parse(savedSelected);
          const found = parsedLocations.find((loc: Location) => loc.id === current.id);
          if (found) setSelectedLocation(found);
        }
      } catch (error) {
        console.error('Error parsing saved locations:', error);
      }
    }
  }, []);

 const addLocation = (location: Omit<Location, 'id'>) => {
  const newLoc: Location = {
    ...location,
    id: Date.now().toString(),
    isSelected: true
  };
  const updated = [...locations, newLoc];
  setLocations(updated);
  localStorage.setItem('savedLocations', JSON.stringify(updated));
  localStorage.setItem('currentLocation', JSON.stringify(newLoc)); // ✅ bor
  setSelectedLocation(newLoc);
  return newLoc;
};


  const updateSelectedLocation = (location: Location) => {
    setSelectedLocation(location);
    localStorage.setItem('currentLocation', JSON.stringify(location)); // ✅ yangi qo‘shildi
  };

  const deleteLocation = (id: string) => {
    const updated = locations.filter(loc => loc.id !== id);
    setLocations(updated);
    localStorage.setItem('savedLocations', JSON.stringify(updated));
    
    if (selectedLocation?.id === id) {
      setSelectedLocation(null);
      localStorage.removeItem('currentLocation');
    }
  };

  return { 
    locations, 
    selectedLocation, 
    addLocation, 
    updateSelectedLocation, // ✅ yangilangan versiya
    deleteLocation 
  };
};
