// import PropTypes from 'prop-types';
import { Transition } from '@headlessui/react';
import { useWeb3React } from '@web3-react/core';
import Modal, { ModalPropsInterface } from 'components/modal/index';
import SongMiniCard from 'components/song/SongMiniCard';
import { useTopic } from 'hooks/useArena';
import useWalletActivation from 'hooks/useWalletActivation';
import React, { Fragment, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

const AddSongModal = (props: ModalPropsInterface) => {
  const { account } = useWeb3React();
  const active = useMemo(() => !!account, [account]);
  const { tryActivation } = useWalletActivation();

  const { id: topicId } = useParams();
  const { choices } = useTopic(Number(topicId));

  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const selectedSong = useMemo(() => {
    if (selectedSongId === null) return null;
    return choices.find((c) => c.id === selectedSongId)!;
  }, [choices, selectedSongId]);

  function closeAction() {
    setSelectedSongId(null);
  }

  return (
    <Modal
      className={'!max-w-4xl relative overflow-hidden'}
      title={`Select the song you want to add to this category`}
      closeModal={props.closeModal}
      open={props.open}
    >
      <main className={'flex flex-wrap gap-6'}>
        {choices.map((song) => {
          return (
            <SongMiniCard onClick={() => setSelectedSongId(song.id)} key={song.id} id={song.id} songMeta={song.meta} />
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
              {active && <p className={''}>You need to Connect your wallet for adding a song</p>}
              <p>
                Submit fee: <span className={'font-semibold'}>24.25 SONG</span>
              </p>
            </div>
          </section>
          <section className={'vote-modal-action flex justify-end mt-8'}>
            <button onClick={closeAction} className={'btn-primary-inverted btn-large mr-2'}>
              Go back
            </button>
            {active ? (
              <button data-testid="wallet-connect" className={'btn-primary btn-large w-64'} onClick={tryActivation}>
                Add song to category
              </button>
            ) : (
              <button data-testid="wallet-connect" className={'btn-primary btn-large'} onClick={tryActivation}>
                Connect Wallet
              </button>
            )}
          </section>
          {/* footer action */}
        </footer>
      </Transition>
    </Modal>
  );
};

export default AddSongModal;
