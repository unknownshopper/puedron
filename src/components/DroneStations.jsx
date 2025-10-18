import React, { useState, useEffect, useRef } from 'react';
import { Marker, Popup, Circle, Tooltip, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { droneStations } from '../data/droneStations';
import droneImage from '../assets/dronx.png';
import emerImage from '../assets/emer.png';

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

const toRad = (deg) => deg * Math.PI / 180;
const metersBetween = (a, b) => {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.sqrt(h));
};
const randomPointAround = (lat, lng, radiusMeters) => {
  const r = Math.random() * radiusMeters;
  const t = Math.random() * 2 * Math.PI;
  const dLat = (r * Math.cos(t)) / 111000;
  const dLng = (r * Math.sin(t)) / (111000 * Math.cos(toRad(lat)));
  return { lat: lat + dLat, lng: lng + dLng };
};
const createEmergencyIcon = () => {
  const html = `<div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;">
    <img src="${emerImage}" alt="Emergencia" style="width:36px;height:36px;object-fit:contain;filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));"/>
  </div>`;
  return L.divIcon({ html, className: 'emergency-marker', iconSize: [40, 40], iconAnchor: [20, 20], popupAnchor: [0, -20] });
};

function DroneStations({ onActiveDronesUpdate, manualEmergencyTarget }) {  const [stations] = useState(droneStations);
  const map = useMap();
  const [activeGroup, setActiveGroup] = useState(1);
  const [stationStates, setStationStates] = useState({});
  const [dronePositions, setDronePositions] = useState({});
  const [emergency, setEmergency] = useState(null);
  const missionRef = useRef(null);
  const animRef = useRef(null);
  const [tick, setTick] = useState(0);

  // Definir grupos de bases
  const groups = {
    1: ['station-texmelucan', 'station-amozoc'],
    2: ['station-europa', 'station-tehuacan']
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGroup(prev => prev === 1 ? 2 : 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Generador automático inicial (si no hay objetivo manual)
  useEffect(() => {
    if (manualEmergencyTarget) return; // si hay objetivo manual, no generar
    if (emergency || stations.length === 0) return;
    const s = stations[Math.floor(Math.random() * stations.length)];
    const target = randomPointAround(s.lat, s.lng, 3000);
    let nearest = s;
    let minD = Infinity;
    stations.forEach(st => {
      const d = metersBetween({ lat: st.lat, lng: st.lng }, target);
      if (d < minD) { minD = d; nearest = st; }
    });
    const prepMs = 90 * 1000;
    const travelMs = Math.max(1, Math.round(minD / 900 * 60000));
    missionRef.current = {
      assignedId: nearest.id,
      start: Date.now(),
      prepMs,
      travelMs,
      stationPos: { lat: nearest.lat, lng: nearest.lng },
      targetPos: target
    };
    // asegurar posición inicial visible del dron asignado
    setDronePositions(prev => ({ ...prev, [nearest.id]: { lat: nearest.lat, lng: nearest.lng } }));
    setEmergency({ lat: target.lat, lng: target.lng, assignedId: nearest.id });
    // centrar mapa al área de interés
    if (map) {
      map.flyTo([target.lat, target.lng], 15, { duration: 1.2 });
    }
  }, [emergency, stations, manualEmergencyTarget, map]);

  // Disparador manual desde UI
  useEffect(() => {
    if (!manualEmergencyTarget) return;
    // cancelar misión previa
    if (animRef.current) cancelAnimationFrame(animRef.current);
    missionRef.current = null;

    const target = { lat: manualEmergencyTarget.lat, lng: manualEmergencyTarget.lng };
    // encontrar base más cercana
    let nearest = stations[0];
    let minD = Infinity;
    stations.forEach(st => {
      const d = metersBetween({ lat: st.lat, lng: st.lng }, target);
      if (d < minD) { minD = d; nearest = st; }
    });
    const prepMs = 90 * 1000;
    const speedMpm = manualEmergencyTarget.speedMpm ?? 900; // m/min
    const altitude = manualEmergencyTarget.altitude ?? 120; // m (fallback)
    const type = manualEmergencyTarget.type ?? 'Incidente';
    const travelMs = Math.max(1, Math.round(minD / speedMpm * 60000));

    missionRef.current = {
      assignedId: nearest.id,
      start: Date.now(),
      prepMs,
      travelMs,
      stationPos: { lat: nearest.lat, lng: nearest.lng },
      targetPos: target,
      distanceMeters: minD,
      speedMpm,
      altitude,
      type
    };
    setDronePositions(prev => ({ ...prev, [nearest.id]: { lat: nearest.lat, lng: nearest.lng } }));
    setEmergency({ lat: target.lat, lng: target.lng, assignedId: nearest.id });
    // centrar mapa al área de interés
    if (map) {
      map.flyTo([target.lat, target.lng], 15, { duration: 1.2 });
    }
  }, [manualEmergencyTarget, stations, map]);

  useEffect(() => {
    if (!missionRef.current) return;
    const animate = () => {
      const m = missionRef.current;
      if (!m) return;
      const now = Date.now();
      const t0 = m.start;
      const tPrepEnd = t0 + m.prepMs;
      const tTravelEnd = tPrepEnd + m.travelMs;
      let pos = m.stationPos;
      if (now >= tPrepEnd) {
        const p = Math.min(1, Math.max(0, (now - tPrepEnd) / m.travelMs));
        pos = {
          lat: m.stationPos.lat + (m.targetPos.lat - m.stationPos.lat) * p,
          lng: m.stationPos.lng + (m.targetPos.lng - m.stationPos.lng) * p,
        };
      }
      setDronePositions(prev => ({ ...prev, [m.assignedId]: pos }));
      if (now >= tTravelEnd) {
        missionRef.current = null;
        setEmergency(null);
        return;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [emergency]);

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
    const radius = 0.008;
    let angle = 0;
    const animationInterval = setInterval(() => {
      if (missionRef.current) return;
      const newPositions = {};
      stations.forEach(station => {
        if (stationStates[station.id]) {
          const offsetLat = radius * Math.cos(angle);
          const offsetLng = radius * Math.sin(angle);
          newPositions[station.id] = { lat: station.lat + offsetLat, lng: station.lng + offsetLng };
        }
      });
      setDronePositions(newPositions);
      angle += 0.05;
    }, 100);
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

            {dronePositions[station.id] && (
              <Marker
                position={[dronePositions[station.id].lat, dronePositions[station.id].lng]}
                icon={createFlyingDroneIcon()}
                zIndexOffset={2500}
              >
                {emergency && missionRef.current && missionRef.current.assignedId === station.id ? (
                  <Tooltip permanent direction="top" offset={[0, -20]} className="emergency-tooltip">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600 font-bold text-xs">🚨 EMERGENCIA</span>
                      <span className="text-xs text-gray-700">{(() => {
                        const m = missionRef.current;
                        if (!m) return 'ETA 0.0m';
                        const now = Date.now();
                        const tPrepEnd = m.start + m.prepMs;
                        const info = m.distanceMeters !== undefined ? (() => {
  const distKm = m.distanceMeters / 1000;
  const distLabel = distKm >= 1 ? `${distKm.toFixed(1)} km` : `${Math.round(m.distanceMeters)} m`;
  return ` • Dist Base→Emergencia: ${distLabel} • Vel: ${m.speedMpm} m/min • Alt: ${m.altitude} m • Tipo: ${m.type}`;
})() : '';
                        if (now < tPrepEnd) {
                          const rem = Math.max(0, tPrepEnd - now);
                          const mm = Math.floor(rem / 60000);
                          const ss = Math.floor((rem % 60000) / 1000).toString().padStart(2, '0');
                          return `Preparación ${mm}:${ss}${info}`;
                        }
                        const end = tPrepEnd + m.travelMs;
                        const rem = Math.max(0, end - now) / 60000;
                        return `ETA ${rem.toFixed(1)}m${info}`;
                      })()}</span>
                    </div>
                  </Tooltip>
                ) : null}
              </Marker>
            )}
          </React.Fragment>
                );
            })}

            {emergency && missionRef.current && (
              <Polyline
                positions={[[missionRef.current.stationPos.lat, missionRef.current.stationPos.lng],[missionRef.current.targetPos.lat, missionRef.current.targetPos.lng]]}
                pathOptions={{ color: '#ef4444', weight: 2, opacity: 0.6, dashArray: '6,6' }}
              />
            )}

            {emergency && (
              <Marker
                position={[emergency.lat, emergency.lng]}
                icon={createEmergencyIcon()}
                zIndexOffset={3000}
              >
                <Tooltip permanent direction="top" offset={[0, -20]} className="emergency-tooltip">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-600 font-bold text-xs">🚨 EMERGENCIA</span>
                    <span className="text-xs text-gray-700">{(() => {
                      const m = missionRef.current;
                      if (!m) return 'ETA 0.0m';
                      const now = Date.now();
                      const tPrepEnd = m.start + m.prepMs;
                      if (now < tPrepEnd) {
                        const rem = Math.max(0, tPrepEnd - now);
                        const mm = Math.floor(rem / 60000);
                        const ss = Math.floor((rem % 60000) / 1000).toString().padStart(2, '0');
                        return `Preparación ${mm}:${ss}`;
                      }
                      const end = tPrepEnd + m.travelMs;
                      const rem = Math.max(0, end - now) / 60000;
                      return `ETA ${rem.toFixed(1)}m`;
                    })()}</span>
                  </div>
                </Tooltip>
              </Marker>
            )}
          </>
        );
      }
      
      export default DroneStations;
