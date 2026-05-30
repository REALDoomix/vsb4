import { IonCard, IonCardContent, IonCardHeader,
         IonCardTitle, IonButton } from '@ionic/react';

// Interface popisuje, jaké props komponenta přijímá
interface MyCardProps {
  calcText: string;
  resetText: string;
}

// Props přijmeme jako parametr a rozbalíme je ({ ... })
function MyCard({ calcText, resetText }: MyCardProps) {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>My Card</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {/* Složené závorky = výraz v JSX – vypíšeme hodnotu proměnné */}
        <IonButton expand="block">{calcText}</IonButton>
        <IonButton expand="block">{resetText}</IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default MyCard;