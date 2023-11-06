import { Transition } from '@headlessui/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { mainnet } from '@wagmi/core';
import { usePrepareTopicDeployChoice, useSongADayTokenUri, useTopicWrite } from 'abis/types/generated';
import algoliasearch from 'algoliasearch/lite';
import Modal, { ModalPropsInterface } from 'components/modal/index';
import SongMiniCard from 'components/song/SongMiniCard';
import { SONGADAY_CONTRACT_ADDRESS } from 'constants/addresses';
import { useApproval } from 'hooks/useApproval';
import { useArena, useArenaTokenData } from 'hooks/useArena';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { InstantSearch, SearchBox, useHits } from 'react-instantsearch-hooks-web';
import { useParams } from 'react-router-dom';
import { SongMetadata } from 'types';
import { ApprovalState } from 'types/approval';
import { formatUnits } from 'viem';
import { Address, useAccount } from 'wagmi';

const AddSongModal = ({ open, closeModal }: ModalPropsInterface) => {
  const { address: account } = useAccount();
  const { topicAddress } = useParams();

  const active = useMemo(() => !!account, [account]);
  const { choiceCreationFee } = useArena();
  const { arenaTokenAddress, arenaTokenBalance, arenaTokenSymbol, arenaTokenDecimals } = useArenaTokenData();
  const [selectedSong, setSelectedSong] = useState<SongMetadata | null>(null);

  function closeAction() {
    setSelectedSong(null);
  }

  const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID || '';
  const ALGOLIA_SEARCH_KEY = process.env.REACT_APP_ALGOLIA_SEARCH_KEY || '';
  const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
  const Stats = () => {
    const { results } = useHits();
    return <div className="pb-2">Showing {results?.nbHits.toLocaleString() || 0} songs from the catalog</div>;
  };

  const CustomHits = () => {
    const { hits } = useHits<SongMetadata & Record<string, unknown>>();
    return (
      <main className={'flex flex-wrap gap-6 pt-4 justify-center overflow-auto'} style={{ maxHeight: '70%' }}>
        {hits.map((song) => {
          return (
            <SongMiniCard
              className={`${song.token_id === selectedSong?.token_id ? `bg-primary-light` : `bg-light-gray-2`}`}
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

  const parsedAmount = useMemo(() => {
    if (choiceCreationFee === undefined) return undefined;
    if (choiceCreationFee === 0n) return '0';
    if (arenaTokenDecimals === undefined) return undefined;
    return formatUnits(choiceCreationFee, arenaTokenDecimals);
  }, [arenaTokenDecimals, choiceCreationFee]);

  const { data: tokenURI } = useSongADayTokenUri({
    chainId: mainnet.id,
    address: SONGADAY_CONTRACT_ADDRESS,
    args: selectedSong?.token_id ? [BigInt(selectedSong?.token_id)] : undefined,
  });

  const { config } = usePrepareTopicDeployChoice({
    address: topicAddress as Address | undefined,
    args: tokenURI ? [tokenURI] : undefined,
  });
  const { write: deployChoice } = useTopicWrite(config);
  const [loading, setLoading] = useState(false);

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
      await deployChoice?.();
    } catch (e) {
      console.log('add choice failed');
      console.log(e);
    }
    if (mounted.current) {
      setLoading(false);
    }
  };

  const { openConnectModal } = useConnectModal();

  const insufficientBalance = useMemo(
    () => Boolean(arenaTokenBalance && choiceCreationFee && choiceCreationFee > arenaTokenBalance),
    [arenaTokenBalance, choiceCreationFee],
  );

  const { approvalState: approvalStateArenaToken, approve: approveArenaToken } = useApproval({
    tokenAddress: arenaTokenAddress,
    amount: choiceCreationFee,
    spender: topicAddress as Address,
  });

  function renderButton() {
    if (!active) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large'} onClick={openConnectModal}>
          Connect Wallet
        </button>
      );
    }
    if (choiceCreationFee === undefined) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'}>
          Loading...
        </button>
      );
    }
    if (insufficientBalance) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'}>
          Insufficient {arenaTokenSymbol} balance
        </button>
      );
    }
    if (approvalStateArenaToken === ApprovalState.NOT_APPROVED) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'} onClick={approveArenaToken}>
          Approve {arenaTokenSymbol}
        </button>
      );
    }
    if (
      approvalStateArenaToken === ApprovalState.PREPARING_TRANSACTION ||
      approvalStateArenaToken === ApprovalState.AWAITING_USER_CONFIRMATION
    ) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'}>
          Waiting for Approve...
        </button>
      );
    }
    if (approvalStateArenaToken === ApprovalState.AWAITING_TRANSACTION) {
      return (
        <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'}>
          Sending Approval Transaction...
        </button>
      );
    }
    if (approvalStateArenaToken === ApprovalState.UNKNOWN) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'}>
          Loading Approval State...
        </button>
      );
    }
    if (!deployChoice) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'}>
          Loading...
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
      className={'!max-w-4xl w-full px-6 h-3/4 max-h'}
      title={`Select the song you want to add to this category`}
      closeModal={closeModal}
      open={open}
    >
      <InstantSearch searchClient={searchClient} indexName="songs" routing>
        <div className="w-full flex items-baseline gap-5">
          <SearchBox
            placeholder="Find songs by name, location, instrument and more"
            classNames={{
              root: 'grow',
              form: 'relative',
              input:
                'block w-full pl-7 px-4 py-2 border border-slate-400 placeholder-slate-600 focus:outline-none focus:border-pink-500 focus:ring-pink-500 rounded-xl focus:ring-1',
              submitIcon: 'absolute top-4 left-0 bottom-0 w-8',
              resetIcon: 'hidden',
            }}
          />
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 2C9 1.46875 9.4375 1 10 1H14C14.5312 1 15 1.46875 15 2V6C15 6.5625 14.5312 7 14 7C13.4375 7 13 6.5625 13 6V4.4375L7.6875 9.71875C7.3125 10.125 6.65625 10.125 6.28125 9.71875C5.875 9.34375 5.875 8.6875 6.28125 8.3125L11.5625 3H10C9.4375 3 9 2.5625 9 2Z"
                fill="#193154"
              />
              <path
                opacity="0.4"
                d="M1 4C1 2.90625 1.875 2 3 2H6C6.53125 2 7 2.46875 7 3C7 3.5625 6.53125 4 6 4H3V13H12V10C12 9.46875 12.4375 9 13 9C13.5312 9 14 9.46875 14 10V13C14 14.125 13.0938 15 12 15H3C1.875 15 1 14.125 1 13V4Z"
                fill="#193154"
              />
            </svg>
            <p className="text-sm font-normal text-black hover:underline hover:cursor-pointer">
              Click here for advanced exploration
            </p>
          </div>
        </div>
        <Stats />
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
        <footer className={'absolute left-0 right-0 bottom-0 bg-white border-gray border-t rounded-b-2xl py-4 px-8'}>
          <section className={'flex'}>
            <div className={'flex-1'}>
              <p className={'font-semibold text-xl'}>
                <span className="text-primary">{selectedSong?.name}</span> selected
              </p>
              {!active && <p className={''}>You need to Connect your wallet for adding a song</p>}
              <p>
                Submit fee:{' '}
                <span className={'font-semibold'}>
                  {parsedAmount ?? '...'} {arenaTokenSymbol}
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
