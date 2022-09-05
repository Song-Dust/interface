import { JsonRpcProvider } from '@ethersproject/providers';
import { FALLBACK_CHAIN_ID, NETWORK_URLS } from '../../src/constants/chains';
import { Wallet } from '@ethersproject/wallet';
import { MetaMocks, METAMOCKS_TEST_PRIVATE_KEY } from '../utils/metamocks';

Cypress.Commands.add('setupMetamocks', () => {
  const provider = new JsonRpcProvider(NETWORK_URLS[FALLBACK_CHAIN_ID], FALLBACK_CHAIN_ID);
  const signer = new Wallet(METAMOCKS_TEST_PRIVATE_KEY, provider);
  const metamocks = new MetaMocks(signer, provider);
  cy.wrap(metamocks).as('metamocks');
  cy.on('window:before:load', (win) => {
    win.ethereum = metamocks;
  });
});

Cypress.Commands.add('setAbiHandler', (address, abiHandler) => {
  cy.get('@metamocks').then((metamocks: any) => {
    metamocks.setHandler(address, abiHandler);
  });
});
