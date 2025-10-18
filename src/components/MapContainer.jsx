import React, { useState, useEffect } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Phone, Clock } from 'lucide-react';
import MovingVehicles from './MovingVehicles';
import DroneStations from './DroneStations';

// Componente para centrar el mapa cuando se selecciona una ubicación
function MapController({ selectedLocation }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedLocation) {
      map.flyTo([selectedLocation.lat, selectedLocation.lng], 16, {
        duration: 1.5
      });
    }
  }, [selectedLocation, map]);
  
  return null;
}

// Crear iconos personalizados para cada tipo (con cache)
const iconCache = new Map();
const createCustomIcon = (type) => {
  if (iconCache.has(type)) return iconCache.get(type);

  const colors = {
    'Oficina Central': '#1e40af',
    'Caseta': '#059669',
    'Módulo': '#dc2626'
  };
  
  const sizes = {
    'Oficina Central': [48, 64],
    'Caseta': [40, 56],
    'Módulo': [36, 52]
  };
  
  const color = colors[type] || '#6b7280';
  const [width, height] = sizes[type] || [36, 52];
  
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <filter id="shadow-${type}" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.5"/>
        </filter>
      </defs>
      <g filter="url(#shadow-${type})">
        <path d="M${width/2} 0C${width/4} 0 ${width/8} ${height/8} ${width/8} ${height/4}c0 ${height/3} ${width/3} ${height*0.6} ${width/3} ${height*0.6}s${width/3}-${height*0.4} ${width/3}-${height*0.6}c0-${height/6}-${width/8}-${height/4}-${width/3}-${height/4}z" 
              fill="${color}" stroke="#ffffff" stroke-width="2"/>
        <circle cx="${width/2}" cy="${height/4}" r="${width/6}" fill="#ffffff"/>
        <path d="M${width/2} ${height/5}l${width/16} ${width/12}h${width/12}l-${width/16} ${width/16} ${width/24} ${width/12}-${width/12}-${width/24}-${width/12} ${width/24} ${width/24}-${width/12}-${width/16}-${width/16}h${width/12}z" 
              fill="${color}"/>
      </g>
    </svg>
  `;
  
  const icon = L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [width, height],
    iconAnchor: [width/2, height],
    popupAnchor: [0, -height]
  });

  iconCache.set(type, icon);
  return icon;
};

// Ajustar a todas las ubicaciones al cargar (solo una vez)
function FitBounds({ locations }) {
  const map = useMap();
  const didFitRef = React.useRef(false);

  useEffect(() => {
    if (didFitRef.current) return;
    if (!locations || locations.length === 0) return;
    const bounds = L.latLngBounds(locations.map(l => [l.lat, l.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
    didFitRef.current = true;
  }, [locations, map]);
  return null;
}

function MapContainer({ locations, selectedLocation, onLocationSelect, onDronesUpdate, onActiveDronesUpdate, manualEmergencyTarget }) {  const center = [19.0414, -98.2063]; // Centro de Puebla
  
  return (
    <div className="w-full h-full relative">
      <LeafletMap
        center={center}
        zoom={12}
        className="w-full h-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds locations={locations} />
        
        <MapController selectedLocation={selectedLocation} />
        
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={createCustomIcon(location.type)}
            eventHandlers={{
              click: () => onLocationSelect(location)
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-1 text-gray-800">
                  {location.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {location.address}
                </p>
                <div className="flex items-center text-sm text-gray-700 mb-1">
                  <Phone className="w-4 h-4 mr-2" />
                  {location.phone}
                </div>
                <div className="flex items-center text-sm text-gray-700 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  {location.hours}
                </div>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                  location.type === 'Oficina Central' ? 'bg-blue-100 text-blue-800' :
                  location.type === 'Caseta' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {location.type}
                </span>
              </div>
            </Popup>
            </Marker>
        ))}
        
        <MovingVehicles onVehiclesUpdate={onDronesUpdate} />
        <DroneStations onActiveDronesUpdate={onActiveDronesUpdate} manualEmergencyTarget={manualEmergencyTarget} />
        
      </LeafletMap>
    </div>
  );
}

export default MapContainer;