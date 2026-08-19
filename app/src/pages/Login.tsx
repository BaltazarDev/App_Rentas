import React, { useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    IonContent,
    IonPage,
    IonIcon,
    IonText,
    IonSpinner
} from '@ionic/react';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import './Login.css';

const Login: React.FC = () => {
    const { login, isAuthenticated } = useAuth();
    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (isAuthenticated) {
        return <Redirect to="/dashboard" />;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Por favor, ingresa tu correo y contraseña.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await login(email, password);
            history.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.response && err.response.data && err.response.data.errors) {
                const firstErrKey = Object.keys(err.response.data.errors)[0];
                setError(err.response.data.errors[firstErrKey][0]);
            } else {
                setError('Correo o contraseña incorrectos.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <IonPage>
            <IonContent className="login-content" scrollY={false}>
                {/* Background decorative glowing circles */}
                <div className="login-bg-glow-1"></div>
                <div className="login-bg-glow-2"></div>

                <div className="login-container">
                    <form onSubmit={handleLogin} className="login-glass-card">
                        <div className="login-header">
                            <div className="login-logo-container">
                                <span className="login-logo-icon">🔑</span>
                            </div>
                            <h1 className="login-title">Control de Rentas</h1>
                            <p className="login-subtitle">Ingresa tus credenciales para acceder</p>
                        </div>

                        {error && (
                            <div className="login-error-alert">
                                <IonText color="danger">
                                    <p>{error}</p>
                                </IonText>
                            </div>
                        )}

                        <div className="login-form-group">
                            <div className="login-input-wrapper">
                                <IonIcon icon={mailOutline} className="login-input-icon" />
                                <input
                                    type="email"
                                    placeholder="Correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="login-custom-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="login-form-group">
                            <div className="login-input-wrapper">
                                <IonIcon icon={lockClosedOutline} className="login-input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="login-custom-input"
                                    required
                                />
                                <button
                                    type="button"
                                    className="login-toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="login-submit-btn"
                        >
                            {loading ? (
                                <IonSpinner name="crescent" color="light" />
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>

                        <div className="login-footer">
                            <p>© 2026 BaltazarDev. Todos los derechos reservados.</p>
                        </div>
                    </form>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;
