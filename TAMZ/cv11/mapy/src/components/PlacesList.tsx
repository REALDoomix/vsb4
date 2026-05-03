import { IonCard, IonCardContent, IonList, IonItem, IonLabel } from '@ionic/react';

interface Place {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface PlacesListProps {
  places: Place[];
}

export default function PlacesList({ places }: PlacesListProps) {
  return (
    <IonCard>
      <IonCardContent>
        <IonList>
          {places.map((place) => (
            <IonItem key={place.id}>
              <IonLabel>{place.name}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
}