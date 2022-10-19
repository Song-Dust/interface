import { useWeb3React } from '@web3-react/core';
import { Connector } from '@web3-react/types';
import Modal from 'components/modal';
import { getConnection, getConnectionName, getIsCoinbaseWallet, getIsInjected, getIsMetaMask } from 'connection/utils';
import { useCallback, useEffect, useState } from 'react';
import { useModalIsOpen, useToggleWalletModal } from 'state/application/hooks';
import { ApplicationModal } from 'state/application/reducer';
import { updateConnectionError } from 'state/connection/reducer';
import { useAppDispatch, useAppSelector } from 'state/hooks';
import { updateSelectedWallet } from 'state/user/reducer';
import { useConnectedWallets } from 'state/wallets/hooks';
import { shortenAddress } from 'utils/index';
import { isMobile } from 'utils/userAgent';

import { CoinbaseWalletOption, OpenCoinbaseWalletOption } from './CoinbaseWalletOption';
import { InjectedOption, InstallMetaMaskOption, MetaMaskOption } from './InjectedOption';
import PendingView from './PendingView';
import { WalletConnectOption } from './WalletConnectOption';

const WALLET_VIEWS = {
  OPTIONS: 'options',
  ACCOUNT: 'account',
  PENDING: 'pending',
};

export default function WalletModal() {
  const dispatch = useAppDispatch();
  const { connector, account, chainId } = useWeb3React();
  const [connectedWallets, addWalletToConnectedWallets] = useConnectedWallets();

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);
  const [lastActiveWalletAddress, setLastActiveWalletAddress] = useState<string | undefined>(account);

  const [pendingConnector, setPendingConnector] = useState<Connector | undefined>();
  const pendingError = useAppSelector((state) =>
    pendingConnector ? state.connection.errorByConnectionType[getConnection(pendingConnector).type] : undefined,
  );

  const openOptions = useCallback(() => {
    setWalletView(WALLET_VIEWS.OPTIONS);
  }, [setWalletView]);

  const walletModalOpen = useModalIsOpen(ApplicationModal.WALLET);
  const toggleWalletModal = useToggleWalletModal();

  useEffect(() => {
    if (walletModalOpen) {
      setWalletView(account ? WALLET_VIEWS.ACCOUNT : WALLET_VIEWS.OPTIONS);
    }
  }, [walletModalOpen, setWalletView, account]);

  useEffect(() => {
    if (pendingConnector && walletView !== WALLET_VIEWS.PENDING) {
      updateConnectionError({ connectionType: getConnection(pendingConnector).type, error: undefined });
      setPendingConnector(undefined);
    }
  }, [pendingConnector, walletView]);

  // When new wallet is successfully set by the user, trigger logging of Amplitude analytics event.
  useEffect(() => {
    if (account && account !== lastActiveWalletAddress) {
      const walletType = getConnectionName(getConnection(connector).type, getIsMetaMask());
      const isReconnect =
        connectedWallets.filter((wallet) => wallet.account === account && wallet.walletType === walletType).length > 0;
      if (!isReconnect) addWalletToConnectedWallets({ account, walletType });
    }
    setLastActiveWalletAddress(account);
  }, [connectedWallets, addWalletToConnectedWallets, lastActiveWalletAddress, account, connector, chainId]);

  const tryActivation = useCallback(
    async (connector: Connector) => {
      const connectionType = getConnection(connector).type;
      try {
        setPendingConnector(connector);
        setWalletView(WALLET_VIEWS.PENDING);
        dispatch(updateConnectionError({ connectionType, error: undefined }));

        await connector.activate();

        dispatch(updateSelectedWallet({ wallet: connectionType }));
        toggleWalletModal();
      } catch (error: any) {
        console.debug(`web3-react connection error: ${error}`);
        dispatch(updateConnectionError({ connectionType, error: error.message }));
      }
    },
    [toggleWalletModal, dispatch],
  );

  function getOptions() {
    const isInjected = getIsInjected();
    const isMetaMask = getIsMetaMask();
    const isCoinbaseWallet = getIsCoinbaseWallet();

    const isCoinbaseWalletBrowser = isMobile && isCoinbaseWallet;
    const isMetaMaskBrowser = isMobile && isMetaMask;
    const isInjectedMobileBrowser = isCoinbaseWalletBrowser || isMetaMaskBrowser;

    let injectedOption;
    if (!isInjected) {
      if (!isMobile) {
        injectedOption = <InstallMetaMaskOption />;
      }
    } else if (!isCoinbaseWallet) {
      if (isMetaMask) {
        injectedOption = <MetaMaskOption tryActivation={tryActivation} />;
      } else {
        injectedOption = <InjectedOption tryActivation={tryActivation} />;
      }
    }

    let coinbaseWalletOption;
    if (isMobile && !isInjectedMobileBrowser) {
      coinbaseWalletOption = <OpenCoinbaseWalletOption />;
    } else if (!isMobile || isCoinbaseWalletBrowser) {
      coinbaseWalletOption = <CoinbaseWalletOption tryActivation={tryActivation} />;
    }

    const walletConnectionOption =
      (!isInjectedMobileBrowser && <WalletConnectOption tryActivation={tryActivation} />) ?? null;

    return (
      <>
        {injectedOption}
        {coinbaseWalletOption}
        {walletConnectionOption}
      </>
    );
  }

  function getModalContent() {
    if (walletView === WALLET_VIEWS.ACCOUNT) {
      return <p>{shortenAddress(account)}</p>;
    }

    return (
      <>
        {walletView === WALLET_VIEWS.PENDING && pendingConnector && (
          <PendingView
            openOptions={openOptions}
            connector={pendingConnector}
            error={!!pendingError}
            tryActivation={tryActivation}
          />
        )}
        {walletView !== WALLET_VIEWS.PENDING && getOptions()}
      </>
    );
  }

  return (
    <Modal closeModal={toggleWalletModal} open={walletModalOpen} title="Connect Wallet">
      {getModalContent()}
    </Modal>
  );
}
