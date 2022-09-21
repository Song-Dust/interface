import MetaMocks from './utils/metamocks';

export interface EthereumProvider {
  on?: (...args: any[]) => void;
  removeListener?: (...args: any[]) => void;
  autoRefreshOnNetworkChange?: boolean;
}

declare global {
  namespace Cypress {
    interface Chainable {
      registerHandler: MetaMocks['registerHandler'];

      setupMetamocks(): void;
    }

    interface Window {
      ethereum?: EthereumProvider;
    }
  }
}
