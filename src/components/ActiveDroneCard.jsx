import React, { useState, useEffect } from 'react';
import { Navigation, Gauge, Mountain, Clock, AlertTriangle } from 'lucide-react';

function ActiveDroneCard({ drone, isSelected, onClick }) {
  const [timeRemaining, setTimeRemaining] = useState(40);

  useEffect(() => {
    // Countdown de 40 segundos
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          return 40; // Reiniciar
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const progressPercentage = (timeRemaining / 40) * 100;

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
        isSelected
          ? 'border-red-500 bg-red-50 shadow-lg'
          : 'border-red-300 bg-gradient-to-br from-red-50 to-orange-50 hover:border-red-400'
      }`}
      style={{
        animation: 'emergencyCardPulse 2s infinite'
      }}
    >
      {/* Header con icono y tipo de emergencia */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 flex-1">
          <div className="text-2xl animate-bounce">{drone.emergency.icon}</div>
          <div className="flex-1">
            <h3 className="font-bold text-sm text-gray-900 leading-tight">
              {drone.emergency.type}
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              {drone.zone}
            </p>
          </div>
        </div>
        <span 
          className="px-2 py-1 text-xs font-bold rounded-full whitespace-nowrap"
          style={{
            backgroundColor: drone.emergency.bgColor,
            color: drone.emergency.color
          }}
        >
          {drone.emergency.priority}
        </span>
      </div>

      {/* Descripción de emergencia */}
      <div className="mb-3 p-2 bg-white rounded border-l-4" style={{ borderLeftColor: drone.emergency.color }}>
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: drone.emergency.color }} />
          <p className="text-xs text-gray-700 font-medium">
            {drone.emergency.description}
          </p>
        </div>
      </div>

      {/* Información del dron */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs bg-white p-2 rounded">
          <div className="flex items-center space-x-1">
            <Gauge className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-gray-600">Velocidad:</span>
          </div>
          <span className="font-bold text-blue-600">{drone.speed} km/h</span>
        </div>

        <div className="flex items-center justify-between text-xs bg-white p-2 rounded">
          <div className="flex items-center space-x-1">
            <Mountain className="w-3.5 h-3.5 text-green-600" />
            <span className="text-gray-600">Altura:</span>
          </div>
          <span className="font-bold text-green-600">{drone.altitude} m</span>
        </div>

        <div className="flex items-center justify-between text-xs bg-white p-2 rounded">
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-orange-600" />
            <span className="text-gray-600">Tiempo en zona:</span>
          </div>
          <span className="font-bold text-orange-600">{timeRemaining}s</span>
        </div>
      </div>

      {/* Barra de progreso de tiempo */}
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full transition-all duration-1000 ease-linear rounded-full"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: drone.emergency.color
            }}
          />
        </div>
      </div>

      {/* Estado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Navigation className="w-4 h-4 text-red-600 animate-pulse" />
          <span className="text-xs font-semibold text-red-600">EN RUTA</span>
        </div>
        <span className="text-xs text-gray-500 font-mono">
          ID: {drone.id.split('-')[1].toUpperCase()}
        </span>
      </div>
    </div>
  );
}

export default ActiveDroneCard;