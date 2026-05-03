// src/components/BMIresult.tsx

import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonBadge } from '@ionic/react';
import './BMIresult.css';

interface BMIresultProps {
  bmi: number;
}

function BMIresult({ bmi }: BMIresultProps) {
  const getCategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return { name: 'Podvaha', color: 'primary' };
    if (bmiValue < 25) return { name: 'Normální', color: 'success' };
    if (bmiValue < 30) return { name: 'Nadváha', color: 'warning' };
    return { name: 'Obezita', color: 'danger' };
  };

  const category = getCategory(bmi);

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Výsledek BMI</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="bmi-result-content">
        <div className="bmi-value">{bmi}</div>
        <IonBadge color={category.color}>{category.name}</IonBadge>
      </IonCardContent>
    </IonCard>
  );
}

export default BMIresult;
