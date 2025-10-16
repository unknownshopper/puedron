// Drones Dragon Fish patrullando cerca de sus bases
// Cada dron patrulla en un radio cercano a su base asignada

export const vehicleRoutes = [
    {
      id: 'drone-amozoc',
      name: 'DRON DRAGON FISH – JAC – MÓVIL ESTATAL',
      unit: 'Dron Amozoc',
      zone: 'Amozoc',
      type: 'Dron Móvil',
      baseId: 'station-amozoc',
      color: '#3b82f6', // Azul
      speed: 40, // km/h aproximado
      route: [
        // Ruta circular cerca de la base de Amozoc (19.0380, -98.0520)
        { lat: 19.0380, lng: -98.0520 }, // Base
        { lat: 19.0400, lng: -98.0500 }, // Norte
        { lat: 19.0420, lng: -98.0480 }, // Noreste
        { lat: 19.0430, lng: -98.0500 }, // Este
        { lat: 19.0420, lng: -98.0530 }, // Sureste
        { lat: 19.0400, lng: -98.0550 }, // Sur
        { lat: 19.0370, lng: -98.0560 }, // Suroeste
        { lat: 19.0350, lng: -98.0540 }, // Oeste
        { lat: 19.0360, lng: -98.0510 }, // Noroeste
        { lat: 19.0380, lng: -98.0520 }, // Regreso a base
      ]
    },
    {
      id: 'drone-europa',
      name: 'DRON DRAGON FISH – JAC – MÓVIL ESTATAL',
      unit: 'Dron Boulevard Europa',
      zone: 'Boulevard Europa',
      type: 'Dron Móvil',
      baseId: 'station-europa',
      color: '#ef4444', // Rojo
      speed: 45, // km/h aproximado
      route: [
        // Ruta circular cerca de la base de Boulevard Europa (19.0050, -98.2550)
        { lat: 19.0050, lng: -98.2550 }, // Base
        { lat: 19.0070, lng: -98.2530 }, // Norte
        { lat: 19.0090, lng: -98.2520 }, // Noreste
        { lat: 19.0100, lng: -98.2540 }, // Este
        { lat: 19.0090, lng: -98.2570 }, // Sureste
        { lat: 19.0070, lng: -98.2580 }, // Sur
        { lat: 19.0040, lng: -98.2580 }, // Suroeste
        { lat: 19.0020, lng: -98.2560 }, // Oeste
        { lat: 19.0030, lng: -98.2540 }, // Noroeste
        { lat: 19.0050, lng: -98.2550 }, // Regreso a base
      ]
    },
    {
      id: 'drone-texmelucan',
      name: 'DRON DRAGON FISH – JAC – MÓVIL ESTATAL',
      unit: 'Dron San Martín Texmelucan',
      zone: 'San Martín Texmelucan',
      type: 'Dron Móvil',
      baseId: 'station-texmelucan',
      color: '#10b981', // Verde
      speed: 42, // km/h aproximado
      route: [
        // Ruta circular cerca de la base de Texmelucan (19.2870, -98.4380)
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
      id: 'drone-tehuacan',
      name: 'DRON DRAGON FISH – JAC – MÓVIL ESTATAL',
      unit: 'Dron Tehuacán',
      zone: 'Tehuacán',
      type: 'Dron Móvil',
      baseId: 'station-tehuacan',
      color: '#f59e0b', // Naranja
      speed: 38, // km/h aproximado
      route: [
        // Ruta circular cerca de la base de Tehuacán (18.4620, -97.3950)
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