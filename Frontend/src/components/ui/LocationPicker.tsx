import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationPickerProps {
  onLocationSelect: (location: { x: number; y: number; address: string }) => void;
  initialLocation?: { x: number; y: number };
}

// Fix for Leaflet default icon issue in Next.js
const markerIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

// Component to handle map clicks and marker placement
const LocationMarker = ({ onLocationSelect }: { onLocationSelect: (location: { x: number; y: number;address:string }) => void }) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      onLocationSelect({ x: lat, y: lng, address:"" });
      
      // Reverse geocoding to get address
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          if (data.display_name) {
            onLocationSelect({ x: lat, y: lng, address: data.display_name });
          }
        })
        .catch(error => console.error('Error fetching address:', error));
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={markerIcon} />
  );
};

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState<{ x: number; y: number } | null>(
    initialLocation || null
  );

  // Default center if no location is selected
  const defaultCenter = { lat: 36.8065, lng: 10.1815 }; // Tunis, Tunisia
  const center = selectedLocation 
    ? { lat: selectedLocation.x, lng: selectedLocation.y } 
    : defaultCenter;

  const handleLocationSelect = (location: { x: number; y: number; address?: string }) => {
    setSelectedLocation({ x: location.x, y: location.y });
    onLocationSelect({
      x: location.x,
      y: location.y,
      address: location.address || ''
    });
  };

  return (
    <div className="w-full">
      <div className="border rounded-md overflow-hidden h-[700px]" >
        <MapContainer 
          center={center} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {selectedLocation && (
            <Marker 
              position={{ lat: selectedLocation.x, lng: selectedLocation.y }} 
              icon={markerIcon} 
            />
          )}
          <LocationMarker onLocationSelect={handleLocationSelect} />
        </MapContainer>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Click on the map to select a location
      </p>
    </div>
  );
};

export default LocationPicker;