import React, { useState, useEffect } from 'react';
import {
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonList, IonItem, IonLabel, IonInput, IonSelect,
    IonSelectOption, IonTextarea, useIonToast
} from '@ionic/react';
import api from '../services/api';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    defaultType?: 'payment' | 'expense';
    defaultHouseId?: string;
    defaultUnitId?: string;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
    isOpen, onClose, onSave, defaultType = 'payment', defaultHouseId, defaultUnitId
}) => {
    const [txType, setTxType] = useState<'payment' | 'expense'>(defaultType);
    const [houses, setHouses] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);
    const [presentToast] = useIonToast();

    // Form states
    const [houseId, setHouseId] = useState<string>(defaultHouseId || '');
    const [unitId, setUnitId] = useState<string>(defaultUnitId || '');
    const [amount, setAmount] = useState<number>(0);
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState<string>('');
    const [paymentType, setPaymentType] = useState<string>('rent'); // rent, utility
    const [expenseType, setExpenseType] = useState<string>(''); // Luz, Agua, Pintura, etc.

    useEffect(() => {
        if (isOpen) {
            fetchHousesAndUnits();
            // Reset states
            setTxType(defaultType);
            setHouseId(defaultHouseId || '');
            setUnitId(defaultUnitId || '');
            setAmount(0);
            setDate(new Date().toISOString().split('T')[0]);
            setNotes('');
            setPaymentType('rent');
            setExpenseType('');
        }
    }, [isOpen, defaultType, defaultHouseId, defaultUnitId]);

    const fetchHousesAndUnits = async () => {
        try {
            const housesRes = await api.get('/houses');
            setHouses(housesRes.data);
            const unitsRes = await api.get('/units');
            setUnits(unitsRes.data);
        } catch (error) {
            console.error('Error fetching details', error);
        }
    };

    const handleSave = async () => {
        if (amount <= 0) {
            presentToast({ message: 'El monto debe ser mayor a 0', duration: 2000, color: 'danger' });
            return;
        }

        try {
            if (txType === 'payment') {
                if (!unitId) {
                    presentToast({ message: 'Selecciona una unidad', duration: 2000, color: 'danger' });
                    return;
                }
                await api.post('/payments', {
                    unit_id: unitId,
                    amount,
                    payment_date: date,
                    type: paymentType,
                    status: 'paid',
                    notes
                });
                presentToast({ message: 'Pago registrado con éxito', duration: 2000, color: 'success' });
            } else {
                await api.post('/expenses', {
                    house_id: houseId || null,
                    unit_id: unitId || null,
                    type: expenseType || 'Gasto General',
                    amount,
                    expense_date: date,
                    paid_by_owner: true,
                    notes
                });
                presentToast({ message: 'Gasto registrado con éxito', duration: 2000, color: 'success' });
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving transaction', error);
            presentToast({ message: 'Error al registrar', duration: 2000, color: 'danger' });
        }
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{txType === 'payment' ? 'Registrar Pago' : 'Registrar Gasto'}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose}>Cancelar</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList>
                    <IonItem>
                        <IonLabel position="stacked">Tipo de Transacción</IonLabel>
                        <IonSelect value={txType} onIonChange={e => setTxType(e.detail.value)}>
                            <IonSelectOption value="payment">Ingreso (Pago de Inquilino)</IonSelectOption>
                            <IonSelectOption value="expense">Egreso (Gasto/Costo)</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    {txType === 'expense' && (
                        <IonItem>
                            <IonLabel position="stacked">Propiedad (Opcional)</IonLabel>
                            <IonSelect value={houseId} onIonChange={e => setHouseId(e.detail.value)}>
                                <IonSelectOption value="">Ninguna (Gasto General)</IonSelectOption>
                                {houses.map(h => (
                                    <IonSelectOption key={h.id} value={h.id}>{h.name}</IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                    )}

                    <IonItem>
                        <IonLabel position="stacked">Unidad/Departamento {txType === 'payment' ? '' : '(Opcional)'}</IonLabel>
                        <IonSelect value={unitId} onIonChange={e => setUnitId(e.detail.value)}>
                            <IonSelectOption value="">Ninguna</IonSelectOption>
                            {units
                                .filter(u => !houseId || u.house_id === parseInt(houseId))
                                .map(u => (
                                    <IonSelectOption key={u.id} value={u.id}>{u.name} ({u.house?.name || 'Casa'})</IonSelectOption>
                                ))}
                        </IonSelect>
                    </IonItem>

                    {txType === 'payment' ? (
                        <IonItem>
                            <IonLabel position="stacked">Concepto de Pago</IonLabel>
                            <IonSelect value={paymentType} onIonChange={e => setPaymentType(e.detail.value)}>
                                <IonSelectOption value="rent">Renta Mensual</IonSelectOption>
                                <IonSelectOption value="utility">Servicios (Luz, Agua, etc.)</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    ) : (
                        <IonItem>
                            <IonLabel position="stacked">Concepto del Gasto</IonLabel>
                            <IonInput 
                                placeholder="Ej: Pintura, Reparación de fuga, Luz General"
                                value={expenseType}
                                onIonInput={e => setExpenseType(e.detail.value as string)}
                            />
                        </IonItem>
                    )}

                    <IonItem>
                        <IonLabel position="stacked">Monto ($ MXN)</IonLabel>
                        <IonInput 
                            type="number"
                            placeholder="0.00"
                            value={amount || ''}
                            onIonInput={e => setAmount(parseFloat(e.detail.value as string) || 0)}
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">Fecha</IonLabel>
                        <IonInput 
                            type="date"
                            value={date}
                            onIonInput={e => setDate(e.detail.value as string)}
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">Notas/Detalles</IonLabel>
                        <IonTextarea 
                            placeholder="Detalles opcionales..."
                            value={notes}
                            onIonInput={e => setNotes(e.detail.value as string)}
                        />
                    </IonItem>
                </IonList>
                <div style={{ marginTop: '20px' }}>
                    <IonButton expand="block" onClick={handleSave}>Guardar Transacción</IonButton>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default TransactionModal;
