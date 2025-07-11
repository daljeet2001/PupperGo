import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const centerDefault = { lat: 28.6139, lng: 77.2090 }; // Delhi

const RouteToUser = ({ userLocation, onCompleteWalk, onCancelWalk }) => {
  const [directions, setDirections] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  console.log('client location in routetouser:', userLocation);


  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
    libraries: ['places'],
  });

  useEffect(() => {
    if (!isLoaded || !userLocation?.lat || !userLocation?.lng) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const origin = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCurrentLocation(origin);

        const destination = {
          lat: userLocation.lat,
          lng: userLocation.lng,
        };

        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
          {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.WALKING,
          },
          (result, status) => {
            if (status === 'OK') {
              setDirections(result);
            } else {
              console.error('Directions request failed:', status);
            }
          }
        );
      },
      (error) => {
        console.error('Geolocation error:', error);
      }
    );
  }, [isLoaded, userLocation]);

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="relative w-full h-[450px] rounded-xl overflow-hidden shadow-md">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation || centerDefault}
        zoom={14}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {/* Overlay UI */}
      {/* <div className="absolute bottom-4 left-4 right-4 flex justify-between gap-2 bg-white/80 p-3 rounded-md shadow-md">
        <div>
          <p className="text-sm font-semibold">Walking to: {user?.name || 'User'}</p>
          <p className="text-xs text-gray-600">
            Location: {user?.lat}, {user?.lng}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancelWalk}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded"
          >
            Cancel
          </button>
          <button
            onClick={onCompleteWalk}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded"
          >
            Complete
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default RouteToUser;
