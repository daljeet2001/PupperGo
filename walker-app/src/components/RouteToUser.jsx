import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import axios from 'axios';

const delhiCoords = [28.6139, 77.2090]; // Walker location

const RouteToUser = ({ userLocation }) => {
  const [routeCoords, setRouteCoords] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [showRoute, setShowRoute] = useState(false);

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
            [delhiCoords[1], delhiCoords[0]], // origin [lng, lat]
            [userLng, userLat],              // destination [lng, lat]
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
    <div className="relative w-full rounded-xl overflow-hidden shadow-md">
      {/* Buttons */}
      <div className="absolute bottom-4 left-4 z-[1000] flex gap-2">
        {!showRoute ? (
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
            <button
              onClick={() => alert("Walk marked as complete")}
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
            >
              Complete Walk
            </button>
          </>
        )}
      </div>

      {/* Map */}
      <MapContainer
        center={delhiCoords}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '450px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Markers */}
        <Marker position={delhiCoords} />
        {userLat && userLng && <Marker position={[userLat, userLng]} />}

        {/* Route line */}
        {showRoute && routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="black" />
        )}
      </MapContainer>

      {/* Step-by-step directions */}
      {showRoute && instructions.length > 0 && (
        <div className="p-4 bg-white rounded shadow mt-4 max-h-52 overflow-y-auto text-sm">
          <h3 className="font-bold mb-2">Directions:</h3>
          <ol className="list-decimal list-inside text-gray-800 space-y-1">
            {instructions.map((step, index) => (
              <li key={index}>{step.instruction}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default RouteToUser;

