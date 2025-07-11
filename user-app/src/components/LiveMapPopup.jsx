import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LiveMapPopup = ({ dogwalkerLocation }) => {
  console.log('location of upcoming dogwalker inside liveTracking ', dogwalkerLocation);

  if (!dogwalkerLocation) return <div>No location available</div>;

  const center = [dogwalkerLocation.ltd, dogwalkerLocation.lng];

  const dogIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.freepik.com/512/5860/5860579.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  return (
    <div className="w-full h-full shadow-lg overflow-hidden rounded-xl">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <Marker position={center} icon={dogIcon} />
      </MapContainer>
    </div>
  );
};

export default LiveMapPopup;
