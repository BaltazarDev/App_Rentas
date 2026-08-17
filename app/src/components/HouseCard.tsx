import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonIcon, IonLabel } from '@ionic/react';
import { locationOutline, homeOutline } from 'ionicons/icons';
import './HouseCard.css';

interface HouseCardProps {
    house: any;
}

const HouseCard: React.FC<HouseCardProps> = ({ house }) => {
    return (
        <IonCard className="house-card" routerLink={`/houses/${house.id}`}>
            <div className="house-image-container">
                <img src={house.photo_url || "https://ionicframework.com/docs/img/demos/card-media.png"} alt={house.name} />
                <div className="house-overlay">
                    <IonChip color="primary" className="status-chip">
                        <IonLabel>{house.units_count || 0} Deptos</IonLabel>
                    </IonChip>
                </div>
            </div>
            <IonCardHeader>
                <IonCardSubtitle className="house-location">
                    <IonIcon icon={locationOutline} /> {house.address}
                </IonCardSubtitle>
                <IonCardTitle className="house-title">{house.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <p>{house.description || "Sin descripción"}</p>
            </IonCardContent>
        </IonCard>
    );
};

export default HouseCard;
