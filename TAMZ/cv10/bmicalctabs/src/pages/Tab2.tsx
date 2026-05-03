import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import HistoryList from '../components/HistoryList';
import './Tab2.css';

interface Tab2Props {
  history: number[];
}

const Tab2: React.FC<Tab2Props> = ({ history }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Historie</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Historie výsledků</IonTitle>
          </IonToolbar>
        </IonHeader>
        <HistoryList history={history} />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
