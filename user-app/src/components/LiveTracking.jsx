import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 30.65,
  lng: 76.85,
};

const LiveTracking = ({ filterdogwalkers }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API, // 🔑 Using environment variable
  });

  if (!isLoaded) return <div>Loading map...</div>;

  // Adjust markers with nearly the same coordinates
  const adjustedMarkers = filterdogwalkers.map((walker, index, array) => {
    const offset = 0.0001; // Minor offset for overlapping markers
    let adjustedLocation = { ...walker.location };

    // Check for nearby markers and adjust position
    for (let i = 0; i < index; i++) {
      const prevWalker = array[i];
      if (
        Math.abs(prevWalker.location.ltd - walker.location.ltd) < offset &&
        Math.abs(prevWalker.location.lng - walker.location.lng) < offset
      ) {
        adjustedLocation = {
          ltd: walker.location.ltd + offset * (index % 2 === 0 ? 1 : -1),
          lng: walker.location.lng + offset * (index % 2 === 0 ? -1 : 1),
        };
        break;
      }
    }

    return { ...walker, location: adjustedLocation };
  });

  return (
    <div className="w-full h-full  shadow-lg overflow-hidden">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {adjustedMarkers.map((walker, index) => (
          <Marker
            key={index}
            position={{
              lat: walker.location.ltd,
              lng: walker.location.lng,
            }}
            // label={{
            //   text: walker.name,
            //   color: "white",
            // }}
            icon={{
              url: "https://cdn-icons-png.freepik.com/512/5860/5860579.png", // Marker icon
              scaledSize: new window.google.maps.Size(30, 30), // Adjust size as needed
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default LiveTracking;