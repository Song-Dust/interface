import { AbiHandler } from 'metamocks/abiHandler';

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
  }
}
