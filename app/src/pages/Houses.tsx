import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonFab, IonFabButton, IonIcon, useIonViewWillEnter } from '@ionic/react';
import { add } from 'ionicons/icons';
import api from '../services/api';
import HouseCard from '../components/HouseCard';

const Houses: React.FC = () => {
    const [houses, setHouses] = useState<any[]>([]);

    useIonViewWillEnter(() => {
        fetchHouses();
    });

    const fetchHouses = async () => {
        try {
            const response = await api.get('/houses');
            setHouses(response.data);
        } catch (error) {
            console.error('Error fetching houses', error);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Propiedades</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Propiedades</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonGrid>
                    <IonRow>
                        {houses.map(house => (
                            <IonCol size="12" sizeMd="6" sizeLg="4" key={house.id}>
                                <HouseCard house={house} />
                            </IonCol>
                        ))}
                    </IonRow>
                </IonGrid>

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton routerLink="/houses/new">
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default Houses;
