import React, { useState, useEffect } from 'react';
import { Marker, Popup, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { droneStations } from '../data/droneStations';
import droneImage from '../assets/dronx.png';

// Crear icono de base de drones con luces intermitentes MÁS RÁPIDAS
const createDroneStationIcon = (isActive) => {
  const iconHtml = `
    <div class="drone-station-marker ${isActive ? 'active' : 'inactive'}">
      <div class="drone-station-lights-fast ${isActive ? '' : 'hidden'}">
        <div class="police-light-fast red"></div>
        <div class="police-light-fast blue"></div>
      </div>
      <img src="${droneImage}" alt="Drone" class="drone-icon-base" style="opacity: ${isActive ? '1' : '0.3'}" />
      <div class="drone-station-pulse ${isActive ? '' : 'hidden'}"></div>
    </div>
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'drone-station-container',
    iconSize: [60, 60],
    iconAnchor: [30, 30],
    popupAnchor: [0, -30]
  });
};

// Crear icono del dron volando (más pequeño, animado)
const createFlyingDroneIcon = () => {
  const iconHtml = `
    <div class="flying-drone-marker">
      <div class="flying-drone-lights">
        <div class="police-light-fast red"></div>
        <div class="police-light-fast blue"></div>
      </div>
      <img src="${droneImage}" alt="Drone Volando" class="flying-drone-icon" />
    </div>
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'flying-drone-container',
    iconSize: [35, 35],
    iconAnchor: [17.5, 17.5],
    popupAnchor: [0, -17.5]
  });
};

function DroneStations({ onActiveDronesUpdate }) {  const [stations] = useState(droneStations);
  const [activeGroup, setActiveGroup] = useState(1);
  const [stationStates, setStationStates] = useState({});
  const [dronePositions, setDronePositions] = useState({});

  // Definir grupos de bases
  const groups = {
    1: ['station-texmelucan', 'station-amozoc'],
    2: ['station-europa', 'station-tehuacan']
  };

  useEffect(() => {
    // Alternar grupos cada 30 segundos
    const interval = setInterval(() => {
      setActiveGroup(prev => prev === 1 ? 2 : 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Actualizar estados de las estaciones basado en el grupo activo
    const newStates = {};
    stations.forEach(station => {
      newStates[station.id] = groups[activeGroup].includes(station.id);
    });
    setStationStates(newStates);
    
    // Notificar drones activos al componente padre
    if (onActiveDronesUpdate) {
      const activeDrones = stations
        .filter(station => newStates[station.id])
        .map(station => ({
          ...station,
          isActive: true
        }));
      onActiveDronesUpdate(activeDrones);
    }
  }, [activeGroup]); // Solo depende de activeGroup

  useEffect(() => {
    // Animar drones volando en círculo alrededor de la base
    const radius = 0.008; // Radio en grados (~800 metros)
    let angle = 0;

    const animationInterval = setInterval(() => {
      const newPositions = {};
      
      stations.forEach(station => {
        if (stationStates[station.id]) {
          // Calcular posición en círculo
          const offsetLat = radius * Math.cos(angle);
          const offsetLng = radius * Math.sin(angle);
          
          newPositions[station.id] = {
            lat: station.lat + offsetLat,
            lng: station.lng + offsetLng
          };
        }
      });
      
      setDronePositions(newPositions);
      angle += 0.05; // Velocidad de rotación
    }, 100); // Actualizar cada 100ms para movimiento suave

    return () => clearInterval(animationInterval);
  }, [stationStates, stations]);

  return (
    <>
      {stations.map((station) => {
        const isActive = stationStates[station.id] || false;
        const dronePos = dronePositions[station.id];
        
        return (
          <React.Fragment key={station.id}>
            {/* Base fija */}
            <Marker
              position={[station.lat, station.lng]}
              icon={createDroneStationIcon(isActive)}
              zIndexOffset={1000}
            >
              <Popup>
                <div className="p-3 min-w-[220px]">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex space-x-1">
                      {isActive ? (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-gray-900">
                      {station.name}
                    </h3>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 mr-2">Zona:</span>
                      <span className="text-gray-600">{station.zone}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 mr-2">Dirección:</span>
                      <span className="text-gray-600 text-xs">{station.address}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 mr-2">Estado:</span>
                      {isActive ? (
                        <span className="text-green-600 font-semibold">● Activa - Dron en vuelo</span>
                      ) : (
                        <span className="text-gray-500 font-semibold">○ En espera</span>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 mr-2">Drones disponibles:</span>
                      <span className={`font-bold ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                        {station.dronesActive}
                      </span>
                    </div>
                    
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 italic">{station.description}</p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Grupo de rotación:</span>{' '}
                        {groups[1].includes(station.id) ? 'Grupo 1 (Texmelucan + Amozoc)' : 'Grupo 2 (Europa + Tehuacán)'}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        {isActive ? '⚡ Actualmente operando' : '⏸ Próxima activación en rotación'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${
                      isActive 
                        ? 'bg-gradient-to-r from-red-100 to-blue-100 text-gray-800 border-blue-300' 
                        : 'bg-gray-100 text-gray-500 border-gray-300'
                    }`}>
                      {station.type} {isActive ? '- ACTIVA' : '- EN ESPERA'}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Círculo de área de vuelo */}
            {isActive && (
              <Circle
                center={[station.lat, station.lng]}
                radius={800}
                pathOptions={{
                  color: '#3b82f6',
                  fillColor: '#3b82f6',
                  fillOpacity: 0.05,
                  weight: 1,
                  dashArray: '5, 10'
                }}
              />
            )}

            {/* Dron volando en círculo */}
            {isActive && dronePos && (
              <Marker
                position={[dronePos.lat, dronePos.lng]}
                icon={createFlyingDroneIcon()}
                zIndexOffset={2500}
              >
                <Tooltip permanent direction="top" offset={[0, -20]} className="emergency-tooltip">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-600 font-bold text-xs">🚨 EMERGENCIA</span>
                    <span className="text-xs text-gray-700">- {station.zone}</span>
                  </div>
                </Tooltip>
              </Marker>
            )}
          </React.Fragment>
                );
            })}
          </>
        );
      }
      
      export default DroneStations;
