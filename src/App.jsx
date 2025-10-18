import React, { useState, useEffect, useRef } from 'react';
import MapContainer from './components/MapContainer';
import LocationCard from './components/LocationCard';
import DroneCard from './components/DroneCard';
import ActiveDroneCard from './components/ActiveDroneCard';
import { policeLocations } from './data/locations';
import { droneStations } from './data/droneStations';
import { getRandomEmergency, getRandomSpeed, getRandomAltitude } from './data/emergencyTypes';
import { Search, Plane, Radio, AlertTriangle } from 'lucide-react';
import logo from './assets/logo.png';

const EMERGENCY_LOCATIONS = {
  texmelucan_iglesia_santiago: { name: 'Texmelucan · Iglesia de Santiago', lat: 19.2846, lng: -98.4388 },
  puebla_parroquia_san_jose_la_hacienda: { name: 'Puebla · Parroquia San José La Hacienda', lat: 19.0199, lng: -98.2687 },
  amozoc_privada_nacarada: { name: 'Amozoc · Privada Nacarada', lat: 19.0428, lng: -98.0385 },
  tehuacan_aeropuerto: { name: 'Tehuacán · Aeropuerto', lat: 18.497, lng: -97.419 }
};

const toRad = (deg) => deg * Math.PI / 180;
const metersBetween = (a, b) => {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [drones, setDrones] = useState([]);
  const [activeDrones, setActiveDrones] = useState([]);
  const activeDronesRef = useRef({});
  const [manualEmergencyTarget, setManualEmergencyTarget] = useState(null);

  const filteredLocations = policeLocations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDronesUpdate = (updatedDrones) => {
    setDrones(updatedDrones);
  };

  const handleActiveDronesUpdate = (activeStations) => {
    // Convertir estaciones activas en drones con datos de emergencia
    const dronesWithEmergency = activeStations.map(station => {
      // Si el dron ya existe en el ref, mantener sus datos
      if (activeDronesRef.current[station.id]) {
        return activeDronesRef.current[station.id];
      }
      
      // Si es nuevo, generar nuevos datos de emergencia
      const newDrone = {
        ...station,
        emergency: getRandomEmergency(),
        speed: getRandomSpeed(),
        altitude: getRandomAltitude()
      };
      
      activeDronesRef.current[station.id] = newDrone;
      return newDrone;
    });
    
    // Limpiar drones que ya no están activos
    const activeIds = activeStations.map(s => s.id);
    Object.keys(activeDronesRef.current).forEach(id => {
      if (!activeIds.includes(id)) {
        delete activeDronesRef.current[id];
      }
    });
    
    setActiveDrones(dronesWithEmergency);
  };

  // Regenerar misiones cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeDrones.length > 0) {
        const updatedDrones = activeDrones.map(drone => ({
          ...drone,
          emergency: getRandomEmergency(),
          speed: getRandomSpeed(),
          altitude: getRandomAltitude()
        }));
        
        // Actualizar ref
        updatedDrones.forEach(drone => {
          activeDronesRef.current[drone.id] = drone;
        });
        
        setActiveDrones(updatedDrones);
      }
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [activeDrones.length]);

  const handleDroneClick = (drone) => {
    setSelectedLocation({
      id: drone.id,
      lat: drone.position?.lat || drone.lat,
      lng: drone.position?.lng || drone.lng,
      name: drone.name,
      type: drone.type
    });
  };

  const handleActiveDroneClick = (drone) => {
    setSelectedLocation({
      id: drone.id,
      lat: drone.lat,
      lng: drone.lng,
      name: drone.name,
      type: drone.type
    });
  };

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
                <p className="text-blue-200 text-sm">Oficinas, casetas y drones móviles</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-200">Total de ubicaciones</p>
              <p className="text-2xl font-bold">{policeLocations.length + drones.length + activeDrones.length}</p>
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
              {filteredLocations.length} ubicación{filteredLocations.length !== 1 ? 'es' : ''} • {activeDrones.length} emergencia{activeDrones.length !== 1 ? 's' : ''} • {drones.length} patrulla{drones.length !== 1 ? 's' : ''}
            </p>

            <div className="mt-3 grid grid-cols-1 gap-2">
              {Object.entries(EMERGENCY_LOCATIONS).map(([key, loc]) => {
                let nearest = droneStations[0];
                let minD = Infinity;
                droneStations.forEach(st => {
                  const d = metersBetween({ lat: st.lat, lng: st.lng }, { lat: loc.lat, lng: loc.lng });
                  if (d < minD) { minD = d; nearest = st; }
                });
                const distanceKm = (minD / 1000).toFixed(1);
                const speedMpm = 900; // m/min
                const altitude = getRandomAltitude();
                const type = getRandomEmergency();
                const label = `${loc.name} • ${distanceKm} km • Tipo: ${type} • Vel: ${speedMpm} m/min • Alt: ${altitude} m`;
                const payload = { ...loc, speedMpm, altitude, type };
                return (
                  <button
                    key={key}
                    onClick={() => setManualEmergencyTarget(payload)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm text-left"
                  >
                    <AlertTriangle className="w-4 h-4" /> {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 space-y-3">
            {/* Sección de Drones en Emergencia */}
            {activeDrones.length > 0 && (
              <>
                <div className="flex items-center space-x-2 mb-2">
                  <Radio className="w-5 h-5 text-red-600 animate-pulse" />
                  <h2 className="font-bold text-sm text-gray-700 uppercase tracking-wide">
                    🚨 Drones en Emergencia
                  </h2>
                </div>
                {activeDrones.map((drone) => (
                  <ActiveDroneCard
                    key={drone.id}
                    drone={drone}
                    isSelected={selectedLocation?.id === drone.id}
                    onClick={() => handleActiveDroneClick(drone)}
                  />
                ))}
                <div className="border-t border-gray-300 my-4"></div>
              </>
            )}

            {/* Sección de Drones Móviles en Patrullaje */}
            {drones.length > 0 && (
              <>
                <div className="flex items-center space-x-2 mb-2">
                  <Plane className="w-5 h-5 text-purple-600" />
                  <h2 className="font-bold text-sm text-gray-700 uppercase tracking-wide">
                    Drones Móviles en Patrullaje
                  </h2>
                </div>
                {drones.map((drone) => (
                  <DroneCard
                    key={drone.id}
                    drone={drone}
                    isSelected={selectedLocation?.id === drone.id}
                    onClick={() => handleDroneClick(drone)}
                  />
                ))}
                <div className="border-t border-gray-300 my-4"></div>
              </>
            )}

            {/* Sección de Ubicaciones Fijas */}
            <h2 className="font-bold text-sm text-gray-700 uppercase tracking-wide mb-2">
              Ubicaciones Fijas
            </h2>
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
            onDronesUpdate={handleDronesUpdate}
            onActiveDronesUpdate={handleActiveDronesUpdate}
            manualEmergencyTarget={manualEmergencyTarget}
          />
        </main>
      </div>
    </div>
  );
}

export default App;