import React from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useEffect,useState } from 'react';
import { useMap } from 'react-leaflet';

const center = [30.65, 76.85];

const LiveTracking = ({ filterdogwalkers }) => {
  const offset = 0.0001;
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error('Error getting location:', err);
        }
      );
    }
  }, []);

  

  const adjustedMarkers = filterdogwalkers
  .filter((walker) => walker.location && walker.location.ltd && walker.location.lng)
  .map((walker, index, array) => {
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
          center={userLocation || [19.0760, 72.8777]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <RecenterMap coords={userLocation || [19.0760, 72.8777]} />
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



const RecenterMap = ({ coords }) => {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView(coords, map.getZoom());
    }
  }, [coords, map]);

  return null;
};