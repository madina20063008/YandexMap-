import { createContext, useState } from "react";
import type { ReactNode } from "react"; // Type-only import

interface LocationContextType {
  isOn: boolean;
  setIsOn: (value: boolean) => void;
}

export const LocationContext = createContext<LocationContextType>({
  isOn: true,
  setIsOn: () => {},
});

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [isOn, setIsOn] = useState(false);

  return (
    <LocationContext.Provider value={{ isOn, setIsOn }}>
      {children}
    </LocationContext.Provider>
  );
};