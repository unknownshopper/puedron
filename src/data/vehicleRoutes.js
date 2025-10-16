// Drones móviles patrullando áreas específicas de Puebla
// 5 móviles con identificadores claros

export const vehicleRoutes = [
    {
      id: 'movil-texmelucan',
      name: 'DRON DRAGON FISH – JAC – MÓVIL ESTATAL',
      unit: 'Móvil Texmelucan',
      zone: 'San Martín Texmelucan',
      type: 'Dron Móvil',
      baseId: 'station-texmelucan',
      color: '#10b981', // Verde
      speed: 42, // km/h aproximado
      route: [
        // Ruta circular cerca de Texmelucan (19.2870, -98.4380)
        { lat: 19.2870, lng: -98.4380 }, // Base
        { lat: 19.2890, lng: -98.4360 }, // Norte
        { lat: 19.2910, lng: -98.4350 }, // Noreste
        { lat: 19.2920, lng: -98.4370 }, // Este
        { lat: 19.2910, lng: -98.4400 }, // Sureste
        { lat: 19.2890, lng: -98.4410 }, // Sur
        { lat: 19.2860, lng: -98.4410 }, // Suroeste
        { lat: 19.2840, lng: -98.4390 }, // Oeste
        { lat: 19.2850, lng: -98.4370 }, // Noroeste
        { lat: 19.2870, lng: -98.4380 }, // Regreso a base
      ]
    },
    {
      id: 'movil-puebla-sur',
      name: 'DRON DRAGON FISH – JAC – MÓVIL ESTATAL',
      unit: 'Móvil Puebla Sur',
      zone: 'Loma Encantada',
      type: 'Dron Móvil',
      color: '#3b82f6', // Azul
      speed: 40, // km/h aproximado
      route: [
        // Ruta por Loma Encantada (zona este/sur de Puebla)
        { lat: 19.0450, lng: -98.1820 }, // Inicio - CAPU
        { lat: 19.0480, lng: -98.1780 }, // Av. Carmen Serdán
        { lat: 19.0520, lng: -98.1750 }, // Hacia Loma Encantada
        { lat: 19.0550, lng: -98.1720 }, // Interior Loma Encantada
        { lat: 19.0580, lng: -98.1740 }, // Zona residencial
        { lat: 19.0600, lng: -98.1780 }, // Circuito norte
        { lat: 19.0580, lng: -98.1820 }, // Regreso
        { lat: 19.0550, lng: -98.1850 }, // Av. Principal
        { lat: 19.0520, lng: -98.1830 }, // Conexión
        { lat: 19.0480, lng: -98.1850 }, // Vuelta
        { lat: 19.0450, lng: -98.1820 }, // Regreso al inicio
      ]
    },
    {
      id: 'movil-puebla-norte',
      name: 'DRON DRAGON FISH – JAC – MÓVIL ESTATAL',
      unit: 'Móvil Puebla Norte',
      zone: 'Camino Real del Bosque',
      type: 'Dron Móvil',
      color: '#8b5cf6', // Morado
      speed: 38, // km/h aproximado
      route: [
        // Ruta por Camino Real del Bosque (zona norte de Puebla)
        { lat: 19.0850, lng: -98.2100 }, // Inicio - Camino Real
        { lat: 19.0880, lng: -98.2080 }, // Norte
        { lat: 19.0910, lng: -98.2060 }, // Noreste
        { lat: 19.0930, lng: -98.2080 }, // Este
        { lat: 19.0920, lng: -98.2110 }, // Sureste
        { lat: 19.0900, lng: -98.2130 }, // Sur
        { lat: 19.0870, lng: -98.2140 }, // Suroeste
        { lat: 19.0840, lng: -98.2130 }, // Oeste
        { lat: 19.0830, lng: -98.2110 }, // Noroeste
        { lat: 19.0850, lng: -98.2100 }, // Regreso
      ]
    },
    {
        id: 'movil-amozoc',
        name: 'DRON DRAGON FISH – JAC – MÓVIL ESTATAL',
        unit: 'Móvil Amozoc',
        zone: 'Rinconada Amozoc 21',
        type: 'Dron Móvil',
        baseId: 'station-amozoc',
        color: '#f59e0b', // Naranja
        speed: 40, // km/h aproximado
        route: [
          // Ruta circular por Rinconada Amozoc 21 (zona residencial)
          { lat: 19.0420, lng: -98.0480 }, // Inicio - Rinconada Amozoc
          { lat: 19.0440, lng: -98.0460 }, // Norte - Av. Principal
          { lat: 19.0460, lng: -98.0450 }, // Noreste - Zona residencial
          { lat: 19.0475, lng: -98.0465 }, // Este - Circuito interno
          { lat: 19.0470, lng: -98.0490 }, // Sureste - Área verde
          { lat: 19.0455, lng: -98.0510 }, // Sur - Zona comercial
          { lat: 19.0435, lng: -98.0520 }, // Suroeste - Acceso sur
          { lat: 19.0415, lng: -98.0510 }, // Oeste - Perímetro
          { lat: 19.0405, lng: -98.0490 }, // Noroeste - Conexión
          { lat: 19.0420, lng: -98.0480 }, // Regreso al inicio
        ]
      },
    {
      id: 'movil-tehuacan',
      name: 'DRON DRAGON FISH – JAC – MÓVIL ESTATAL',
      unit: 'Móvil Tehuacán',
      zone: 'Tehuacán',
      type: 'Dron Móvil',
      baseId: 'station-tehuacan',
      color: '#ef4444', // Rojo
      speed: 38, // km/h aproximado
      route: [
        // Ruta circular cerca de Tehuacán (18.4620, -97.3950)
        { lat: 18.4620, lng: -97.3950 }, // Base
        { lat: 18.4640, lng: -97.3930 }, // Norte
        { lat: 18.4660, lng: -97.3920 }, // Noreste
        { lat: 18.4670, lng: -97.3940 }, // Este
        { lat: 18.4660, lng: -97.3970 }, // Sureste
        { lat: 18.4640, lng: -97.3980 }, // Sur
        { lat: 18.4610, lng: -97.3980 }, // Suroeste
        { lat: 18.4590, lng: -97.3960 }, // Oeste
        { lat: 18.4600, lng: -97.3940 }, // Noroeste
        { lat: 18.4620, lng: -97.3950 }, // Regreso a base
      ]
    }
  ];

  // Función auxiliar para calcular la distancia entre dos puntos
  export const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  // Función para interpolar entre dos puntos
  export const interpolatePosition = (start, end, progress) => {
    return {
      lat: start.lat + (end.lat - start.lat) * progress,
      lng: start.lng + (end.lng - start.lng) * progress
    };
  };