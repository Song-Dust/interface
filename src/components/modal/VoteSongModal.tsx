import React, { Fragment, useMemo, useState } from 'react';
// import PropTypes from 'prop-types';
import { Transition } from '@headlessui/react';
import Modal, { ModalPropsInterface } from 'components/modal/index';
import Input from 'components/basic/input';
import { useWeb3React } from '@web3-react/core';
import useWalletActivation from 'hooks/useWalletActivation';
import { useParams } from 'react-router-dom';
import { useTopic } from 'hooks/useArena';
import { SONG } from 'constants/tokens';
import { useTokenBalance } from 'hooks/useCurrencyBalance';
import { formatBalance } from 'utils/numbers';
import tryParseCurrencyAmount from 'lib/utils/tryParseCurrencyAmount';

const VoteSongModal = (props: ModalPropsInterface) => {
  const { chainId, account } = useWeb3React();
  const active = useMemo(() => !!account, [account]);
  const { open, closeModal } = props;
  const { tryActivation } = useWalletActivation();

  const { id: topicId } = useParams();
  const { choices, loaded } = useTopic(Number(topicId));

  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const selectedSong = useMemo(() => {
    if (selectedSongId === null) return null;
    // eslint-disable-next-line react/prop-types
    return choices.find((c: { id: number }) => c.id === selectedSongId)!;
  }, [choices, selectedSongId]);

  function openAction(id: number) {
    setSelectedSongId(id);
  }

  function closeAction() {
    setSelectedSongId(null);
  }

  const songBalance = useTokenBalance(account ?? undefined, chainId ? SONG[chainId] : undefined);
  const [voteAmount, setVoteAmount] = useState('');
  const parsedAmount = useMemo(
    () => tryParseCurrencyAmount(voteAmount, songBalance?.currency ?? undefined),
    [songBalance?.currency, voteAmount],
  );
  const insufficientBalance = useMemo(
    () => songBalance && parsedAmount && songBalance.lessThan(parsedAmount),
    [parsedAmount, songBalance],
  );

  function renderButton() {
    if (!active) {
      return (
        <button data-testid="cast-vote" className={'btn-primary btn-large'} onClick={tryActivation}>
          Connect Wallet
        </button>
      );
    }
    if (insufficientBalance) {
      return (
        <button data-testid="cast-vote" className={'btn-primary btn-large w-56'} onClick={tryActivation}>
          Insufficient {songBalance?.currency.symbol} balance
        </button>
      );
    }
    return (
      <button data-testid="cast-vote" className={'btn-primary btn-large w-56'} onClick={tryActivation}>
        Cast <span className={'font-bold'}>{formatBalance(voteAmount || 0, 3)}</span>{' '}
        {songBalance?.currency.symbol || 'SONG'}
      </button>
    );
  }

  function modalContent() {
    return (
      <>
        <main className={'flex flex-wrap gap-6'}>
          {choices.map((song) => {
            return (
              <div
                onClick={() => openAction(song.id)}
                key={song.id}
                className={'w-64 h-24 bg-cover relative'}
                data-testid={`category-list-item-${song.id}`}
              >
                {/* todo #alimahdiyar img below must be an iframe link to youtube video*/}
                <img
                  alt="choice"
                  src={'https://bafybeicp7kjqwzzyfuryefv2l5q23exl3dbd6rgmuqzxs3cy6vaa2iekka.ipfs.w3s.link/sample.png'}
                  className={'rounded-xl w-full h-full'}
                />
                <div className={'px-2 pt-1 absolute inset-0'}>
                  <p className={'font-bold text-xl'}>{song.description}</p>
                </div>
              </div>
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
          <footer className={'px-4 py-2 absolute left-0 right-0 bottom-0 bg-white border-gray border-t py-4 px-2'}>
            <section className={'flex'}>
              <div className={'flex-1'}>
                <p className={''}>
                  <span>{selectedSong?.description}</span> selected
                </p>
                <p className={''}>
                  {active ? 'Enter the amount that you want to cast' : 'Connect your wallet to cast your vote'}
                </p>
              </div>
              <div className={'flex-1'}>
                <Input
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
      className={'!max-w-2xl relative overflow-hidden'}
      {
        /* eslint-disable-next-line react/prop-types */ ...props
      }
      title={`Select the song you want to vote for (${choices.length} songs nominated)`}
      closeModal={closeModal}
      open={open}
    >
      {loaded ? modalContent() : <div>loading</div>}
    </Modal>
  );
};

export default VoteSongModal;
