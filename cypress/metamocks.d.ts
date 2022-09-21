import { AbiHandler } from 'metamocks';

export interface EthereumProvider {
  on?: (...args: any[]) => void;
  removeListener?: (...args: any[]) => void;
  autoRefreshOnNetworkChange?: boolean;
}

declare global {
  namespace Cypress {
    interface Chainable {
      setupMetamocks(): void;

      setAbiHandler(address: string, handler: AbiHandler): void;
    }

    interface Window {
      ethereum?: EthereumProvider;
    }
  }
}
