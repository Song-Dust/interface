import { Connector } from '@web3-react/types';
import { ConnectionType, gnosisSafeConnection, injectedConnection, networkConnection } from 'connection';

export function getIsInjected(): boolean {
  return Boolean(window.ethereum);
}

export function getIsMetaMask(): boolean {
  return window.ethereum?.isMetaMask ?? false;
}

export function getIsCoinbaseWallet(): boolean {
  return window.ethereum?.isCoinbaseWallet ?? false;
}

const CONNECTIONS = [gnosisSafeConnection, injectedConnection, networkConnection];

export function getConnection(c: Connector | ConnectionType) {
  if (c instanceof Connector) {
    const connection = CONNECTIONS.find((connection) => connection.connector === c);
    if (!connection) {
      throw Error('unsupported connector');
    }
    return connection;
  } else {
    switch (c) {
      case ConnectionType.INJECTED:
        return injectedConnection;
      case ConnectionType.NETWORK:
        return networkConnection;
      case ConnectionType.GNOSIS_SAFE:
        return gnosisSafeConnection;
    }
  }
}

export function getConnectionName(connectionType: ConnectionType, isMetaMask?: boolean) {
  switch (connectionType) {
    case ConnectionType.INJECTED:
      return isMetaMask ? 'MetaMask' : 'Injected';
    case ConnectionType.NETWORK:
      return 'Network';
    case ConnectionType.GNOSIS_SAFE:
      return 'Gnosis Safe';
  }
}
