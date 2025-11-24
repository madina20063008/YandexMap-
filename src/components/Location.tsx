import { useState, useEffect, useContext } from "react";
import { LocationContext } from "../context/LocationContext";
import LocationSelector from "../yandexMap/index";


interface DefaultNavbarProps {
  onSelect?: (name: string, fullLocation: any) => void;
}

const DefaultNavbar = ({ onSelect }: DefaultNavbarProps) => {
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [selectedLocationName, setSelectedLocationName] = useState("");
  const { setIsOn } = useContext(LocationContext);

  useEffect(() => {
    const savedLocation = localStorage.getItem("currentLocation");
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        setSelectedLocationName(location.name);
      } catch (error) {
        console.error("Error parsing saved location:", error);
      }
    }
  }, []);

  const handleLocationSelect = (name: string, fullLocation: any) => {
    setIsOn(false);
    setSelectedLocationName(name);
    localStorage.setItem("currentLocation", JSON.stringify(fullLocation));
    setShowLocationSelector(false);
    
    // Call the parent's onSelect callback if provided
    if (onSelect) {
      onSelect(name, fullLocation);
    }
  };

  return (
    <div className="bg-color-darkblue fixed z-[100] w-full top-0 left-0">
      <div className="w-full bg-[white] p-2">
        <button
          onClick={() => { setShowLocationSelector(true); setIsOn(true); }}
          className="container px-4 flex items-center gap-x-2 text-[black] hover:text-blue-400 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {selectedLocationName ? (
            <span className="text-[12px] line-clamp-1">{selectedLocationName}</span>
          ) : (
            <span className="ml-2">Delivery Address</span>
          )}
        </button>
      </div>

      {showLocationSelector && (
        <LocationSelector 
          onClose={() => setShowLocationSelector(false)} 
          onSelect={handleLocationSelect} 
        />
      )}
    </div>
  );
};

export default DefaultNavbar;