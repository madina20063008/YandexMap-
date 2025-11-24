import { useContext, useState } from 'react';
import { FiX, FiChevronLeft } from 'react-icons/fi';
import LocationList from './components/LocationList';
import LocationMap from './components/LocationMap';
import { useLocations } from './hooks/useLocations';
import { LocationConfirm } from './components/LocationConfirm';
import { LocationContext } from '../context/LocationContext';
import type { LocationDetails } from "./types";
import { useTranslation } from 'react-i18next';

const LocationSelector = ({ onClose, onSelect }: {
    onClose: () => void;
    onSelect: (name: string, fullLocation: any) => void
}) => {
    const { t } = useTranslation();
    const [view, setView] = useState<'list' | 'map' | 'confirm'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [newLocation, setNewLocation] = useState<{ lat: number; lng: number; address: string; inLocationDetails: LocationDetails } | null>(null);
    const { setIsOn } = useContext(LocationContext);

    const {
        locations,
        selectedLocation,
        addLocation,
        updateSelectedLocation,
        deleteLocation
    } = useLocations();

    const handleSaveLocation = () => {
        if (newLocation && searchQuery.trim()) {
            const loc = addLocation({
                name: searchQuery.trim(),
                lat: newLocation.lat,
                lng: newLocation.lng,
                address: newLocation.address,
                inLocationDetails: newLocation.inLocationDetails
            });
            onSelect(loc.name, loc);
            onClose();
            setIsOn(false);
        } else {
            alert(t("pleaseEnterNameAndSelectOnMap"));
        }
    };

    const handleSelectLocation = (location: any) => {
        updateSelectedLocation(location);
        localStorage.setItem('currentLocation', JSON.stringify(location));
        onSelect(location.name, location);
        onClose();
        setIsOn(false);
    };

    const handleDeleteLocation = (id: string, e: React.MouseEvent) => {
        setIsOn(false);
        e.stopPropagation();
        deleteLocation(id);
    };

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const locDetails = {
                        country: '',
                        region: '',
                        district: '',
                        street: '',
                        house: '',
                        postalCode: '',
                        fullAddress: '',
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                    };
                    setNewLocation({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        address: t("myLocation"),
                        inLocationDetails: locDetails
                    });
                    setSearchQuery(t("myLocation"));
                },
                (err) => {
                    console.error('Geolocation error:', err);
                    alert(t("locationDetectionError"));
                }
            );
        } else {
            alert(t("geolocationNotSupported"));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="border-b border-gray-200 p-4 flex items-center justify-between">
                    {view !== 'list' ? (
                        <button onClick={() => setView('list')} className="text-gray-500 hover:text-gray-700">
                            <FiChevronLeft size={20} />
                        </button>
                    ) : <div className="w-6" />}

                    <h3 className="text-lg font-medium text-gray-900">
                        {view === 'list' ? t("chooseLocation") :
                            view === 'map' ? t("newPlace") : t("confirmLocation")}
                    </h3>

                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {view === 'list' && (
                        <LocationList
                            locations={locations}
                            selectedLocation={selectedLocation}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            onSelect={handleSelectLocation}
                            onAddNew={() => setView('map')}
                            onDelete={handleDeleteLocation}
                        />
                    )}

                    {view === 'map' && (
                        <LocationMap
                            center={[41.311081, 69.240562]}
                            selectedLocation={newLocation}
                            onLocationSelect={(lat, lng, address, inLocationDetails) => {
                                setNewLocation({
                                    lat,
                                    lng,
                                    address: address || `${t("latitude")}: ${lat.toFixed(4)}, ${t("longitude")}: ${lng.toFixed(4)}`,
                                    inLocationDetails
                                });
                                setSearchQuery(address || '');
                            }}
                            onUseCurrentLocation={handleUseCurrentLocation}
                        />
                    )}

                    {view === 'confirm' && newLocation && (
                        <LocationConfirm
                            location={{ ...newLocation, name: searchQuery }}
                            searchQuery={searchQuery}
                            onSave={handleSaveLocation}
                        />
                    )}
                </div>

                {/* Map View Footer */}
                {view === 'map' && (
                    <div className="border-t border-gray-200 p-4">
                        <button
                            onClick={() => newLocation ? setView('confirm') : alert(t("pleaseSelectOnMap"))}
                            className={`w-full py-2 rounded-md ${newLocation ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500'}`}
                        >
                            {t("continue")}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocationSelector;
