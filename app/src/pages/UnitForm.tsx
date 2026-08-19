import React, { useState, useEffect } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonSelect, IonSelectOption,
    useIonToast, IonCard, IonCardContent
} from '@ionic/react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { save } from 'ionicons/icons';
import api from '../services/api';

const UnitForm: React.FC = () => {
    const history = useHistory();
    const { id } = useParams<{ id?: string }>();
    const location = useLocation();
    const isEdit = !!id;
    const [presentToast] = useIonToast();

    // Form states
    const [name, setName] = useState('');
    const [type, setType] = useState('apartment'); // apartment, commercial, house
    const [baseRentCost, setBaseRentCost] = useState<number>(0);
    const [rooms, setRooms] = useState<number>(0);
    const [bathrooms, setBathrooms] = useState<number>(0);
    const [status, setStatus] = useState('vacant'); // vacant, occupied
    const [houseId, setHouseId] = useState<string>('');
    const [houses, setHouses] = useState<any[]>([]);

    useEffect(() => {
        fetchHouses();
        if (isEdit) {
            fetchUnitDetails();
        } else {
            const params = new URLSearchParams(location.search);
            const qHouseId = params.get('house_id');
            if (qHouseId) {
                setHouseId(qHouseId);
            }
        }
    }, [id, location]);

    const fetchHouses = async () => {
        try {
            const res = await api.get('/houses');
            setHouses(res.data);
        } catch (error) {
            console.error('Error fetching houses', error);
        }
    };

    const fetchUnitDetails = async () => {
        try {
            const res = await api.get(`/units/${id}`);
            const data = res.data;
            setName(data.name || '');
            setType(data.type || 'apartment');
            setBaseRentCost(parseFloat(data.base_rent_cost) || 0);
            setRooms(data.rooms || 0);
            setBathrooms(data.bathrooms || 0);
            setStatus(data.status || 'vacant');
            setHouseId(data.house_id ? data.house_id.toString() : '');
        } catch (error) {
            console.error('Error fetching unit details', error);
            presentToast({ message: 'Error al cargar detalles de la unidad', duration: 2000, color: 'danger' });
        }
    };

    const handleSubmit = async () => {
        if (!name || !houseId || baseRentCost <= 0) {
            presentToast({ 
                message: 'El nombre, la propiedad y la renta base (mayor a 0) son obligatorios', 
                duration: 2000, 
                color: 'danger' 
            });
            return;
        }

        const payload = {
            house_id: parseInt(houseId),
            name,
            type,
            base_rent_cost: baseRentCost,
            rooms,
            bathrooms,
            status
        };

        try {
            if (isEdit) {
                await api.put(`/units/${id}`, payload);
                presentToast({ message: 'Unidad actualizada con éxito', duration: 2000, color: 'success' });
            } else {
                await api.post('/units', payload);
                presentToast({ message: 'Unidad creada con éxito', duration: 2000, color: 'success' });
            }
            // Redirect back to the house details page
            history.push(`/houses/${houseId}`);
        } catch (error) {
            console.error('Error saving unit', error);
            presentToast({ message: 'Error al guardar la unidad', duration: 2000, color: 'danger' });
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref={houseId ? `/houses/${houseId}` : '/houses'} />
                    </IonButtons>
                    <IonTitle>{isEdit ? 'Editar Unidad' : 'Nueva Unidad'}</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonCard>
                    <IonCardContent>
                        <IonList>
                            <IonItem>
                                <IonLabel position="stacked">Propiedad Asignada</IonLabel>
                                <IonSelect 
                                    value={houseId} 
                                    onIonChange={e => setHouseId(e.detail.value)}
                                    placeholder="Selecciona una propiedad"
                                    disabled={isEdit} // Don't allow changing the house when editing
                                >
                                    {houses.map(h => (
                                        <IonSelectOption key={h.id} value={h.id.toString()}>
                                            {h.name}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Nombre de la Unidad / Depto / Local</IonLabel>
                                <IonInput 
                                    placeholder="Ej: Depto 101, Local A"
                                    value={name}
                                    onIonInput={e => setName(e.detail.value as string)}
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Tipo de Unidad</IonLabel>
                                <IonSelect value={type} onIonChange={e => setType(e.detail.value)}>
                                    <IonSelectOption value="apartment">Departamento</IonSelectOption>
                                    <IonSelectOption value="commercial">Local Comercial</IonSelectOption>
                                    <IonSelectOption value="house">Casa Independiente</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Renta Base ($ MXN)</IonLabel>
                                <IonInput 
                                    type="number"
                                    placeholder="0.00"
                                    value={baseRentCost || ''}
                                    onIonInput={e => setBaseRentCost(parseFloat(e.detail.value as string) || 0)}
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Número de Habitaciones</IonLabel>
                                <IonInput 
                                    type="number"
                                    placeholder="0"
                                    value={rooms || ''}
                                    onIonInput={e => setRooms(parseInt(e.detail.value as string) || 0)}
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Número de Baños</IonLabel>
                                <IonInput 
                                    type="number"
                                    placeholder="0"
                                    value={bathrooms || ''}
                                    onIonInput={e => setBathrooms(parseInt(e.detail.value as string) || 0)}
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="stacked">Estado</IonLabel>
                                <IonSelect value={status} onIonChange={e => setStatus(e.detail.value)}>
                                    <IonSelectOption value="vacant">Disponible (Vacío)</IonSelectOption>
                                    <IonSelectOption value="occupied">Ocupado</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                        </IonList>

                        <div style={{ marginTop: '20px' }}>
                            <IonButton expand="block" onClick={handleSubmit}>
                                <IonIcon icon={save} slot="start" />
                                {isEdit ? 'Actualizar Unidad' : 'Registrar Unidad'}
                            </IonButton>
                        </div>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default UnitForm;
