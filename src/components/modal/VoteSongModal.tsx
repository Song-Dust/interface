import { Transition } from '@headlessui/react';
import Input from 'components/basic/input';
import Modal, { ModalPropsInterface } from 'components/modal/index';
import SongTile from 'components/song/SongTile';
import { useTopic } from 'hooks/useArena';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Choice } from 'types';
import { Address, useAccount } from 'wagmi';

const VoteSongModal = (props: ModalPropsInterface) => {
  const { address: account } = useAccount();
  // const chainId = chain?.id;
  const active = useMemo(() => !!account, [account]);

  const { topicAddress } = useParams();
  const { choices } = useTopic(topicAddress as Address | undefined);

  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const selectedSong = useMemo(() => {
    if (!choices || selectedSongId === null) return null;
    return choices.find((c: { id: number }) => c.id === selectedSongId)!;
  }, [choices, selectedSongId]);

  function closeAction() {
    setSelectedSongId(null);
  }

  // const { openConnectModal } = useConnectModal();

  const [voteAmount, setVoteAmount] = useState('');
  // const parsedAmount = useMemo(
  //   () => tryParseCurrencyAmount(voteAmount, chainId && SONG[chainId] ? SONG[chainId] : undefined),
  //   [chainId, voteAmount],
  // );

  // const { callback: voteCallback } = useVoteCallback(
  //   Number(topicId),
  //   Number(selectedSongId),
  //   parsedAmount?.quotient.toString() || '0',
  //   selectedSong?.description || '',
  // );
  const [loading, setLoading] = useState(false);

  // const songBalance = useTokenBalance(account ?? undefined, chainId ? SONG[chainId] : undefined);
  const songBalance = 123;

  // const songSymbol = songBalance?.currency.symbol || 'SONG';
  // const songSymbol = 'SONG';

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleVote = async () => {
    if (loading) return;
    setLoading(true);
    // try {
    //   await voteCallback?.();
    // } catch (e) {
    //   console.log('vote failed');
    //   console.log(e);
    // }
    if (mounted.current) {
      setLoading(false);
    }
  };

  // const insufficientBalance = useMemo(
  //   () => songBalance && parsedAmount && songBalance.lessThan(parsedAmount),
  //   [parsedAmount, songBalance],
  // );

  // const [approvalSong, approveSongCallback] = useApproveCallback(
  //   parsedAmount,
  //   chainId ? ARENA_ADDRESS[chainId] : undefined,
  // );

  function renderButton() {
    // if (!active) {
    //   return (
    //     <button data-testid="cast-vote-btn" className={'btn-primary btn-large'} onClick={openConnectModal}>
    //       Connect Wallet
    //     </button>
    //   );
    // }
    // if (!Number(voteAmount)) {
    //   return (
    //     <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'}>
    //       Enter Amount
    //     </button>
    //   );
    // }
    // if (insufficientBalance) {
    //   return (
    //     <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'}>
    //       Insufficient {songSymbol} balance
    //     </button>
    //   );
    // }
    // if (approvalSong === ApprovalState.NOT_APPROVED) {
    //   return (
    //     <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'} onClick={approveSongCallback}>
    //       Approve {songSymbol}
    //     </button>
    //   );
    // }
    // if (approvalSong === ApprovalState.PENDING) {
    //   return (
    //     <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'}>
    //       Waiting for Approve...
    //     </button>
    //   );
    // }
    // if (approvalSong === ApprovalState.UNKNOWN) {
    //   return (
    //     <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'}>
    //       Loading Approval State...
    //     </button>
    //   );
    // }
    // if (loading) {
    //   return (
    //     <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'}>
    //       Sending Transaction...
    //     </button>
    //   );
    // }
    return (
      <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'} onClick={handleVote}>
        {/*Cast <span className={'font-bold'}>{formatBalance(voteAmount, 3)}</span> {songSymbol}*/}
        123
      </button>
    );
  }

  function modalContent(items: Choice[]) {
    return (
      <>
        <main className={'flex flex-wrap gap-6'}>
          {items.map((song) => {
            return (
              <SongTile
                onClick={() => setSelectedSongId(song.id)}
                className={`${song.id === selectedSongId || selectedSongId === null ? 'opacity-100' : 'opacity-30'}`}
                key={song.id}
                id={song.id}
                songMeta={song.meta}
              />
            );
          })}
        </main>
        <Transition
          as={Fragment}
          show={selectedSongId !== null}
          enter="transform ease-in-out transition duration-[400ms]"
          enterFrom="opacity-0 translate-y-32"
          enterTo="opacity-100 translate-y-0"
          leave="transform duration-500 transition ease-in-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 translate-y-32 "
        >
          <footer className={'absolute left-0 right-0 bottom-0 rounded-xl bg-white border-gray border-t py-4 px-2'}>
            <section className={'flex'}>
              <div className={'flex-1'}>
                <p className={'font-semibold text-xl'}>
                  <span className="text-primary">{selectedSong?.meta?.name}</span> selected
                </p>
                <p className={''}>
                  {active ? 'Enter the amount that you want to cast' : 'Connect your wallet to cast your vote'}
                </p>
              </div>
              <div className={'flex-1'}>
                <Input
                  type={'number'}
                  testid="vote-amount"
                  currencyBalance={songBalance}
                  placeholder="Enter Amount"
                  value={voteAmount}
                  onUserInput={setVoteAmount}
                />
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
      </>
    );
  }

  return (
    <Modal
      className={'!max-w-2xl relative overflow-hidden h-2/3'}
      {...props}
      title={`Select the song you want to vote for (${choices?.length || '...'} songs nominated)`}
    >
      {choices !== undefined ? modalContent(choices) : <div>loading</div>}
    </Modal>
  );
};

export default VoteSongModal;
