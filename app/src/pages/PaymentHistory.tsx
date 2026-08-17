import React, { useState, useEffect } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonNote, IonIcon, IonSelect, IonSelectOption,
    IonButton, useIonViewWillEnter
} from '@ionic/react';
import { checkmarkCircle, businessOutline } from 'ionicons/icons';
import api from '../services/api';
import TransactionModal from '../components/TransactionModal';

const PaymentHistory: React.FC = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [houses, setHouses] = useState<any[]>([]);
    const [selectedHouse, setSelectedHouse] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useIonViewWillEnter(() => {
        loadData();
    });

    useEffect(() => {
        loadData();
    }, [selectedHouse]);

    const loadData = async () => {
        try {
            const housesRes = await api.get('/houses');
            setHouses(housesRes.data);

            const paymentsRes = await api.get('/payments');
            setPayments(paymentsRes.data);
        } catch (error) {
            console.error('Error loading payments', error);
        }
    };

    // Format currency to MXN
    const formatMXN = (amount: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    };

    // Filter payments based on house selection
    const filteredPayments = payments.filter(p => {
        if (!selectedHouse) return true;
        return p.unit?.house_id === parseInt(selectedHouse);
    });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/dashboard" />
                    </IonButtons>
                    <IonTitle>Historial de Pagos</IonTitle>
                    <IonButtons slot="end">
                        <IonButton color="primary" onClick={() => setIsModalOpen(true)}>
                            Registrar Cobro
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
                <IonToolbar>
                    <IonItem lines="none">
                        <IonIcon icon={businessOutline} slot="start" />
                        <IonLabel>Filtrar Propiedad</IonLabel>
                        <IonSelect value={selectedHouse} onIonChange={e => setSelectedHouse(e.detail.value)}>
                            <IonSelectOption value="">Todas</IonSelectOption>
                            {houses.map(h => (
                                <IonSelectOption key={h.id} value={h.id}>{h.name}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonList>
                    {filteredPayments.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '40px', color: '#888' }}>
                            No se han registrado pagos aún.
                        </div>
                    ) : (
                        filteredPayments.map(payment => (
                            <IonItem key={payment.id}>
                                <IonIcon slot="start" icon={checkmarkCircle} color="success" />
                                <IonLabel style={{ whiteSpace: 'normal' }}>
                                    <h2>{payment.unit?.tenant?.full_name || 'Inquilino'}</h2>
                                    <p>
                                        {payment.unit?.name} ({payment.unit?.house?.name || 'Propiedad'})
                                    </p>
                                    <p style={{ fontSize: '0.85em' }}>
                                        📅 {payment.payment_date} | Concepto: {payment.type === 'rent' ? 'Renta' : 'Servicios'}
                                    </p>
                                    {payment.notes && <p style={{ fontSize: '0.8em', color: '#666', marginTop: '3px' }}>📝 {payment.notes}</p>}
                                </IonLabel>
                                <IonNote slot="end" color="dark" style={{ fontWeight: 'bold' }}>
                                    {formatMXN(payment.amount)}
                                </IonNote>
                            </IonItem>
                        ))
                    )}
                </IonList>

                <TransactionModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={loadData}
                    defaultType="payment"
                />
            </IonContent>
        </IonPage>
    );
};

export default PaymentHistory;
