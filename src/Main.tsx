import Popups from 'components/popups';
import WalletModal from 'components/WalletModal';
import Web3Provider from 'components/Web3Provider';
import { BlockNumberProvider } from 'lib/hooks/useBlockNumber';
import { MulticallUpdater } from 'lib/state/multicall';
import React, { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from 'state';
import ApplicationUpdater from 'state/application/updater';
import TransactionUpdater from 'state/transactions/updater';
import UserUpdater from 'state/user/updater';

import App from './App';

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

export default function Main() {
  return (
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <Web3Provider>
            <BlockNumberProvider>
              <Updaters />
              <Popups />
              <WalletModal />
              <App />
            </BlockNumberProvider>
          </Web3Provider>
        </BrowserRouter>
      </Provider>
    </StrictMode>
  );
}
