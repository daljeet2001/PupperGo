import React from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';

const center = [30.65, 76.85];

const LiveTracking = ({ filterdogwalkers }) => {
  const offset = 0.0001;

  const adjustedMarkers = filterdogwalkers.map((walker, index, array) => {
    let adjustedLat = walker.location.ltd;
    let adjustedLng = walker.location.lng;

    for (let i = 0; i < index; i++) {
      const prev = array[i].location;
      if (
        Math.abs(prev.ltd - walker.location.ltd) < offset &&
        Math.abs(prev.lng - walker.location.lng) < offset
      ) {
        adjustedLat += offset * (index % 2 === 0 ? 1 : -1);
        adjustedLng += offset * (index % 2 === 0 ? -1 : 1);
        break;
      }
    }

    return {
      ...walker,
      adjustedLat,
      adjustedLng,
    };
  });

  const dogIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.freepik.com/512/5860/5860579.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  return (
    <div className="w-full md:max-w-7xl mx-auto px-4 pt-8">
      <h2 className="block  text-xl font-semibold mb-4 text-gray-600">
       Where they’ll be
      </h2>


      <div className=" h-[600px] w-full">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {adjustedMarkers.map((walker, index) => (
            <Marker
              key={index}
              position={[walker.adjustedLat, walker.adjustedLng]}
              icon={dogIcon}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                {walker.username}
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default LiveTracking;
