import React from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { useState, useEffect } from "react"; // Added useEffect
import axios from "axios";
import type { LocationDetails } from "../types";

interface LocationMapProps {
  center: [number, number];
  selectedLocation: {
    lat: number;
    lng: number;
    address: string;
    inLocationDetails: LocationDetails;
  } | null;
  onLocationSelect: (
    lat: number,
    lng: number,
    address: string,
    inLocationDetails: LocationDetails
  ) => void;
  onUseCurrentLocation: () => void;
}

const LocationMap: React.FC<LocationMapProps> = ({
  center,
  selectedLocation,
  onLocationSelect,
  onUseCurrentLocation,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(center); // Added mapCenter state

  // Update map center when selectedLocation changes
  useEffect(() => {
    if (selectedLocation && mapInstance) {
      setMapCenter([selectedLocation.lat, selectedLocation.lng]);
      mapInstance.setCenter([selectedLocation.lat, selectedLocation.lng], 15);
    }
  }, [selectedLocation, mapInstance]);

  const handleMapClick = (e: any) => {
    const coords = e.get('coords');
    const lat = coords[0];
    const lng = coords[1];
    
    // Reverse geocoding with Nominatim
    axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat: lat,
          lon: lng,
          format: "json",
          addressdetails: 1,
        },
      }
    ).then(response => {
      const display_name: string = response.data.display_name;

      const locDetails: LocationDetails = {
        country: response.data.address?.country ? response.data.address?.country : '',
        region:
          response.data.address?.region ??
          response.data.address?.city ??
          '',
        district: response.data.address?.district ? response.data.address?.district : '',
        street: response.data.address?.road ? response.data.address?.road : '',
        house: response.data.address?.house_number ? response.data.address?.house_number : '',
        postalCode: response.data.address?.postcode ? response.data.address?.postcode : '',
        fullAddress: display_name ? display_name : '',
        latitude: lat,
        longitude: lng,
      };

      onLocationSelect(lat, lng, display_name, locDetails);
    }).catch(error => {
      console.error("Reverse geocoding error", error);
    });
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: searchValue,
            format: "json",
            limit: 1,
            addressdetails: 1,
          },
        }
      );

      if (response.data?.length > 0) {
        const first = response.data[0];
        const lat = parseFloat(first.lat);
        const lon = parseFloat(first.lon);
        const display_name: string = first.display_name;

        const locDetails: LocationDetails = {
          country: first.address?.country ? first.address?.country : '',
          region:
            first.address?.region ??
            first.address?.city ??
            '',
          district: first.address?.district ? first.address?.district : '',
          street: first.address?.road ? first.address?.road : '',
          house: first.address?.house_number ? first.address?.house_number : '',
          postalCode: first.address?.postcode ? first.address?.postcode : '',
          fullAddress: display_name ? display_name : '',
          latitude: lat,
          longitude: lon,
        };

        onLocationSelect(lat, lon, display_name, locDetails);
        
        // Center map on the found location
        if (mapInstance) {
          setMapCenter([lat, lon]);
          mapInstance.setCenter([lat, lon], 15);
        }
      } else {
        alert("Address not found");
      }
    } catch (error) {
      console.error("Search error", error);
      alert("Map search error");
    }
  };

  return (
    <div className="space-y-4 relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search address..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
        >
          🔍
        </button>
      </div>

      {/* Map Container */}
      <div className="h-64 rounded-md overflow-hidden relative border border-gray-200">
        <YMaps query={{ apikey: 'your-api-key' }}>
          <Map
            state={{
              center: mapCenter, // Use mapCenter instead of center prop
              zoom: 15, // Increased zoom for better focus
              controls: ['zoomControl', 'fullscreenControl']
            }}
            width="100%"
            height="100%"
            onClick={handleMapClick}
            modules={['control.ZoomControl', 'control.FullscreenControl']}
            instanceRef={(instance: any) => setMapInstance(instance)}
          >
            {selectedLocation && (
              <Placemark
                geometry={[selectedLocation.lat, selectedLocation.lng]}
                properties={{
                  balloonContent: selectedLocation.address,
                }}
                options={{
                  preset: 'islands#blueIcon',
                  draggable: true,
                }}
                onDragEnd={(e: any) => {
                  const target = e.get('target');
                  const coords = target.geometry.getCoordinates();
                  const lat = coords[0];
                  const lng = coords[1];
                  
                  axios.get(
                    "https://nominatim.openstreetmap.org/reverse",
                    {
                      params: {
                        lat: lat,
                        lon: lng,
                        format: "json",
                        addressdetails: 1,
                      },
                    }
                  ).then(response => {
                    const display_name: string = response.data.display_name;

                    const locDetails: LocationDetails = {
                      country: response.data.address?.country ? response.data.address?.country : '',
                      region:
                        response.data.address?.region ??
                        response.data.address?.city ??
                        '',
                      district: response.data.address?.district ? response.data.address?.district : '',
                      street: response.data.address?.road ? response.data.address?.road : '',
                      house: response.data.address?.house_number ? response.data.address?.house_number : '',
                      postalCode: response.data.address?.postcode ? response.data.address?.postcode : '',
                      fullAddress: display_name ? display_name : '',
                      latitude: lat,
                      longitude: lng,
                    };

                    onLocationSelect(lat, lng, display_name, locDetails);
                  }).catch(error => {
                    console.error("Reverse geocoding error", error);
                  });
                }}
              />
            )}
          </Map>
        </YMaps>

        {/* Selected Address Display */}
        {selectedLocation && selectedLocation.address && (
          <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 p-3 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="text-blue-600 flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Selected Location</p>
                <p className="text-xs text-gray-600 line-clamp-2">{selectedLocation.address}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current location button */}
      <button
        onClick={onUseCurrentLocation}
        className="w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2c3.86 0 7 3.14 7 7 0 5.25-7 13-7 13S5 14.25 5 9c0-3.86 3.14-7 7-7z"/>
          <circle cx="12" cy="9" r="3"/>
        </svg>
        Use My Location
      </button>
    </div>
  );
};

export default LocationMap;