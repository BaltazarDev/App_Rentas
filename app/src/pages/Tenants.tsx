import React, { useState, useEffect } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonItemSliding,
    IonItemOptions, IonItemOption, IonIcon, IonAvatar, IonChip, IonSearchbar,
    IonFab, IonFabButton, useIonToast, useIonViewWillEnter, IonAlert, IonButton
} from '@ionic/react';
import { personOutline, add, trash, create, checkmarkCircle, alertCircle, archiveOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import api from '../services/api';

const Tenants: React.FC = () => {
    const history = useHistory();
    const [presentToast] = useIonToast();
    const [segment, setSegment] = useState<'active' | 'archived'>('active');
    const [searchText, setSearchText] = useState('');
    const [tenants, setTenants] = useState<any[]>([]);
    const [pendingPayments, setPendingPayments] = useState<any[]>([]);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<any>(null);

    useIonViewWillEnter(() => {
        loadData();
    });

    useEffect(() => {
        loadData();
    }, [segment]);

    const loadData = async () => {
        try {
            const tenantsRes = await api.get('/tenants', {
                params: { archived: segment === 'archived' ? 'true' : 'false' }
            });
            setTenants(tenantsRes.data);

            if (segment === 'active') {
                const pendingRes = await api.get('/tenants-pending');
                setPendingPayments(pendingRes.data);
            }
        } catch (error) {
            console.error('Error loading tenants data', error);
            presentToast({ message: 'Error al cargar inquilinos', duration: 2000, color: 'danger' });
        }
    };

    const handleDeleteClick = (tenant: any) => {
        setSelectedTenant(tenant);
        setShowDeleteAlert(true);
    };

    const confirmDelete = async () => {
        if (!selectedTenant) return;
        try {
            await api.delete(`/tenants/${selectedTenant.id}`);
            presentToast({ 
                message: 'Inquilino archivado con éxito y departamento liberado', 
                duration: 2000, 
                color: 'success' 
            });
            loadData();
        } catch (error) {
            console.error('Error deleting tenant', error);
            presentToast({ message: 'Error al archivar inquilino', duration: 2000, color: 'danger' });
        }
    };

    const hasPendingPayment = (tenantId: number) => {
        return pendingPayments.some(p => p.tenant_id === tenantId);
    };

    const getPendingDetails = (tenantId: number) => {
        return pendingPayments.find(p => p.tenant_id === tenantId);
    };

    // Filter tenants based on search text
    const filteredTenants = tenants.filter(t => {
        const query = searchText.toLowerCase();
        const nameMatch = t.full_name?.toLowerCase().includes(query);
        const phoneMatch = t.phone?.toLowerCase().includes(query);
        const unitMatch = t.unit?.name?.toLowerCase().includes(query);
        const houseMatch = t.unit?.house?.name?.toLowerCase().includes(query);
        return nameMatch || phoneMatch || unitMatch || houseMatch;
    });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Gestión de Inquilinos</IonTitle>
                </IonToolbar>
                <IonToolbar>
                    <IonSegment value={segment} onIonChange={e => setSegment(e.detail.value as any)}>
                        <IonSegmentButton value="active">
                            <IonLabel>Activos</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="archived">
                            <IonLabel>Archivados</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar 
                        placeholder="Buscar por nombre, depto o propiedad" 
                        value={searchText}
                        onIonInput={e => setSearchText(e.detail.value as string)}
                    />
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonList>
                    {filteredTenants.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '40px', color: '#888' }}>
                            No se encontraron inquilinos.
                        </div>
                    ) : (
                        filteredTenants.map(tenant => {
                            const isPending = hasPendingPayment(tenant.id);
                            return (
                                <IonItemSliding key={tenant.id}>
                                    <IonItem>
                                        <IonAvatar slot="start" style={{ background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <IonIcon icon={personOutline} color="dark" />
                                        </IonAvatar>
                                        <IonLabel>
                                            <h2>{tenant.full_name}</h2>
                                            <p>
                                                {tenant.unit 
                                                    ? `${tenant.unit.name} (${tenant.unit.house?.name || 'Casa'})` 
                                                    : 'Sin unidad asignada'}
                                            </p>
                                            {tenant.phone && <p style={{ fontSize: '0.85em' }}>📞 {tenant.phone}</p>}
                                        </IonLabel>

                                        {segment === 'active' && (
                                            <IonChip color={isPending ? 'warning' : 'success'} slot="end">
                                                <IonIcon icon={isPending ? alertCircle : checkmarkCircle} />
                                                <IonLabel>{isPending ? 'Adeudo' : 'Al Corriente'}</IonLabel>
                                            </IonChip>
                                        )}

                                        {segment === 'archived' && (
                                            <IonChip color="medium" slot="end">
                                                <IonIcon icon={archiveOutline} />
                                                <IonLabel>Archivado</IonLabel>
                                            </IonChip>
                                        )}

                                        {segment === 'active' && (
                                            <div slot="end" style={{ display: 'flex' }}>
                                                <IonButton fill="clear" color="primary" onClick={(e) => { e.stopPropagation(); history.push(`/tenants/edit/${tenant.id}`); }}>
                                                    <IonIcon icon={create} slot="icon-only" />
                                                </IonButton>
                                                <IonButton fill="clear" color="danger" onClick={(e) => { e.stopPropagation(); handleDeleteClick(tenant); }}>
                                                    <IonIcon icon={trash} slot="icon-only" />
                                                </IonButton>
                                            </div>
                                        )}
                                    </IonItem>

                                    {segment === 'active' && (
                                        <IonItemOptions side="end">
                                            <IonItemOption color="primary" onClick={() => history.push(`/tenants/edit/${tenant.id}`)}>
                                                <IonIcon slot="icon-only" icon={create} />
                                            </IonItemOption>
                                            <IonItemOption color="danger" onClick={() => handleDeleteClick(tenant)}>
                                                <IonIcon slot="icon-only" icon={trash} />
                                            </IonItemOption>
                                        </IonItemOptions>
                                    )}
                                </IonItemSliding>
                            );
                        })
                    )}
                </IonList>

                {segment === 'active' && (
                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton onClick={() => history.push('/tenants/new')}>
                            <IonIcon icon={add} />
                        </IonFabButton>
                    </IonFab>
                )}

                <IonAlert 
                    isOpen={showDeleteAlert}
                    onDidDismiss={() => setShowDeleteAlert(false)}
                    header="Confirmar Baja"
                    message={`¿Estás seguro de archivar a ${selectedTenant?.full_name}? Esto liberará de inmediato su departamento asignado.`}
                    buttons={[
                        { text: 'Cancelar', role: 'cancel' },
                        { text: 'Archivar e Inhabilitar', handler: confirmDelete }
                    ]}
                />
            </IonContent>
        </IonPage>
    );
};

export default Tenants;
