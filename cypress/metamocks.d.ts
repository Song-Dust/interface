import { AbiHandler } from 'metamocks';

export interface EthereumProvider {
  on?: (...args: any[]) => void;
  removeListener?: (...args: any[]) => void;
  autoRefreshOnNetworkChange?: boolean;
}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      setupMetamocks(): void;

      setAbiHandler(address: string, handler: AbiHandler): void;
    }

    interface Window {
      ethereum?: EthereumProvider;
    }
  }
}
