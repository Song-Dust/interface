import UserUpdater from 'state/user/updater';
import ApplicationUpdater from 'state/application/updater';
import TransactionUpdater from 'state/transactions/updater';
import { MulticallUpdater } from 'lib/state/multicall';
import React, { StrictMode } from 'react';
import { Provider } from 'react-redux';
import store from 'state';
import { BrowserRouter } from 'react-router-dom';
import Web3Provider from 'components/Web3Provider';
import { BlockNumberProvider } from 'lib/hooks/useBlockNumber';
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
              <App />
            </BlockNumberProvider>
          </Web3Provider>
        </BrowserRouter>
      </Provider>
    </StrictMode>
  );
}
