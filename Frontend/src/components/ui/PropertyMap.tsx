import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Fix for default marker icon in react-leaflet
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface PropertyMapProps {
  location: string;
  title: string;
  // Default coordinates for demonstration purposes
  // In a real application, you would use geocoding to convert the location string to coordinates
  coordinates?: [number, number];
}

const getCoordinatesForLocation = (location: string): [number, number] => {
  // This is a mock function that would normally call a geocoding service
  // For demonstration purposes, we'll return fixed coordinates based on the location name
  const locationMap: Record<string, [number, number]> = {
    'Downtown': [40.7128, -74.0060], // New York
    'Suburbs': [34.0522, -118.2437], // Los Angeles
    'Midtown': [41.8781, -87.6298], // Chicago
    'Rural': [39.7392, -104.9903] // Denver
  };
  
  return locationMap[location] || [51.505, -0.09]; // Default to London if location not found
};

const PropertyMap: React.FC<PropertyMapProps> = ({ location, title, coordinates }) => {
  const mapCoordinates = coordinates || getCoordinatesForLocation(location);
  
  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border">
      <MapContainer 
        center={mapCoordinates} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={mapCoordinates} icon={defaultIcon}>
          <Popup>
            {title} <br /> {location}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default PropertyMap;