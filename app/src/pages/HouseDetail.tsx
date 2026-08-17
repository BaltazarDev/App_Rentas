import React, { useState } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonItemSliding,
    IonItemOptions, IonItemOption, IonIcon, IonAvatar, IonChip, IonButton,
    useIonViewWillEnter
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { cashOutline, mapOutline, homeOutline, add, create } from 'ionicons/icons';
import api from '../services/api';
import TransactionModal from '../components/TransactionModal';
import './HouseDetail.css';

const HouseDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [house, setHouse] = useState<any>(null);
    const [segment, setSegment] = useState('units');
    const [isTxModalOpen, setIsTxModalOpen] = useState(false);

    useIonViewWillEnter(() => {
        fetchHouseDetails();
    });

    const fetchHouseDetails = async () => {
        try {
            const res = await api.get(`/houses/${id}`);
            setHouse(res.data);
        } catch (error) {
            console.error('Error fetching house details', error);
        }
    };

    // Format currency to MXN
    const formatMXN = (amount: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    };

    if (!house) {
        return <IonPage><IonContent className="ion-padding" style={{ textAlign: 'center' }}>Cargando...</IonContent></IonPage>;
    }

    return (
        <IonPage>
            <IonHeader translucent={true}>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/houses" />
                    </IonButtons>
                    <IonTitle>{house.name}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => history.push(`/houses/edit/${id}`)}>
                            <IonIcon slot="icon-only" icon={create} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <div className="house-header-image">
                    <img src={house.photo_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80'} alt={house.name} />
                    <div className="house-header-overlay">
                        <h1>{house.name}</h1>
                        <p>{house.address}</p>
                    </div>
                </div>

                <div className="segment-container">
                    <IonSegment value={segment} onIonChange={e => setSegment(e.detail.value as string)}>
                        <IonSegmentButton value="units">
                            <IonLabel>Unidades</IonLabel>
                            <IonIcon icon={homeOutline} />
                        </IonSegmentButton>
                        <IonSegmentButton value="expenses">
                            <IonLabel>Gastos</IonLabel>
                            <IonIcon icon={cashOutline} />
                        </IonSegmentButton>
                        <IonSegmentButton value="map">
                            <IonLabel>Mapa</IonLabel>
                            <IonIcon icon={mapOutline} />
                        </IonSegmentButton>
                    </IonSegment>
                </div>

                {segment === 'units' && (
                    <IonList className="units-list">
                        {house.units && house.units.map((unit: any) => (
                            <IonItemSliding key={unit.id}>
                                <IonItem routerLink={`/units/${unit.id}`} detail={true}>
                                    <IonAvatar slot="start" className={`unit-avatar ${unit.status}`}>
                                        <IonIcon icon={unit.type === 'commercial' ? cashOutline : homeOutline} />
                                    </IonAvatar>
                                    <IonLabel style={{ whiteSpace: 'normal' }}>
                                        <h2>{unit.name}</h2>
                                        <p>{unit.status === 'occupied' && unit.tenant ? `Inquilino: ${unit.tenant.full_name}` : 'Disponible'}</p>
                                        <p style={{ fontSize: '0.85em', color: '#666' }}>Renta: {formatMXN(unit.base_rent_cost)}</p>
                                    </IonLabel>
                                    <IonChip color={unit.status === 'occupied' ? 'success' : 'medium'}>
                                        {unit.status === 'occupied' ? 'Ocupado' : 'Vacío'}
                                    </IonChip>
                                </IonItem>
                            </IonItemSliding>
                        ))}
                    </IonList>
                )}

                {segment === 'expenses' && (
                    <div className="expenses-container">
                        <IonList>
                            {house.expenses && house.expenses.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>No hay gastos registrados en esta propiedad.</p>
                            ) : (
                                house.expenses && house.expenses.map((expense: any) => (
                                    <IonItem key={expense.id}>
                                        <IonLabel>
                                            <h2>{expense.type}</h2>
                                            <p>📅 {expense.expense_date}</p>
                                            {expense.notes && <p style={{ fontSize: '0.8em', color: '#666' }}>📝 {expense.notes}</p>}
                                        </IonLabel>
                                        <div slot="end" className="expense-amount" style={{ color: '#eb445a', fontWeight: 'bold' }}>
                                            -{formatMXN(expense.amount)}
                                        </div>
                                    </IonItem>
                                ))
                            )}
                        </IonList>
                        <div style={{ padding: '15px' }}>
                            <IonButton expand="block" fill="outline" className="add-expense-btn" onClick={() => setIsTxModalOpen(true)}>
                                <IonIcon slot="start" icon={add} />
                                Registrar Gasto General
                            </IonButton>
                        </div>
                    </div>
                )}

                {segment === 'map' && house.map_url && (
                    <div className="map-container">
                        <iframe
                            src={house.map_url}
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            loading="lazy"
                            title="Mapa de la propiedad"
                        ></iframe>
                    </div>
                )}

                <TransactionModal 
                    isOpen={isTxModalOpen}
                    onClose={() => setIsTxModalOpen(false)}
                    onSave={fetchHouseDetails}
                    defaultType="expense"
                    defaultHouseId={id}
                />
            </IonContent>
        </IonPage>
    );
};

export default HouseDetail;
