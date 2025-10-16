import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';

function LocationCard({ location, isSelected, onClick }) {
  const typeColors = {
    'Oficina Central': 'bg-blue-100 text-blue-800',
    'Caseta': 'bg-green-100 text-green-800',
    'Módulo': 'bg-red-100 text-red-800'
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-blue-300'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-lg text-gray-800 flex-1">{location.name}</h3>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${typeColors[location.type] || 'bg-gray-100 text-gray-800'}`}>
          {location.type}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-start">
          <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>{location.address}</span>
        </div>
        
        <div className="flex items-center">
          <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{location.phone}</span>
        </div>
        
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{location.hours}</span>
        </div>
      </div>
    </div>
  );
}

export default LocationCard;