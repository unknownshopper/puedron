// Bases de drones fijas con luces intermitentes
// Estas son ubicaciones donde los drones tienen su base de operaciones
// Alternan en 2 grupos cada 30 segundos

export const droneStations = [
    {
      id: 'station-tehuacan',
      name: 'Base de Drones Tehuacán',
      zone: 'Tehuacán',
      address: 'Calzada Adolfo López Mateos, Tehuacán',
      lat: 18.4620,
      lng: -97.3950,
      type: 'Base de Drones',
      status: 'Activa',
      dronesActive: 1,
      description: 'Centro de operaciones de drones Dragon Fish',
      group: 2 // Grupo 2: Europa + Tehuacán
    },
    {
      id: 'station-amozoc',
      name: 'Base de Drones Amozoc',
      zone: 'Amozoc',
      address: 'Carretera Federal México-Puebla, Amozoc',
      lat: 19.0380,
      lng: -98.0520,
      type: 'Base de Drones',
      status: 'Activa',
      dronesActive: 1,
      description: 'Centro de operaciones de drones Dragon Fish',
      group: 1 // Grupo 1: Texmelucan + Amozoc
    },
    {
      id: 'station-europa',
      name: 'Base de Drones Boulevard Europa',
      zone: 'Boulevard Europa',
      address: 'Boulevard Europa, Lomas de Angelópolis',
      lat: 19.0050,
      lng: -98.2550,
      type: 'Base de Drones',
      status: 'Activa',
      dronesActive: 1,
      description: 'Centro de operaciones de drones Dragon Fish',
      group: 2 // Grupo 2: Europa + Tehuacán
    },
    {
      id: 'station-texmelucan',
      name: 'Base de Drones San Martín Texmelucan',
      zone: 'San Martín Texmelucan',
      address: 'Carretera Federal México-Puebla, Texmelucan',
      lat: 19.2870,
      lng: -98.4380,
      type: 'Base de Drones',
      status: 'Activa',
      dronesActive: 1,
      description: 'Centro de operaciones de drones Dragon Fish',
      group: 1 // Grupo 1: Texmelucan + Amozoc
    }
  ];