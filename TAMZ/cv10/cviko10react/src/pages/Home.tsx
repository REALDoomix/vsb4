// src/pages/Home.tsx

import { useState } from 'react';
import { IonContent, IonHeader, IonPage,
         IonTitle, IonToolbar } from '@ionic/react';
import MyCard from '../components/MyCard';

function Home() {

  // Stav žije tady – Home rozhoduje, co s výsledkem udělá
  const [result, setResult] = useState(0);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

        {/* onResult dostane setResult – MyCard ho zavolá s vypočtenou hodnotou */}
        <MyCard
          calcText="Calculate"
          resetText="Reset"
          onResult={setResult}
        />

        {/* Výsledek zobrazujeme zde v rodiči */}
        <p>Result: {result}</p>

      </IonContent>
    </IonPage>
  );
};

export default Home;