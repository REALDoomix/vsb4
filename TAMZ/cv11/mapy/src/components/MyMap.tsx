import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MyMap.css'
import { LatLng} from 'leaflet';
import { useEffect } from 'react';
import PlacesList from './PlacesList';

const places = [
  {id: 1, name: 'Ostrava', lat:49.8209, lng: 18.2625},
  {id: 2, name: 'Něco', lat:49.9353180, lng:17.9732977}
];


function MapResizer(){
  const map = useMap();

  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);

  return null;
}


export default function MyMap() {
  return (
  <>
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
    <PlacesList places={places} />

    </>
  );
}