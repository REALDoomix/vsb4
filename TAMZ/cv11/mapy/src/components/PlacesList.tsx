import { 
  IonCard, 
  IonCardContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonCheckbox,
  IonText,
  IonContent
} from '@ionic/react';

interface Place {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface PlacesListProps {
  pickedPlaces: Place[];
  onPlaceToggle: (place: Place) => void;
}

export default function PlacesList({ pickedPlaces, onPlaceToggle }: PlacesListProps) {
  return (
    <IonContent>
      {pickedPlaces.length > 0 ? (
        <div style={{ padding: '10px' }}>
          <IonText>
            <h3>Selected Places ({pickedPlaces.length})</h3>
          </IonText>
          {pickedPlaces.map((place) => (
            <IonCard key={place.id}>
              <IonCardContent>
                <IonList>
                  <IonItem>
                    <IonCheckbox 
                      checked={true}
                      onIonChange={() => onPlaceToggle(place)}
                    />
                    <IonLabel>
                      <p>{place.name}</p>
                      <p style={{ fontSize: '0.8em', color: '#999' }}>
                        Lat: {place.lat}, Lng: {place.lng}
                      </p>
                    </IonLabel>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      ) : (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <IonText>
            <p>No places selected yet. Search for places in the first tab!</p>
          </IonText>
        </div>
      )}
    </IonContent>
  );
}