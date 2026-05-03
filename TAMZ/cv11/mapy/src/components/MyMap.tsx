import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


export default function MyMap() {
  return (
    <MapContainer center={[49.8209, 18.2625]} zoom={8} style={{ height: '70vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      <Marker position={[49.8209, 18.2625]}>
        <Popup>Ostrava</Popup>
      </Marker>

      <Marker position={[49.9353180, 17.9732977]}>
        <Popup>Něco</Popup>
      </Marker>
    </MapContainer>
  );
}