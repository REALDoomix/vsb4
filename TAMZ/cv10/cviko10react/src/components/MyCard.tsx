// src/components/MyCard.tsx

import { IonCard, IonCardContent, IonButton } from '@ionic/react';

interface MyCardProps {
  calcText: string;
  resetText: string;
  onResult: (value: number) => void; // Callback prop – funkce kam pošleme číslo
}

function MyCard({ calcText, resetText, onResult }: MyCardProps) {

  // Lze zapsat i jako arrow function: const handleCalc = () => {
  function handleCalc() {
    const newResult = Math.round(Math.random() * 40 + 10);
    onResult(newResult); // Pošleme výsledek rodiči
  }

  // Lze zapsat i jako arrow function: const handleReset = () => {
  function handleReset() {
    onResult(0);
  }

  return (
    <IonCard>
      <IonCardContent>
        <IonButton expand="block" onClick={handleCalc}>{calcText}</IonButton>
        <IonButton expand="block" onClick={handleReset}>{resetText}</IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default MyCard;