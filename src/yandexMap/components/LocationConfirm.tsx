import React from 'react';
import { YMaps, Map, Placemark } from 'react-yandex-maps';
import { useTranslation } from 'react-i18next';

interface LocationConfirmProps {
  location: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  searchQuery: string;
  onSave: () => void;
}

export const LocationConfirm = ({ location, searchQuery, onSave }: LocationConfirmProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="p-4 border border-gray-200 rounded-md">
        <h4 className="font-medium">
          {searchQuery || t('new_location')}
        </h4>
        <p className="text-sm text-gray-500">{location.address || t('address')}</p>
      </div>
      <div className="h-64 rounded-md overflow-hidden">
        <YMaps>
          <Map
            state={{
              center: [location.lat, location.lng],
              zoom: 15,
            }}
            width="100%"
            height="100%"
          >
            <Placemark
              geometry={[location.lat, location.lng]}
              properties={{
                balloonContent: location.address || t('address'),
              }}
              options={{
                preset: 'islands#blueIcon',
              }}
            />
          </Map>
        </YMaps>
      </div>
      <button
        onClick={onSave}
        className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
      >
        {t('save')}
      </button>
    </div>
  );
};