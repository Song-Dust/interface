import './index.sass';

import { createRoot } from 'react-dom/client';

import Main from './Main';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false;
}

const container = document.getElementById('root') as HTMLElement;

createRoot(container).render(Main());

if (process.env.REACT_APP_SERVICE_WORKER !== 'false') {
  serviceWorkerRegistration.register();
}
