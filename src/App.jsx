import React, { useState } from 'react';
import MapContainer from './components/MapContainer';
import LocationCard from './components/LocationCard';
import { policeLocations } from './data/locations';
import { Search } from 'lucide-react';
import logo from './assets/logo.png';



function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = policeLocations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
            <img src={logo} alt="GeoDrone Logo" className="h-12 w-auto" />
            <div>
                <h1 className="text-2xl font-bold">Mapa de Policía - Puebla</h1>
                <p className="text-blue-200 text-sm">Oficinas y casetas de seguridad</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-200">Total de ubicaciones</p>
              <p className="text-2xl font-bold">{policeLocations.length}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-96 bg-white shadow-lg overflow-y-auto">
          <div className="p-4 border-b sticky top-0 bg-white z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, dirección o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {filteredLocations.length} resultado{filteredLocations.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="p-4 space-y-3">
            {filteredLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                isSelected={selectedLocation?.id === location.id}
                onClick={() => setSelectedLocation(location)}
              />
            ))}
          </div>
        </aside>

        {/* Map */}
        <main className="flex-1">
          <MapContainer
            locations={filteredLocations}
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
          />
        </main>
      </div>
    </div>
  );
}

export default App;