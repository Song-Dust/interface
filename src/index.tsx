import React, { StrictMode } from 'react';
import { BlockNumberProvider } from 'lib/hooks/useBlockNumber';
import { MulticallUpdater } from 'lib/state/multicall';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import Web3Provider from './components/Web3Provider';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import store from './state';
import ApplicationUpdater from './state/application/updater';
import TransactionUpdater from './state/transactions/updater';
import UserUpdater from './state/user/updater';

import './index.sass';

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false;
}

function Updaters() {
  return (
    <>
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  );
}

const container = document.getElementById('root') as HTMLElement;

createRoot(container).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Web3Provider>
          <BlockNumberProvider>
            <Updaters />
            <App />
          </BlockNumberProvider>
        </Web3Provider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);

if (process.env.REACT_APP_SERVICE_WORKER !== 'false') {
  serviceWorkerRegistration.register();
}
