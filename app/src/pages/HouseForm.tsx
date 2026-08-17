import React, { useState, useEffect } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonIcon,
    IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonSelect, IonSelectOption, useIonToast
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { add, trash, save } from 'ionicons/icons';
import api from '../services/api';

const HouseForm: React.FC = () => {
    const history = useHistory();
    const { id } = useParams<{ id?: string }>();
    const isEdit = !!id;
    const [presentToast] = useIonToast();

    // House states
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [mapUrl, setMapUrl] = useState('');

    // Units in batch (only for creation)
    const [units, setUnits] = useState<any[]>([
        { name: 'Depto 1', type: 'apartment', base_rent_cost: 4500 }
    ]);

    useEffect(() => {
        if (isEdit) {
            fetchHouseDetails();
        }
    }, [id]);

    const fetchHouseDetails = async () => {
        try {
            const res = await api.get(`/houses/${id}`);
            const data = res.data;
            setName(data.name || '');
            setAddress(data.address || '');
            setDescription(data.description || '');
            setPhotoUrl(data.photo_url || '');
            setMapUrl(data.map_url || '');
        } catch (error) {
            console.error('Error fetching house details', error);
            presentToast({ message: 'Error al cargar detalles de la propiedad', duration: 2000, color: 'danger' });
        }
    };

    const handleAddUnitRow = () => {
        const nextNum = units.length + 1;
        setUnits([...units, { name: `Depto ${nextNum}`, type: 'apartment', base_rent_cost: 4000 }]);
    };

    const handleRemoveUnitRow = (index: number) => {
        setUnits(units.filter((_, i) => i !== index));
    };

    const handleUnitChange = (index: number, field: string, value: any) => {
        const updated = [...units];
        updated[index] = { ...updated[index], [field]: value };
        setUnits(updated);
    };

    const handleSubmit = async () => {
        if (!name || !address) {
            presentToast({ message: 'El nombre y la dirección son obligatorios', duration: 2000, color: 'danger' });
            return;
        }

        const payload: any = {
            name,
            address,
            description,
            photo_url: photoUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80',
            map_url: mapUrl,
        };

        if (!isEdit) {
            payload.units = units;
        }

        try {
            if (isEdit) {
                await api.put(`/houses/${id}`, payload);
                presentToast({ message: 'Propiedad actualizada con éxito', duration: 2000, color: 'success' });
            } else {
                await api.post('/houses', payload);
                presentToast({ message: 'Propiedad y departamentos creados con éxito', duration: 2000, color: 'success' });
            }
            history.push('/houses');
        } catch (error) {
            console.error('Error saving house', error);
            presentToast({ message: 'Error al guardar la propiedad', duration: 2000, color: 'danger' });
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/houses" />
                    </IonButtons>
                    <IonTitle>{isEdit ? 'Editar Propiedad' : 'Nueva Propiedad'}</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Detalles de la Propiedad</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonList>
                            <IonItem>
                                <IonLabel position="stacked">Nombre de la Propiedad</IonLabel>
                                <IonInput 
                                    placeholder="Ej: Casa Centro, Plaza Tec"
                                    value={name}
                                    onIonInput={e => setName(e.detail.value as string)}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Dirección Completa</IonLabel>
                                <IonInput 
                                    placeholder="Calle, Número, Colonia"
                                    value={address}
                                    onIonInput={e => setAddress(e.detail.value as string)}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Descripción</IonLabel>
                                <IonTextarea 
                                    placeholder="Descripción corta, referencias, etc."
                                    value={description}
                                    onIonInput={e => setDescription(e.detail.value as string)}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">URL de Foto (Opcional)</IonLabel>
                                <IonInput 
                                    placeholder="https://ejemplo.com/foto.jpg"
                                    value={photoUrl}
                                    onIonInput={e => setPhotoUrl(e.detail.value as string)}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">URL de Mapa Embed (Opcional)</IonLabel>
                                <IonInput 
                                    placeholder="https://www.google.com/maps/embed?pb=..."
                                    value={mapUrl}
                                    onIonInput={e => setMapUrl(e.detail.value as string)}
                                />
                            </IonItem>
                        </IonList>
                    </IonCardContent>
                </IonCard>

                {!isEdit && (
                    <IonCard>
                        <IonCardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <IonCardTitle>Departamentos / Locales a Crear</IonCardTitle>
                            <IonButton size="small" fill="outline" onClick={handleAddUnitRow}>
                                <IonIcon icon={add} slot="start" /> Agregar
                            </IonButton>
                        </IonCardHeader>
                        <IonCardContent>
                            {units.map((unit, index) => (
                                <div key={index} style={{ borderBottom: '1px dashed #ccc', paddingBottom: '15px', marginBottom: '15px' }}>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol size="12" sizeMd="4">
                                                <IonItem>
                                                    <IonLabel position="stacked">Nombre de Unidad</IonLabel>
                                                    <IonInput 
                                                        placeholder="Ej: Depto 101, Local A"
                                                        value={unit.name}
                                                        onIonInput={e => handleUnitChange(index, 'name', e.detail.value)}
                                                    />
                                                </IonItem>
                                            </IonCol>
                                            <IonCol size="12" sizeMd="3">
                                                <IonItem>
                                                    <IonLabel position="stacked">Tipo</IonLabel>
                                                    <IonSelect value={unit.type} onIonChange={e => handleUnitChange(index, 'type', e.detail.value)}>
                                                        <IonSelectOption value="apartment">Departamento</IonSelectOption>
                                                        <IonSelectOption value="commercial">Local Comercial</IonSelectOption>
                                                        <IonSelectOption value="house">Casa Independiente</IonSelectOption>
                                                    </IonSelect>
                                                </IonItem>
                                            </IonCol>
                                            <IonCol size="12" sizeMd="3">
                                                <IonItem>
                                                    <IonLabel position="stacked">Renta Base ($ MXN)</IonLabel>
                                                    <IonInput 
                                                        type="number"
                                                        placeholder="4500"
                                                        value={unit.base_rent_cost || ''}
                                                        onIonInput={e => handleUnitChange(index, 'base_rent_cost', parseFloat(e.detail.value as string) || 0)}
                                                    />
                                                </IonItem>
                                            </IonCol>
                                            <IonCol size="12" sizeMd="2" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                                {units.length > 1 && (
                                                    <IonButton color="danger" fill="clear" onClick={() => handleRemoveUnitRow(index)}>
                                                        <IonIcon slot="icon-only" icon={trash} />
                                                    </IonButton>
                                                )}
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </div>
                            ))}
                        </IonCardContent>
                    </IonCard>
                )}

                <div style={{ marginTop: '20px', padding: '0 10px' }}>
                    <IonButton expand="block" onClick={handleSubmit}>
                        <IonIcon icon={save} slot="start" />
                        {isEdit ? 'Actualizar Propiedad' : 'Guardar Propiedad y Unidades'}
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default HouseForm;
