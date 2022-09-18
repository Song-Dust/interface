import { createRoot } from 'react-dom/client';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import './index.sass';
import Main from './Main';

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false;
}

const container = document.getElementById('root') as HTMLElement;

createRoot(container).render(Main());

if (process.env.REACT_APP_SERVICE_WORKER !== 'false') {
  serviceWorkerRegistration.register();
}
