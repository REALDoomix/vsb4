import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import { useState } from 'react';
import './Home.css';
import MyMap from '../components/MyMap';
import PlacesList from '../components/PlacesList';
import CityForm from '../components/CityForm';

interface Place {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

const Home: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<string>('search');
  const [pickedPlaces, setPickedPlaces] = useState<Place[]>([]);

  const handlePlaceToggle = (place: Place) => {
    setPickedPlaces(prev => {
      const isAlreadyPicked = prev.some(p => p.id === place.id);
      
      if (isAlreadyPicked) {
        return prev.filter(p => p.id !== place.id);
      } else {
        return [...prev, place];
      }
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Map App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Map App</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonSegment value={selectedSegment} onIonChange={e => setSelectedSegment(e.detail.value as string)}>
          <IonSegmentButton value="search">
            <IonLabel>Search</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="map">
            <IonLabel>Map</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {selectedSegment === 'search' && (
          <>
          <CityForm 
            pickedPlaces={pickedPlaces}
            onPlaceToggle={handlePlaceToggle}
          />
          <PlacesList 
            pickedPlaces={pickedPlaces}
            onPlaceToggle={handlePlaceToggle}
          />
          </>
        )}

        {selectedSegment === 'map' && (
          <>
          <MyMap places={pickedPlaces} />
          <PlacesList 
            pickedPlaces={pickedPlaces}
            onPlaceToggle={handlePlaceToggle}
          />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;