import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { gridOutline, homeOutline, peopleOutline } from 'ionicons/icons';

// Context
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Houses from './pages/Houses';
import HouseDetail from './pages/HouseDetail';
import UnitDetail from './pages/UnitDetail';
import Tenants from './pages/Tenants';
import TenantForm from './pages/TenantForm';
import HouseForm from './pages/HouseForm';
import PaymentHistory from './pages/PaymentHistory';
import UnitForm from './pages/UnitForm';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Ionic Dark Mode Theme */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            {/* Public Login Route */}
            <Route exact path="/login" component={Login} />

            {/* Protected Routes */}
            <ProtectedRoute exact path="/dashboard" component={Dashboard} />
            <ProtectedRoute exact path="/houses" component={Houses} />
            <ProtectedRoute exact path="/houses/new" component={HouseForm} />
            <ProtectedRoute exact path="/houses/edit/:id([0-9]+)" component={HouseForm} />
            <ProtectedRoute exact path="/houses/:id([0-9]+)" component={HouseDetail} />
            <ProtectedRoute exact path="/tenants" component={Tenants} />
            <ProtectedRoute exact path="/tenants/new" component={TenantForm} />
            <ProtectedRoute exact path="/tenants/edit/:id([0-9]+)" component={TenantForm} />
            <ProtectedRoute exact path="/payments/history" component={PaymentHistory} />
            <ProtectedRoute exact path="/units/new" component={UnitForm} />
            <ProtectedRoute exact path="/units/edit/:id([0-9]+)" component={UnitForm} />
            <ProtectedRoute exact path="/units/:id([0-9]+)" component={UnitDetail} />
            
            {/* Root redirect */}
            <Route exact path="/" component={() => <Redirect to="/dashboard" />} />
          </IonRouterOutlet>
          
          {/* Render TabBar only when we are not on the login page */}
          <Route
            path="/"
            render={({ location }) =>
              location.pathname !== '/login' ? (
                <IonTabBar slot="bottom">
                  <IonTabButton tab="dashboard" href="/dashboard">
                    <IonIcon aria-hidden="true" icon={gridOutline} />
                    <IonLabel>Dashboard</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="houses" href="/houses">
                    <IonIcon aria-hidden="true" icon={homeOutline} />
                    <IonLabel>Propiedades</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="tenants" href="/tenants">
                    <IonIcon aria-hidden="true" icon={peopleOutline} />
                    <IonLabel>Inquilinos</IonLabel>
                  </IonTabButton>
                </IonTabBar>
              ) : null
            }
          />
        </IonTabs>
      </IonReactRouter>
    </AuthProvider>
  </IonApp>
);

export default App;
