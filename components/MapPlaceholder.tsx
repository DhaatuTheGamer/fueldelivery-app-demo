
import React from 'react';
import { MapPin } from 'lucide-react';

interface MapPlaceholderProps {
  centerMessage?: string;
  height?: string;
  showPin?: boolean;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ centerMessage, height = 'h-64', showPin = true }) => {
  return (
    <div className={`relative bg-gray-300 ${height} w-full flex items-center justify-center rounded-lg overflow-hidden`}>
      {showPin && <MapPin size={48} className="text-red-500 z-10" />}
      {centerMessage && <p className="absolute text-center text-gray-600 font-medium p-4 bg-white/70 rounded shadow">{centerMessage}</p>}
      <div className="absolute inset-0 border-4 border-dashed border-gray-400 rounded-lg"></div>
      <p className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/50 px-1 rounded">Map Placeholder</p>
    </div>
  );
};

export default MapPlaceholder;
