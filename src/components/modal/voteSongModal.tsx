import React, { Fragment, useCallback, useMemo, useState } from 'react';
// import PropTypes from 'prop-types';
import { Transition } from '@headlessui/react';
import Modal from 'components/modal/index';
import Input from 'components/basic/input';
import { useWeb3React } from '@web3-react/core';
import { injectedConnection } from '../../connection';
import { getConnection } from '../../connection/utils';
import { updateSelectedWallet } from 'state/user/reducer';
import { useAppDispatch } from 'state/hooks';

const VoteSongModal = (props: { balance: any; placeholder: any; choices: any }) => {
  const dispatch = useAppDispatch();
  const { chainId, account } = useWeb3React();
  const active = useMemo(() => !!chainId, [chainId]);

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

  const { balance, placeholder, choices } = props;

  const [open, setOpen] = useState(false);

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const selectedSong = useMemo(() => {
    if (selectedSongId === null) return null;
    // eslint-disable-next-line react/prop-types
    return choices.find((c: { id: number }) => c.id === selectedSongId)!;
  }, [choices, selectedSongId]);

  function openAction(id: React.Key | null | undefined) {
    // @ts-ignore
    setSelectedSongId(id);
  }

  function closeAction() {
    setSelectedSongId(null);
  }

  // const { disabled, className, icon, balance } = props
  // eslint-disable-next-line react/prop-types

  return (
    <>
      <Modal
        className={'!max-w-2xl relative overflow-hidden'}
        {
          /* eslint-disable-next-line react/prop-types */ ...props
        }
        title={`Select the song you want to vote for (${choices.length} songs nominated)`}
        closeModal={closeModal}
        open={open}
      >
        <main className={'flex flex-wrap gap-6'}>
          {/* todo #alimahdiyar we need to have selected state when a song being selected in modal */}
          {choices.map(
            (song: {
              id: React.Key | null | undefined;
              description: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined;
            }) => {
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
            },
          )}
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
                <Input balance={'302 SONG'} placeholder="Enter Amount" />
              </div>
            </section>
            <section className={'vote-modal-action flex justify-end mt-8'}>
              <button onClick={closeAction} className={'btn-primary-inverted btn-large mr-2'}>
                Go back
              </button>
              {active ? (
                <button data-testid="wallet-connect" className={'btn-primary btn-large w-56'} onClick={tryActivation}>
                  Cast <span className={'font-bold'}>245</span> SONG
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
    </>
  );
};

export default VoteSongModal;
