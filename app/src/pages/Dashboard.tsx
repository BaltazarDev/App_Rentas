import React, { useState } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonList, IonItem,
    IonLabel, IonButton, IonIcon, IonNote, useIonViewWillEnter, IonButtons
} from '@ionic/react';
import { 
    cashOutline, trendingUpOutline, trendingDownOutline, 
    alertCircleOutline, addOutline, documentTextOutline 
} from 'ionicons/icons';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import api from '../services/api';
import DashboardCarousel from '../components/DashboardCarousel';
import TransactionModal from '../components/TransactionModal';
import { useHistory } from 'react-router-dom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard: React.FC = () => {
    const history = useHistory();
    const [stats, setStats] = useState<any>(null);
    const [pending, setPending] = useState<any[]>([]);
    
    // Modal states
    const [isTxModalOpen, setIsTxModalOpen] = useState(false);
    const [defaultTxType, setDefaultTxType] = useState<'payment' | 'expense'>('payment');
    const [selectedUnitId, setSelectedUnitId] = useState<string>('');

    useIonViewWillEnter(() => {
        loadDashboardData();
    });

    const loadDashboardData = async () => {
        try {
            const statsRes = await api.get('/stats');
            setStats(statsRes.data);

            const pendingRes = await api.get('/tenants-pending');
            setPending(pendingRes.data);
        } catch (error) {
            console.error('Error loading dashboard data', error);
        }
    };

    const handleOpenPayment = (unitId?: string) => {
        setDefaultTxType('payment');
        setSelectedUnitId(unitId || '');
        setIsTxModalOpen(true);
    };

    const handleOpenExpense = () => {
        setDefaultTxType('expense');
        setSelectedUnitId('');
        setIsTxModalOpen(true);
    };

    const formatMXN = (amount: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    };

    if (!stats) {
        return (
            <IonPage>
                <IonContent className="ion-padding" style={{ textAlign: 'center', marginTop: '50px' }}>
                    Cargando estadísticas...
                </IonContent>
            </IonPage>
        );
    }

    const chartData = {
        labels: stats.charts.labels,
        datasets: [
            {
                label: 'Ingresos (Cobros)',
                data: stats.charts.income,
                backgroundColor: '#2ecc71',
                borderRadius: 5,
            },
            {
                label: 'Gastos',
                data: stats.charts.expenses,
                backgroundColor: '#e74c3c',
                borderRadius: 5,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            }
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Dashboard</IonTitle>
                    <IonButtons slot="end">
                        <IonButton color="primary" onClick={() => history.push('/payments/history')}>
                            <IonIcon icon={documentTextOutline} slot="start" />
                            Historial
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">
                <DashboardCarousel />

                {/* KPI Overview Cards */}
                <IonGrid>
                    <IonRow>
                        <IonCol size="6" sizeMd="3">
                            <IonCard style={{ margin: '5px' }}>
                                <IonCardContent style={{ textAlign: 'center' }}>
                                    <IonIcon icon={cashOutline} style={{ fontSize: '2em', color: '#3880ff' }} />
                                    <h2>Propiedades</h2>
                                    <h1 style={{ fontWeight: 'bold', margin: '5px 0' }}>{stats.summary.total_houses}</h1>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol size="6" sizeMd="3">
                            <IonCard style={{ margin: '5px' }}>
                                <IonCardContent style={{ textAlign: 'center' }}>
                                    <IonIcon icon={cashOutline} style={{ fontSize: '2em', color: '#2dd36f' }} />
                                    <h2>Tasa Ocupación</h2>
                                    <h1 style={{ fontWeight: 'bold', margin: '5px 0' }}>{stats.summary.occupancy_rate}%</h1>
                                    <p style={{ fontSize: '0.85em', color: '#666' }}>{stats.summary.occupied_units} de {stats.summary.total_units} deptos</p>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol size="6" sizeMd="3">
                            <IonCard style={{ margin: '5px' }}>
                                <IonCardContent style={{ textAlign: 'center' }}>
                                    <IonIcon icon={trendingUpOutline} style={{ fontSize: '2em', color: '#2dd36f' }} />
                                    <h2>Ingresos Mes</h2>
                                    <h1 style={{ fontWeight: 'bold', margin: '5px 0', fontSize: '1.2em' }}>{formatMXN(stats.summary.current_month_income)}</h1>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol size="6" sizeMd="3">
                            <IonCard style={{ margin: '5px' }}>
                                <IonCardContent style={{ textAlign: 'center' }}>
                                    <IonIcon icon={trendingDownOutline} style={{ fontSize: '2em', color: '#eb445a' }} />
                                    <h2>Gastos Mes</h2>
                                    <h1 style={{ fontWeight: 'bold', margin: '5px 0', fontSize: '1.2em' }}>{formatMXN(stats.summary.current_month_expense)}</h1>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                {/* Quick Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', padding: '0 10px', marginBottom: '15px' }}>
                    <IonButton expand="block" fill="outline" style={{ flex: 1 }} onClick={() => handleOpenPayment()}>
                        <IonIcon icon={addOutline} slot="start" /> Registrar Cobro
                    </IonButton>
                    <IonButton expand="block" fill="outline" color="danger" style={{ flex: 1 }} onClick={handleOpenExpense}>
                        <IonIcon icon={addOutline} slot="start" /> Registrar Gasto
                    </IonButton>
                </div>

                {/* Chart Section */}
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Balance de Finanzas (Últimos 6 meses)</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent style={{ height: '300px' }}>
                        <Bar data={chartData} options={chartOptions} />
                    </IonCardContent>
                </IonCard>

                {/* Pending Payments Section */}
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IonIcon icon={alertCircleOutline} color="warning" />
                            Rentas Pendientes
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        {pending.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#666', padding: '10px 0' }}>
                                🎉 ¡Al corriente! No hay adeudos de renta pendientes este mes.
                            </p>
                        ) : (
                            <IonList lines="none">
                                {pending.map((p, idx) => (
                                    <IonItem key={idx} style={{ borderBottom: '1px solid #f0f0f0', padding: '5px 0' }}>
                                        <IonLabel style={{ whiteSpace: 'normal' }}>
                                            <h3 style={{ fontWeight: 'bold' }}>{p.tenant_name}</h3>
                                            <p>{p.unit_name} ({p.house_name})</p>
                                            <p style={{ fontSize: '0.85em', color: p.is_overdue ? '#eb445a' : '#f5a623' }}>
                                                Vence: {p.due_date} {p.days_late > 0 && `(${p.days_late} días de atraso)`}
                                            </p>
                                        </IonLabel>
                                        <div slot="end" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                                            <IonNote color="dark" style={{ fontWeight: 'bold' }}>
                                                {formatMXN(p.amount)}
                                            </IonNote>
                                            <IonButton size="small" color="success" fill="solid" onClick={() => handleOpenPayment(p.unit_id.toString())}>
                                                Cobrar
                                            </IonButton>
                                        </div>
                                    </IonItem>
                                ))}
                            </IonList>
                        )}
                    </IonCardContent>
                </IonCard>

                {/* Transaction Modal */}
                <TransactionModal 
                    isOpen={isTxModalOpen}
                    onClose={() => setIsTxModalOpen(false)}
                    onSave={loadDashboardData}
                    defaultType={defaultTxType}
                    defaultUnitId={selectedUnitId}
                />
            </IonContent>
        </IonPage>
    );
};

export default Dashboard;
