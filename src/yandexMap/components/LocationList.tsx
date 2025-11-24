import { FiMapPin, FiCheck, FiTrash2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface LocationListProps {
  locations: any[];
  selectedLocation: any;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelect: (location: any) => void;
  onAddNew: () => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const LocationList = ({ 
  locations, 
  selectedLocation, 
  searchQuery, 
  onSearchChange, 
  onSelect, 
  onAddNew,
  onDelete
}: LocationListProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder={t("search_locations")}
          className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <FiMapPin className="absolute left-3 top-3 text-gray-400" />
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {locations
          .filter((loc: any) => 
            loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loc.address.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((location: any) => (
            <div 
              key={location.id}
              className={`p-3 border rounded-md cursor-pointer flex justify-between items-center ${
                selectedLocation?.id === location.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => onSelect(location)}
            >
              <div>
                <h4 className="font-medium">{location.name}</h4>
                <p className="text-sm text-gray-500">{location.address}</p>
              </div>
              <div className="flex items-center">
                {selectedLocation?.id === location.id && (
                  <FiCheck className="text-blue-500 mr-2" />
                )}
                <button 
                  onClick={(e) => onDelete(location.id, e)}
                  className="text-gray-400 hover:text-red-500 p-1"
                  aria-label={t("delete_location")}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
        ))}
      </div>

      <button
        onClick={onAddNew}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center justify-center"
      >
        {t("add_new_location")}
      </button>
    </div>
  );
};

export default LocationList;
