import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import MyCard from '../components/MyCard';
import BMIresult from '../components/BMIresult';
import './Tab1.css';

interface Tab1Props {
  onAddHistory: (bmi: number) => void;
}

const Tab1: React.FC<Tab1Props> = ({ onAddHistory }) => {
  const [result, setResult] = useState(0);

  const handleResult = (bmi: number) => {
    setResult(bmi);
    onAddHistory(bmi);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Kalkulačka BMI</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <MyCard calcText='Vypočti' resetText='Vynuluj' onResult={handleResult}/>
        {result > 0 && <BMIresult bmi={result} />}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
