import { useState } from 'react';
import './App.css';
import DefaultNavbar from './components/Location';

function App() {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const handleLocationSelect = (name: string, fullLocation: any) => {
    setSelectedLocation(fullLocation);
    console.log('Selected location:', fullLocation);
  };

  return (
    <>
      <DefaultNavbar onSelect={handleLocationSelect} />
      
    </>
  );
}

export default App;