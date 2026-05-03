import { IonList, IonItem, IonLabel, IonCard, IonCardContent, IonBadge } from '@ionic/react';

interface HistoryListProps {
  history: number[];
}

const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  const getCategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return { name: 'Podvaha', color: 'primary' };
    if (bmiValue < 25) return { name: 'Normální', color: 'success' };
    if (bmiValue < 30) return { name: 'Nadváha', color: 'warning' };
    return { name: 'Obezita', color: 'danger' };
  };

  return (
    <>
      {history.length === 0 ? (
        <IonCard>
          <IonCardContent>
            <p>Žádné výsledky.</p>
          </IonCardContent>
        </IonCard>
      ) : (
        <IonList>
          {history.map((bmi, index) => (
            <IonItem key={index}>
              <IonLabel>
                <h3>Výsledek {index + 1}</h3>
                <p>BMI: {bmi}</p>
              </IonLabel>
              <IonBadge color={getCategory(bmi).color}>{getCategory(bmi).name}</IonBadge>
            </IonItem>
          ))}
        </IonList>
      )}
    </>
  );
};

export default HistoryList;
