import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const RecenterMap = ({ coords }) => {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView(coords, map.getZoom());
    }
  }, [coords, map]);

  return null;
};


const LiveMapPopup = ({ dogwalkerLocation }) => {
  console.log('location of upcoming dogwalker inside liveTracking ', dogwalkerLocation);

  const defaultCenter = [28.6139, 77.2090];
  const center = dogwalkerLocation
    ? [dogwalkerLocation.ltd, dogwalkerLocation.lng]
    : defaultCenter;


  const dogIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.freepik.com/512/5860/5860579.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  return (
    <div className="w-[350px] h-[650px]  mx-auto px-4 py-8">
      <h2 className="block  text-xl font-semibold mb-4 text-gray-600">
                On the Walk
      </h2>
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {/* <Marker position={center} icon={dogIcon} /> */}

        {dogwalkerLocation && (
    <>
      <Marker position={[dogwalkerLocation.ltd, dogwalkerLocation.lng]} icon={dogIcon} />
      <RecenterMap coords={[dogwalkerLocation.ltd, dogwalkerLocation.lng]} />
    </>
  )}
      </MapContainer>
    </div>
  );
};

export default LiveMapPopup;
