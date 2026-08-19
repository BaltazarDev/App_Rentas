import React, { useState } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
    IonList, IonItem, IonLabel, IonNote, IonBadge, IonButton, IonIcon, IonFab, IonFabButton,
    useIonViewWillEnter
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { person, add, cash, call, mail, time, checkmarkCircle, alertCircle, create } from 'ionicons/icons';
import api from '../services/api';
import TransactionModal from '../components/TransactionModal';
import './UnitDetail.css';

const UnitDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [unit, setUnit] = useState<any>(null);
    const [isTxModalOpen, setIsTxModalOpen] = useState(false);

    useIonViewWillEnter(() => {
        fetchUnitDetails();
    });

    const fetchUnitDetails = async () => {
        try {
            const res = await api.get(`/units/${id}`);
            setUnit(res.data);
        } catch (error) {
            console.error('Error fetching unit details', error);
        }
    };

    const formatMXN = (amount: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    };

    if (!unit) {
        return <IonPage><IonContent className="ion-padding" style={{ textAlign: 'center' }}>Cargando...</IonContent></IonPage>;
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref={`/houses/${unit.house_id || ''}`} />
                    </IonButtons>
                    <IonTitle>{unit.name}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => history.push(`/units/edit/${id}`)}>
                            <IonIcon slot="icon-only" icon={create} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <div className="unit-summary">
                    <IonCard className="status-card">
                        <IonCardHeader>
                            <IonCardSubtitle>Renta Mensual Base</IonCardSubtitle>
                            <IonCardTitle className="price-tag">{formatMXN(unit.base_rent_cost || unit.rent_cost || 0)}</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent className="status-content">
                            <IonBadge color={unit.status === 'occupied' ? 'success' : 'medium'}>
                                {unit.status === 'occupied' ? 'OCUPADO' : 'DISPONIBLE'}
                            </IonBadge>
                        </IonCardContent>
                    </IonCard>
                </div>

                {unit.status === 'occupied' && unit.tenant && (
                    <IonCard className="tenant-card">
                        <IonCardHeader>
                            <IonCardSubtitle>Inquilino</IonCardSubtitle>
                            <IonCardTitle>{unit.tenant.full_name}</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            {unit.tenant.phone && (
                                <IonItem lines="none" href={`tel:${unit.tenant.phone}`}>
                                    <IonIcon slot="start" icon={call} color="primary" />
                                    <IonLabel>{unit.tenant.phone}</IonLabel>
                                </IonItem>
                            )}
                            {unit.tenant.email && (
                                <IonItem lines="none" href={`mailto:${unit.tenant.email}`}>
                                    <IonIcon slot="start" icon={mail} color="primary" />
                                    <IonLabel>{unit.tenant.email}</IonLabel>
                                </IonItem>
                            )}
                            <IonItem lines="none">
                                <IonIcon slot="start" icon={time} color="medium" />
                                <IonLabel>Desde: {unit.tenant.start_date}</IonLabel>
                            </IonItem>
                            <IonItem lines="none">
                                <IonIcon slot="start" icon={time} color="medium" />
                                <IonLabel>Día de Pago: Vence el día {unit.tenant.payment_due_day || 5} de cada mes</IonLabel>
                            </IonItem>
                        </IonCardContent>
                    </IonCard>
                )}

                {unit.status === 'vacant' && (
                    <div className="empty-state">
                        <IonIcon icon={person} className="empty-icon" style={{ fontSize: '3em', color: '#888', margin: '20px auto', display: 'block' }} />
                        <p style={{ textAlign: 'center', color: '#666' }}>Este departamento está vacío.</p>
                        <div style={{ padding: '15px' }}>
                            <IonButton expand="block" shape="round" onClick={() => history.push(`/tenants/new?unit_id=${id}`)}>
                                <IonIcon slot="start" icon={add} />
                                Asignar Inquilino
                            </IonButton>
                        </div>
                    </div>
                )}

                <div className="payments-section" style={{ padding: '15px' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2em' }}>Historial de Pagos</h3>
                    <IonList>
                        {unit.payments && unit.payments.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#888', marginTop: '10px' }}>No hay registros de pago para esta unidad.</p>
                        ) : (
                            unit.payments && unit.payments.map((payment: any) => (
                                <IonItem key={payment.id} className={`payment-item ${payment.status}`}>
                                    <IonIcon slot="start" icon={payment.status === 'paid' ? checkmarkCircle : alertCircle} color={payment.status === 'paid' ? 'success' : 'warning'} />
                                    <IonLabel style={{ whiteSpace: 'normal' }}>
                                        <h2>{payment.type === 'rent' ? 'Renta' : 'Servicios'}</h2>
                                        <p>{payment.status === 'paid' ? `Pagado el ${payment.payment_date || payment.date}` : 'Pendiente'}</p>
                                        {payment.notes && <p style={{ fontSize: '0.8em', color: '#666', marginTop: '3px' }}>📝 {payment.notes}</p>}
                                    </IonLabel>
                                    <IonNote slot="end" color="dark" style={{ fontWeight: 'bold' }}>{formatMXN(payment.amount)}</IonNote>
                                </IonItem>
                            ))
                        )}
                    </IonList>
                </div>

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton color="secondary" onClick={() => setIsTxModalOpen(true)}>
                        <IonIcon icon={cash} />
                    </IonFabButton>
                </IonFab>

                <TransactionModal 
                    isOpen={isTxModalOpen}
                    onClose={() => setIsTxModalOpen(false)}
                    onSave={fetchUnitDetails}
                    defaultType="payment"
                    defaultUnitId={id}
                />
            </IonContent>
        </IonPage>
    );
};

export default UnitDetail;
