import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import MetaMocks from 'metamocks';

import { FALLBACK_CHAIN_ID } from '../../src/constants/chains';
import { RPC_URLS } from '../../src/constants/networks';
import { TEST_PRIVATE_KEY } from '../utils/data';

Cypress.Commands.add('setupMetamocks', () => {
  const provider = new JsonRpcProvider(RPC_URLS[FALLBACK_CHAIN_ID], FALLBACK_CHAIN_ID);
  const signer = new Wallet(TEST_PRIVATE_KEY, provider);
  const metamocks = new MetaMocks(signer, FALLBACK_CHAIN_ID);
  cy.wrap(metamocks).as('metamocks');
  cy.on('window:before:load', (win) => {
    win.ethereum = metamocks;
  });
});

Cypress.Commands.add('registerAbiHandler', (...args) => {
  cy.get('@metamocks').then((val: any) => {
    const metamocks = val as MetaMocks;
    metamocks.registerAbiHandler(...args);
  });
});
