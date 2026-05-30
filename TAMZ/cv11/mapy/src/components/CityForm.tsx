import { 
  IonCard, 
  IonCardContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonCheckbox,
  IonSearchbar,
  IonSpinner,
  IonText,
  IonButton
} from '@ionic/react';
import { useState } from 'react';

interface Place {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface NominatimResult {
  place_id: number;
  name: string;
  lat: string;
  lon: string;
  display_name: string;
}

interface CityFormProps {
  pickedPlaces: Place[];
  onPlaceToggle: (place: Place) => void;
}

export default function CityForm({ pickedPlaces, onPlaceToggle }: CityFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');

    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5`,
        {
          headers: {
            'User-Agent': 'MyMapApp/1.0 (contact@example.com)'
          }
        }
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError('Failed to search places');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlace = (result: NominatimResult) => {
    const newPlace: Place = {
      id: result.place_id,
      name: result.name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon)
    };
    onPlaceToggle(newPlace);
  };

  return (
    <IonCard>
      <IonCardContent>
        <IonText>
          <h3>Search for Cities</h3>
        </IonText>
        <IonSearchbar 
          value={searchQuery}
          onIonInput={(e) => setSearchQuery(e.detail.value || '')}
          placeholder="Search for places..."
        />
        <IonButton 
          expand="block"
          onClick={handleSearch}
          disabled={searchQuery.length < 2 || loading}
        >
          Search
        </IonButton>

        {error && <IonText color="danger">{error}</IonText>}

        {loading && <IonSpinner />}

        {searchResults.length > 0 && (
          <IonCard>
            <IonCardContent>
              <IonText>
                <h3>Search Results</h3>
              </IonText>
              <IonList>
                {searchResults.map((result) => (
                  <IonItem key={result.place_id}>
                    <IonLabel>
                      <p>{result.name}</p>
                      <p style={{ fontSize: '0.8em', color: '#999' }}>
                        {result.display_name.split(',').slice(0, 2).join(',')}
                      </p>
                    </IonLabel>
                    <IonCheckbox 
                      slot="start"
                      checked={pickedPlaces.some(p => p.id === result.place_id)}
                      onIonChange={() => handleAddPlace(result)}
                    />
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>
        )}
      </IonCardContent>
    </IonCard>
  );
}