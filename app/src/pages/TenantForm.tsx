import React, { useState, useEffect } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonSelect, IonSelectOption,
    useIonToast, IonCard, IonCardContent
} from '@ionic/react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { save } from 'ionicons/icons';
import api from '../services/api';

const TenantForm: React.FC = () => {
    const history = useHistory();
    const { id } = useParams<{ id?: string }>();
    const location = useLocation();
    const isEdit = !!id;
    const [presentToast] = useIonToast();

    // Form states
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState('');
    const [paymentDueDay, setPaymentDueDay] = useState(5);
    const [unitId, setUnitId] = useState<string>('');
    const [units, setUnits] = useState<any[]>([]);

    useEffect(() => {
        fetchUnits();
        if (isEdit) {
            fetchTenantDetails();
        } else {
            const params = new URLSearchParams(location.search);
            const qUnitId = params.get('unit_id');
            if (qUnitId) {
                setUnitId(qUnitId);
            }
        }
    }, [id, location]);

    const fetchUnits = async () => {
        try {
            const res = await api.get('/units');
            setUnits(res.data);
        } catch (error) {
            console.error('Error fetching units', error);
        }
    };

    const fetchTenantDetails = async () => {
        try {
            const res = await api.get(`/tenants/${id}`);
            const data = res.data;
            setFullName(data.full_name || '');
            setPhone(data.phone || '');
            setEmail(data.email || '');
            setStartDate(data.start_date || '');
            setEndDate(data.end_date || '');
            setPaymentDueDay(data.payment_due_day || 5);
            setUnitId(data.unit_id ? data.unit_id.toString() : '');
        } catch (error) {
            console.error('Error fetching tenant details', error);
            presentToast({ message: 'Error al cargar detalles del inquilino', duration: 2000, color: 'danger' });
        }
    };

    const handleSubmit = async () => {
        if (!fullName || !startDate) {
            presentToast({ message: 'El nombre completo y la fecha de inicio son obligatorios', duration: 2000, color: 'danger' });
            return;
        }

        const payload = {
            full_name: fullName,
            phone,
            email,
            start_date: startDate,
            end_date: endDate || null,
            payment_due_day: paymentDueDay,
            unit_id: unitId ? parseInt(unitId) : null,
            is_active: true
        };

        try {
            if (isEdit) {
                await api.put(`/tenants/${id}`, payload);
                presentToast({ message: 'Inquilino actualizado con éxito', duration: 2000, color: 'success' });
            } else {
                await api.post('/tenants', payload);
                presentToast({ message: 'Inquilino registrado con éxito', duration: 2000, color: 'success' });
            }
            history.push('/tenants');
        } catch (error) {
            console.error('Error saving tenant', error);
            presentToast({ message: 'Error al guardar el inquilino', duration: 2000, color: 'danger' });
        }
    };

    // Filter units: only show vacant units, OR if editing, show the tenant's current unit too
    const filteredUnits = units.filter(u => u.status === 'vacant' || (isEdit && u.id.toString() === unitId));

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/tenants" />
                    </IonButtons>
                    <IonTitle>{isEdit ? 'Editar Inquilino' : 'Nuevo Inquilino'}</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonCard>
                    <IonCardContent>
                        <IonList>
                            <IonItem>
                                <IonLabel position="stacked">Nombre Completo del Inquilino</IonLabel>
                                <IonInput 
                                    placeholder="Nombre completo"
                                    value={fullName}
                                    onIonInput={e => setFullName(e.detail.value as string)}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Teléfono</IonLabel>
                                <IonInput 
                                    type="tel"
                                    placeholder="Número telefónico"
                                    value={phone}
                                    onIonInput={e => setPhone(e.detail.value as string)}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Correo Electrónico</IonLabel>
                                <IonInput 
                                    type="email"
                                    placeholder="ejemplo@correo.com"
                                    value={email}
                                    onIonInput={e => setEmail(e.detail.value as string)}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Departamento / Local a Asignar</IonLabel>
                                <IonSelect value={unitId} onIonChange={e => setUnitId(e.detail.value)}>
                                    <IonSelectOption value="">Ninguno (Sin asignar)</IonSelectOption>
                                    {filteredUnits.map(u => (
                                        <IonSelectOption key={u.id} value={u.id.toString()}>
                                            {u.name} ({u.house?.name || 'Casa'}) - ${u.base_rent_cost}/mes
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Día de Pago Vencimiento (1 - 28)</IonLabel>
                                <IonInput 
                                    type="number"
                                    placeholder="5"
                                    min="1"
                                    max="28"
                                    value={paymentDueDay}
                                    onIonInput={e => setPaymentDueDay(Math.min(28, Math.max(1, parseInt(e.detail.value as string) || 5)))}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Fecha de Inicio del Contrato</IonLabel>
                                <IonInput 
                                    type="date"
                                    value={startDate}
                                    onIonInput={e => setStartDate(e.detail.value as string)}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Fecha de Fin (Opcional)</IonLabel>
                                <IonInput 
                                    type="date"
                                    value={endDate}
                                    onIonInput={e => setEndDate(e.detail.value as string)}
                                />
                            </IonItem>
                        </IonList>
                        <div style={{ marginTop: '20px' }}>
                            <IonButton expand="block" onClick={handleSubmit}>
                                <IonIcon icon={save} slot="start" />
                                {isEdit ? 'Actualizar Inquilino' : 'Registrar Inquilino'}
                            </IonButton>
                        </div>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default TenantForm;
