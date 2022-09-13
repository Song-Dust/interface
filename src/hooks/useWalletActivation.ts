import { useCallback } from 'react';
import { injectedConnection } from '../connection';
import { getConnection } from '../connection/utils';
import { updateSelectedWallet } from 'state/user/reducer';
import { useAppDispatch } from 'state/hooks';

export default function useWalletActivation() {
  const dispatch = useAppDispatch();
  const tryActivation = useCallback(async () => {
    const connector = injectedConnection.connector;
    const connectionType = getConnection(connector).type;
    try {
      await connector.activate();
      dispatch(updateSelectedWallet({ wallet: connectionType }));
    } catch (error: any) {
      console.debug(`web3-react connection error: ${error}`);
    }
  }, [dispatch]);
  return { tryActivation };
}
