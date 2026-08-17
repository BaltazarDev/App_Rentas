import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { gridOutline, homeOutline, peopleOutline } from 'ionicons/icons';

import Dashboard from './pages/Dashboard';
import Houses from './pages/Houses';
import HouseDetail from './pages/HouseDetail';
import UnitDetail from './pages/UnitDetail';
import Tenants from './pages/Tenants';
import TenantForm from './pages/TenantForm';
import HouseForm from './pages/HouseForm';
import PaymentHistory from './pages/PaymentHistory';

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

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/dashboard">
            <Dashboard />
          </Route>
          <Route exact path="/houses">
            <Houses />
          </Route>
          <Route exact path="/houses/new">
            <HouseForm />
          </Route>
          <Route exact path="/houses/edit/:id(\\d+)">
            <HouseForm />
          </Route>
          <Route exact path="/houses/:id(\\d+)">
            <HouseDetail />
          </Route>
          <Route exact path="/tenants">
            <Tenants />
          </Route>
          <Route exact path="/tenants/new">
            <TenantForm />
          </Route>
          <Route exact path="/tenants/edit/:id(\\d+)">
            <TenantForm />
          </Route>
          <Route exact path="/payments/history">
            <PaymentHistory />
          </Route>
          <Route exact path="/units/:id(\\d+)">
            <UnitDetail />
          </Route>
          <Route exact path="/">
            <Redirect to="/dashboard" />
          </Route>
        </IonRouterOutlet>
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
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
