import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for marker icons not loading in Next.js
const icon = L.icon({
  iconUrl: "/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Set default icon for all markers
L.Marker.prototype.options.icon = icon;

// Custom dark mode styles for map and popups
const customMapStyle = `
  .leaflet-container {
    background: #111827;
  }
  .leaflet-popup-content-wrapper {
    background: #1f2937;
    color: #e5e7eb;
    border: 1px solid #374151;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  }
  .leaflet-popup-tip {
    background: #1f2937;
    border: 1px solid #374151;
  }
  .leaflet-popup-close-button {
    color: #9ca3af !important;
  }
  .leaflet-popup-close-button:hover {
    color: #e5e7eb !important;
  }
  .leaflet-control-zoom {
    border: none !important;
    border-radius: 0.5rem !important;
    overflow: hidden;
  }
  .leaflet-control-zoom a {
    background: #1f2937 !important;
    color: #e5e7eb !important;
    border: 1px solid #374151 !important;
  }
  .leaflet-control-zoom a:hover {
    background: #374151 !important;
  }
  .leaflet-control-attribution {
    background: rgba(31, 41, 55, 0.8) !important;
    color: #9ca3af !important;
    backdrop-filter: blur(4px);
  }
  .leaflet-control-attribution a {
    color: #60a5fa !important;
  }
`;

interface LeafletMapProps {
  lat: number;
  lon: number;
  destination?: { lat: number; lon: number } | null;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ lat, lon, destination }) => {
  useEffect(() => {
    // Inject custom styles
    const style = document.createElement('style');
    style.textContent = customMapStyle;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <MapContainer 
        center={[lat, lon]} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
        className="z-10 rounded-xl overflow-hidden"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}>
          <Popup>
            <div className="text-gray-200 font-medium py-1">Current Location</div>
          </Popup>
        </Marker>
        {destination && (
          <Marker position={[destination.lat, destination.lon]}>
            <Popup>
              <div className="text-gray-200 font-medium py-1">Destination</div>
            </Popup>
          </Marker>
        )}
        <SetView lat={lat} lon={lon} zoom={13} />
      </MapContainer>
    </div>
  );
};

const SetView: React.FC<{ lat: number; lon: number; zoom: number }> = ({ lat, lon, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lon], zoom);
  }, [lat, lon, zoom, map]);

  return null;
};

export default LeafletMap;
