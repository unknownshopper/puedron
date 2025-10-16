// Tipos de emergencias variadas para drones
export const emergencyTypes = [
    {
      id: 'accident',
      type: 'Accidente Vehicular',
      icon: '🚗💥',
      color: '#ef4444',
      bgColor: '#fee2e2',
      priority: 'Alta',
      description: 'Colisión múltiple reportada'
    },
    {
      id: 'security',
      type: 'Seguridad Pública',
      icon: '🚨',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      priority: 'Crítica',
      description: 'Situación de riesgo en zona'
    },
    {
      id: 'investigation',
      type: 'Investigación',
      icon: '🔍',
      color: '#3b82f6',
      bgColor: '#dbeafe',
      priority: 'Media',
      description: 'Reconocimiento de área'
    },
    {
      id: 'supervision',
      type: 'Supervisión',
      icon: '👁️',
      color: '#8b5cf6',
      bgColor: '#ede9fe',
      priority: 'Normal',
      description: 'Monitoreo de tráfico'
    },
    {
      id: 'rescue',
      type: 'Rescate',
      icon: '🆘',
      color: '#dc2626',
      bgColor: '#fecaca',
      priority: 'Crítica',
      description: 'Persona en peligro'
    },
    {
      id: 'fire',
      type: 'Incendio',
      icon: '🔥',
      color: '#ea580c',
      bgColor: '#fed7aa',
      priority: 'Alta',
      description: 'Conato de incendio'
    },
    {
      id: 'surveillance',
      type: 'Vigilancia',
      icon: '📹',
      color: '#06b6d4',
      bgColor: '#cffafe',
      priority: 'Media',
      description: 'Patrullaje preventivo'
    },
    {
      id: 'crowd',
      type: 'Control de Multitudes',
      icon: '👥',
      color: '#ec4899',
      bgColor: '#fce7f3',
      priority: 'Alta',
      description: 'Evento masivo en curso'
    }
  ];
  
  // Función para obtener emergencia aleatoria
  export const getRandomEmergency = () => {
    return emergencyTypes[Math.floor(Math.random() * emergencyTypes.length)];
  };
  
  // Función para generar velocidad aleatoria (km/h)
  export const getRandomSpeed = () => {
    return Math.floor(Math.random() * (80 - 45 + 1)) + 45; // Entre 45-80 km/h
  };
  
  // Función para generar altura aleatoria (metros)
  export const getRandomAltitude = () => {
    return Math.floor(Math.random() * (150 - 50 + 1)) + 50; // Entre 50-150 metros
  };