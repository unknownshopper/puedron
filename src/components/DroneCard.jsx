import React from 'react';
import { Navigation, Radio, MapPin } from 'lucide-react';

function DroneCard({ drone, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? 'border-purple-500 bg-purple-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-purple-300'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2 flex-1">
          <Navigation className="w-5 h-5 text-purple-600 animate-pulse" />
          <h3 className="font-bold text-sm text-gray-800">{drone.name}</h3>
        </div>
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 whitespace-nowrap">
          {drone.type}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-start">
          <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-purple-500" />
          <span className="font-semibold">{drone.zone}</span>
        </div>
        
        <div className="flex items-center">
          <Radio className="w-4 h-4 mr-2 flex-shrink-0 text-green-500" />
          <span className="text-xs">
            <span className="text-green-600 font-semibold">● En patrullaje</span>
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Posición actual:</span>
          <span className="font-mono text-gray-700">
            {drone.position.lat.toFixed(4)}, {drone.position.lng.toFixed(4)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Velocidad:</span>
          <span className="font-semibold text-blue-600">{drone.speed} km/h</span>
        </div>
      </div>
    </div>
  );
}

export default DroneCard;