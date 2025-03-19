import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for marker icons not loading
const DefaultIcon = L.icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41], // Default size
  iconAnchor: [12, 41], // Anchor point
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LeafletMapProps {
  lat: number;
  lon: number;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ lat, lon }) => {
  return (
    <MapContainer style={{ height: "100%", width: "100%" }}>
      <SetView lat={lat} lon={lon} zoom={13} />
          <TileLayer
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lon]}>
        <Popup>
          Current Location: {lat}, {lon}
        </Popup>
      </Marker>
    </MapContainer>
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
