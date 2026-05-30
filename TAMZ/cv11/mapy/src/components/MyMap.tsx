import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MyMap.css'
import { useEffect } from 'react';

interface Place {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface MyMapProps {
  places: Place[];
}

function MapResizer(){
  const map = useMap();

  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);

  return null;
}

export default function MyMap({ places }: MyMapProps) {
  return (
    <MapContainer center={[49.8209, 18.2625]} zoom={8}>
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapResizer />

      {places.map((place) => (
        <Marker key={place.id} position={[place.lat, place.lng]}>
          <Popup>{place.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}