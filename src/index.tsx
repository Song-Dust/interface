import './index.sass';
import '@rainbow-me/rainbowkit/styles.css';

import { darkTheme, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { mainnet } from '@wagmi/core';
import { chains } from 'constants/chains';
import * as process from 'process';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

import App from './App';
import reportWebVitals from './reportWebVitals';

if (!process.env.REACT_APP_WALLETCONNECT_PROJECT_ID) {
  throw new Error('REACT_APP_WALLETCONNECT_PROJECT_ID not provided');
}

if (!process.env.REACT_APP_INFURA_API_KEY) {
  throw new Error('REACT_APP_INFURA_API_KEY not provided');
}

const { publicClient } = configureChains(
  [...chains, mainnet],
  [infuraProvider({ apiKey: process.env.REACT_APP_INFURA_API_KEY }), publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: 'AttentionStreams',
  projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider theme={darkTheme()} chains={chains}>
          <App />
        </RainbowKitProvider>
      </WagmiConfig>
    </BrowserRouter>
  </React.StrictMode>,
);

reportWebVitals();
