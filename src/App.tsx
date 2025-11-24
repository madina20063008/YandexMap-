import './App.css';
import DefaultNavbar from './components/Location';

function App() {
  const handleLocationSelect = (_name: string, fullLocation: any) => {
    console.log('Selected location:', fullLocation);
  };

  return (
    <>
      <DefaultNavbar onSelect={handleLocationSelect} />
    </>
  );
}

export default App;