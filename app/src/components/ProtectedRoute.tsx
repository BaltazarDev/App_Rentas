import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IonPage, IonContent, IonSpinner } from '@ionic/react';

interface ProtectedRouteProps {
    component: React.ComponentType<any>;
    path: string;
    exact?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <IonPage>
                <IonContent className="ion-padding" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%' }}>
                        <IonSpinner name="crescent" color="primary" style={{ transform: 'scale(1.5)' }} />
                        <p style={{ marginTop: '15px', color: 'var(--ion-color-medium)', fontSize: '1.1rem', fontWeight: '500' }}>Cargando sesión...</p>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default ProtectedRoute;
