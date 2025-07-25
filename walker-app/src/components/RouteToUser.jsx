import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import axios from 'axios';
import { useMap } from 'react-leaflet';

const delhiCoords = [28.6139, 77.2090];

const RecenterMap = ({ coords }) => {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView(coords, map.getZoom());
    }
  }, [coords, map]);

  return null;
};

 
const RouteToUser = ({ userLocation,startJourney }) => {
  const [routeCoords, setRouteCoords] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [showRoute, setShowRoute] = useState(false);
  const [origin, setOrigin] = useState();
  console.log( 'origin inside map',origin)

  const dogIcon = new L.Icon({
      iconUrl: 'https://cdn-icons-png.freepik.com/512/5860/5860579.png',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOrigin([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Error getting current location:", error);
      }
    );
  }, []);

  const userLat = userLocation?.lat ?? userLocation?.ltd;
  const userLng = userLocation?.lng;

  const fetchRoute = async () => {
    console.log("Start Journey clicked");

    if (!userLat || !userLng) {
      console.warn("Invalid user location:", userLat, userLng);
      return;
    }

    try {
      const response = await axios.post(
        'https://api.openrouteservice.org/v2/directions/foot-walking/geojson',
        {
          coordinates: [
           [origin[1], origin[0]], 
           [userLng, userLat],            
          ],
        },
        {
          headers: {
            Authorization: import.meta.env.VITE_OPENROUTESERVICE_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      const geometry = response.data.features[0].geometry.coordinates;
      const coords = geometry.map(([lng, lat]) => [lat, lng]);

      const segment = response.data.features[0].properties.segments[0];
      const steps = segment.steps || [];

      setRouteCoords(coords);
      setInstructions(steps);
      setShowRoute(true);
    } catch (error) {
      console.error('Route fetch error:', error);
    }
  };

return (
  <div className="relative w-full mx-auto px-4 pt-8">
    <h2 className="block  text-xl font-semibold mb-4 text-gray-600">
                En Route
    </h2>
    {startJourney && <div className="absolute left-12 bottom-5 md:left-6 z-[1000] flex gap-2">
      {!showRoute  ? (
        <button
          onClick={fetchRoute}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Start Journey
        </button>
      ) : (
        <>
          <button
            onClick={() => {
              setShowRoute(false);
              setInstructions([]);
              setRouteCoords([]);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
          >
            Cancel
          </button>
          {/* <button
            onClick={() => alert("Walk marked as complete")}
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
          >
            Complete Walk
          </button> */}
        </>
      )}
    </div>}
    <div className="w-[350px] h-[600px] mx-auto my-4   overflow-hidden">
    
    <MapContainer
      center={delhiCoords}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {origin && <Marker position={origin} icon={dogIcon} />}
      {userLat && userLng && <Marker position={[userLat, userLng]} icon={dogIcon}/>}

      {showRoute && routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="black" />
      )}

       {origin && (
       
          <RecenterMap coords={origin} />
       
        )}
    </MapContainer>
    </div>

    {/* {showRoute && instructions.length > 0 && (
      <div className="absolute top-4 right-4 max-w-xs bg-white rounded shadow p-4 max-h-80 overflow-y-auto text-sm z-[1000]">
        <h3 className="font-bold mb-2">Directions:</h3>
        <ol className="list-decimal list-inside text-gray-800 space-y-1">
          {instructions.map((step, index) => (
            <li key={index}>{step.instruction}</li>
          ))}
        </ol>
      </div>
    )} */}
  </div>
);

};

export default RouteToUser;

