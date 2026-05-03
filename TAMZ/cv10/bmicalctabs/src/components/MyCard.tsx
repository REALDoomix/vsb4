// src/components/MyCard.tsx

import { IonCard, IonCardContent, IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';
import { useState } from 'react';

interface MyCardProps {
  calcText: string;
  resetText: string;
  onResult: (value: number) => void;
}

function MyCard({ calcText, resetText, onResult }: MyCardProps) {
  const [weight, setWeight] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  const handleChange = (setter: (v: number | null) => void, value: string | number | null | undefined) => {
    setter(value ? parseFloat(value as string) : null);
  };

  const handleCalc = () => {
    if (weight && height && weight > 0 && height > 0) {
      const bmi = Math.round((weight / Math.pow(height / 100, 2)) * 10) / 10;
      onResult(bmi);
    } else {
      alert('Zadej prosím váhu a výšku!');
    }
  };

  const handleReset = () => {
    setWeight(null);
    setHeight(null);
    onResult(0);
  };

  return (
    <IonCard>
      <IonCardContent>
        <IonItem>
          <IonLabel position="stacked">Váha (kg)</IonLabel>
          <IonInput type="number" placeholder="Zadej váhu" value={weight || ''} onIonChange={(e) => handleChange(setWeight, e.detail.value)} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Výška (cm)</IonLabel>
          <IonInput type="number" placeholder="Zadej výšku" value={height || ''} onIonChange={(e) => handleChange(setHeight, e.detail.value)} />
        </IonItem>
        <IonButton expand="block" onClick={handleCalc}>{calcText}</IonButton>
        <IonButton expand="block" onClick={handleReset}>{resetText}</IonButton>
      </IonCardContent>
    </IonCard>
  );
}

export default MyCard;
