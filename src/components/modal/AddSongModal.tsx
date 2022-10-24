// import PropTypes from 'prop-types';
import { formatEther } from '@ethersproject/units';
import { Transition } from '@headlessui/react';
import { useWeb3React } from '@web3-react/core';
import algoliasearch from 'algoliasearch/lite';
import Modal, { ModalPropsInterface } from 'components/modal/index';
import SongMiniCard from 'components/song/SongMiniCard';
import { ARENA_ADDRESS } from 'constants/addresses';
import { SONG } from 'constants/tokens';
import { useAddChoiceCallback } from 'hooks/arena/useAddChoiceCallback';
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback';
import { useArena } from 'hooks/useArena';
import { useTokenBalance } from 'lib/hooks/useCurrencyBalance';
import tryParseCurrencyAmount from 'lib/utils/tryParseCurrencyAmount';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { InstantSearch, SearchBox, useHits } from 'react-instantsearch-hooks-web';
import { useParams } from 'react-router-dom';
import { useToggleWalletModal } from 'state/application/hooks';
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount';

import { SongMetadata } from '../../types';

const AddSongModal = (props: ModalPropsInterface) => {
  const { account } = useWeb3React();
  const active = useMemo(() => !!account, [account]);
  const { arenaInfo } = useArena();
  const [selectedSong, setSelectedSong] = useState<SongMetadata | null>(null);

  function closeAction() {
    setSelectedSong(null);
  }

  const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID || '';
  const ALGOLIA_SEARCH_KEY = process.env.REACT_APP_ALGOLIA_SEARCH_KEY || '';
  const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
  const Stats = () => {
    const { results } = useHits();
    return <>Showing {results?.nbHits.toLocaleString() || 0} songs from the catalog</>;
  };

  const CustomHits = () => {
    const { hits } = useHits<SongMetadata & Record<string, unknown>>();
    return (
      <main className={'flex flex-wrap gap-6'} style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {hits.map((song) => {
          return (
            <SongMiniCard
              onClick={() => setSelectedSong(song)}
              key={song.token_id}
              id={song.token_id}
              songMeta={song}
            />
          );
        })}
      </main>
    );
  };
  const { chainId } = useWeb3React();
  const currency = chainId ? SONG[chainId] : undefined;

  const parsedAmount = useMemo(() => {
    return arenaInfo?.choiceCreationFee && currency
      ? tryParseCurrencyAmount(formatEther(arenaInfo.choiceCreationFee).toString(), currency)
      : undefined;
  }, [arenaInfo, currency]);

  const { id: topicId } = useParams();

  const { callback: addChoiceCallback } = useAddChoiceCallback(
    Number(topicId),
    String(selectedSong?.token_id || ''),
    selectedSong?.name || '',
  );
  const [loading, setLoading] = useState(false);

  const songBalance = useTokenBalance(account ?? undefined, chainId ? SONG[chainId] : undefined);

  const songSymbol = songBalance?.currency.symbol || 'SONG';

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleAddChoice = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await addChoiceCallback?.();
    } catch (e) {
      console.log('add choice failed');
      console.log(e);
    }
    if (mounted.current) {
      setLoading(false);
    }
  };

  const toggleWalletModal = useToggleWalletModal();

  const insufficientBalance = useMemo(
    () => songBalance && parsedAmount && songBalance.lessThan(parsedAmount),
    [parsedAmount, songBalance],
  );

  const [approvalSong, approveSongCallback] = useApproveCallback(
    parsedAmount,
    chainId ? ARENA_ADDRESS[chainId] : undefined,
  );

  function renderButton() {
    if (!active) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large'} onClick={toggleWalletModal}>
          Connect Wallet
        </button>
      );
    }
    if (!arenaInfo) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'}>
          Loading...
        </button>
      );
    }
    if (insufficientBalance) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'}>
          Insufficient {songSymbol} balance
        </button>
      );
    }
    if (approvalSong === ApprovalState.NOT_APPROVED) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'} onClick={approveSongCallback}>
          Approve {songSymbol}
        </button>
      );
    }
    if (approvalSong === ApprovalState.PENDING) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'}>
          Waiting for Approve...
        </button>
      );
    }
    if (approvalSong === ApprovalState.UNKNOWN) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'}>
          Loading Approval State...
        </button>
      );
    }
    if (loading) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'}>
          Sending Transaction...
        </button>
      );
    }
    return (
      <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'} onClick={handleAddChoice}>
        Add song to category
      </button>
    );
  }

  return (
    <Modal
      className={'!max-w-4xl relative overflow-hidden'}
      title={`Select the song you want to add to this category`}
      closeModal={props.closeModal}
      open={props.open}
    >
      <InstantSearch searchClient={searchClient} indexName="songs" routing>
        <div style={{ width: '100%' }}>
          <SearchBox placeholder="Find songs by name, location, instrument and more" />
          <Stats />
        </div>
        <CustomHits />
      </InstantSearch>
      <Transition
        as={Fragment}
        show={selectedSong !== null}
        enter="transform ease-in-out transition duration-[400ms]"
        enterFrom="opacity-0 translate-y-32"
        enterTo="opacity-100 translate-y-0"
        leave="transform duration-500 transition ease-in-out"
        leaveFrom="opacity-100"
        leaveTo="opacity-0 translate-y-32 "
      >
        <footer className={'px-4 py-2 absolute left-0 right-0 bottom-0 bg-white border-gray border-t py-4 px-2'}>
          <section className={'flex'}>
            <div className={'flex-1'}>
              <p className={''}>
                <span>{selectedSong?.name}</span> selected
              </p>
              {active && <p className={''}>You need to Connect your wallet for adding a song</p>}
              <p>
                Submit fee:{' '}
                <span className={'font-semibold'}>
                  {parsedAmount ? formatCurrencyAmount(parsedAmount, 4) : ''} {currency?.symbol}
                </span>
              </p>
            </div>
          </section>
          <section className={'vote-modal-action flex justify-end mt-8'}>
            <button onClick={closeAction} className={'btn-primary-inverted btn-large mr-2'}>
              Go back
            </button>
            {renderButton()}
          </section>
          {/* footer action */}
        </footer>
      </Transition>
    </Modal>
  );
};

export default AddSongModal;
