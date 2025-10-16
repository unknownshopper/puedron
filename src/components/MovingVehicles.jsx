import React, { useState, useEffect, useRef } from 'react';
import { Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { vehicleRoutes } from '../data/vehicleRoutes';

// Crear icono personalizado para vehículos en movimiento
const createVehicleIcon = (color, rotation = 0) => {
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" style="transform: rotate(${rotation}deg);">
      <defs>
        <filter id="shadow-vehicle" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.6"/>
        </filter>
      </defs>
      <g filter="url(#shadow-vehicle)">
        <!-- Cuerpo del vehículo -->
        <rect x="10" y="8" width="20" height="24" rx="3" fill="${color}" stroke="#ffffff" stroke-width="2"/>
        <!-- Parabrisas -->
        <rect x="12" y="10" width="16" height="8" rx="2" fill="#4dd0e1" opacity="0.7"/>
        <!-- Luces -->
        <circle cx="15" cy="28" r="2" fill="#ffeb3b"/>
        <circle cx="25" cy="28" r="2" fill="#ffeb3b"/>
        <!-- Sirena -->
        <ellipse cx="20" cy="14" rx="3" ry="2" fill="#ff1744" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1s" repeatCount="indefinite"/>
        </ellipse>
        <!-- Dirección (flecha) -->
        <path d="M 20 2 L 24 8 L 16 8 Z" fill="#ffffff"/>
      </g>
    </svg>
  `;
  
  return L.divIcon({
    html: svgIcon,
    className: 'vehicle-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

// Calcular ángulo de rotación entre dos puntos
const calculateBearing = (start, end) => {
  const startLat = start.lat * Math.PI / 180;
  const startLng = start.lng * Math.PI / 180;
  const endLat = end.lat * Math.PI / 180;
  const endLng = end.lng * Math.PI / 180;
  
  const dLng = endLng - startLng;
  const y = Math.sin(dLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) -
            Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
  
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
};

// Función para interpolar entre dos puntos
const interpolatePosition = (start, end, progress) => {
  return {
    lat: start.lat + (end.lat - start.lat) * progress,
    lng: start.lng + (end.lng - start.lng) * progress
  };
};

// Obtener ruta real usando OSRM (Open Source Routing Machine)
const fetchRouteFromOSRM = async (waypoints) => {
  try {
    // Construir coordenadas para OSRM (formato: lng,lat)
    const coordinates = waypoints.map(wp => `${wp.lng},${wp.lat}`).join(';');
    
    // Usar el servidor público de OSRM
    const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      // Convertir las coordenadas de GeoJSON a nuestro formato
      const routeCoordinates = data.routes[0].geometry.coordinates.map(coord => ({
        lat: coord[1],
        lng: coord[0]
      }));
      
      return routeCoordinates;
    }
    
    // Si falla, devolver los waypoints originales
    return waypoints;
  } catch (error) {
    console.error('Error fetching route from OSRM:', error);
    // En caso de error, devolver los waypoints originales
    return waypoints;
  }
};

function MovingVehicles({ onVehiclesUpdate }) {
    const [vehicles, setVehicles] = useState([]);
    const [routesLoaded, setRoutesLoaded] = useState(false);
    const animationRef = useRef(null);
    const startTimeRef = useRef(Date.now());
    const realRoutesCache = useRef({});
    const vehiclesRef = useRef([]); // <-- AGREGAR AQUÍ

  useEffect(() => {
    // Cargar rutas reales de OSRM
    const loadRealRoutes = async () => {
      const vehiclesWithRealRoutes = await Promise.all(
        vehicleRoutes.map(async (vehicleConfig) => {
          // Si ya tenemos la ruta en caché, usarla
          if (realRoutesCache.current[vehicleConfig.id]) {
            return {
              ...vehicleConfig,
              realRoute: realRoutesCache.current[vehicleConfig.id]
            };
          }

          // Obtener ruta real de OSRM
          const realRoute = await fetchRouteFromOSRM(vehicleConfig.route);
          
          // Guardar en caché
          realRoutesCache.current[vehicleConfig.id] = realRoute;
          
          return {
            ...vehicleConfig,
            realRoute: realRoute
          };
        })
      );

      // Inicializar vehículos con rutas reales
      const initialVehicles = vehiclesWithRealRoutes.map(vehicle => ({
        ...vehicle,
        currentSegment: 0,
        progress: 0,
        position: vehicle.realRoute[0],
        rotation: 0,
        path: [vehicle.realRoute[0]], // Rastro del vehículo
        totalSegments: vehicle.realRoute.length - 1
      }));
      
      setVehicles(initialVehicles);
      setRoutesLoaded(true);
    };

    loadRealRoutes();
  }, []);

 
  useEffect(() => {
    if (!routesLoaded) return;

    // Animación
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - startTimeRef.current) / 1000; // segundos
      startTimeRef.current = currentTime;

      setVehicles(prevVehicles => {
        if (prevVehicles.length === 0) return prevVehicles;
        
        const updatedVehicles = prevVehicles.map(vehicle => {
          const route = vehicle.realRoute;
          let { currentSegment, progress } = vehicle;
          
          // Velocidad de progreso basada en la velocidad del vehículo
          // Ajustamos para que se mueva de forma más realista
          const speedFactor = vehicle.speed / 100;
          progress += deltaTime * speedFactor * 0.3;

          // Si completamos el segmento actual
          if (progress >= 1) {
            progress = 0;
            currentSegment = (currentSegment + 1) % route.length;
          }

          // Calcular posición actual
          const startPoint = route[currentSegment];
          const endPoint = route[(currentSegment + 1) % route.length];
          const position = interpolatePosition(startPoint, endPoint, progress);
          
          // Calcular rotación
          const rotation = calculateBearing(startPoint, endPoint);

          // Actualizar rastro (últimas 30 posiciones para mejor visualización)
          const newPath = [...vehicle.path, position].slice(-30);

          return {
            ...vehicle,
            currentSegment,
            progress,
            position,
            rotation,
            path: newPath
          };
        });
        
        vehiclesRef.current = updatedVehicles;
        return updatedVehicles;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [routesLoaded]); // SOLO depende de routesLoaded
  

  // Actualizar al padre solo cada segundo (no en cada frame)
  useEffect(() => {
    if (!onVehiclesUpdate) return;

    const interval = setInterval(() => {
      if (vehiclesRef.current.length > 0) {
        onVehiclesUpdate(vehiclesRef.current);
      }
    }, 1000); // Actualizar cada 1 segundo

    return () => clearInterval(interval);
  }, [onVehiclesUpdate]);


  if (!routesLoaded) {
    return null; // O un loader si prefieres
  }

  return (
    <>
      {vehicles.map(vehicle => (
        <React.Fragment key={vehicle.id}>
          {/* Ruta completa (opcional - muestra toda la ruta) */}
          <Polyline
            positions={vehicle.realRoute.map(p => [p.lat, p.lng])}
            color={vehicle.color}
            weight={2}
            opacity={0.2}
            dashArray="10, 10"
          />
          
          {/* Rastro del vehículo (últimas posiciones) */}
          <Polyline
            positions={vehicle.path.map(p => [p.lat, p.lng])}
            color={vehicle.color}
            weight={4}
            opacity={0.6}
            dashArray="5, 5"
          />
          
          {/* Marcador del vehículo */}
          <Marker
            position={[vehicle.position.lat, vehicle.position.lng]}
            icon={createVehicleIcon(vehicle.color, vehicle.rotation)}
            zIndexOffset={2000}
          >
                       <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-base mb-1 text-gray-900">
                  {vehicle.name}
                </h3>
                <div className="text-xs text-gray-600 space-y-1 mb-2">
                  <div className="flex items-center">
                    <span className="font-semibold mr-1">Zona:</span>
                    <span>{vehicle.zone}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-1">Estado:</span>
                    <span className="text-green-600">● En patrullaje</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-1">Velocidad:</span>
                    <span>{vehicle.speed} km/h</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-1">Posición:</span>
                    <span>{vehicle.position.lat.toFixed(4)}, {vehicle.position.lng.toFixed(4)}</span>
                  </div>
                </div>
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                  {vehicle.type}
                </span>
              </div>
            </Popup>
          </Marker>
        </React.Fragment>
      ))}
    </>
  );
}

export default MovingVehicles;