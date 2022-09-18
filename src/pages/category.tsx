import { faCircleInfo, faHexagonVerticalNft } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Transition } from '@headlessui/react';
import { useWeb3React } from '@web3-react/core';
import Modal from 'components/modal';
import VoteSongModal from 'components/modal/VoteSongModal';
import { getConnection } from 'connection/utils';
import { useTopic } from 'hooks/useArena';
import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'state/hooks';
import { updateSelectedWallet } from 'state/user/reducer';
import { shortenAddress } from 'utils/index';

import { injectedConnection } from '../connection';

// todo we need to find a way to use our color variables (tailwind) to set primary and secondary color of duoton icons
const style = {
  '--fa-primary-color': '#353535',
  '--fa-secondary-color': '#EF476F',
  '--fa-primary-opacity': 1,
  '--fa-secondary-opacity': 0.4,
} as React.CSSProperties;

const Category = () => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const active = useMemo(() => !!account, [account]);

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

  const [voteSongModalOpen, setOpenVoteSongModalOpen] = useState(false);

  function openVoteSongModal() {
    setOpenVoteSongModalOpen(true);
  }

  function closeVoteSongModal() {
    setOpenVoteSongModalOpen(false);
  }

  const [AddSongModal, setOpenAddSongModal] = useState(false);

  function openAddSongModal() {
    setOpenAddSongModal(true);
  }

  function closeAddSongModal() {
    setOpenAddSongModal(false);
  }

  const [MoreActionModal, setOpenMoreActionModal] = useState(false);

  function openMoreActionModal() {
    setOpenMoreActionModal(true);
  }

  function closeMoreActionModal() {
    setOpenMoreActionModal(false);
  }

  const { id: topicId } = useParams();
  const { choices, loaded } = useTopic(Number(topicId));

  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const selectedSong = useMemo(() => {
    if (selectedSongId === null) return null;
    return choices.find((c) => c.id === selectedSongId)!;
  }, [choices, selectedSongId]);

  function openAction(id: number) {
    setSelectedSongId(id);
  }

  function closeAction() {
    setSelectedSongId(null);
  }

  const renderConnector = () => {
    return active ? (
      <p data-testid="wallet-connect">Wallet Connected {shortenAddress(account)}</p>
    ) : (
      <button data-testid="wallet-connect" className={'btn-primary btn-large'} onClick={tryActivation}>
        Connect Wallet
      </button>
    );
  };

  function renderList() {
    return loaded ? (
      choices.map((song) => {
        return (
          <div
            key={song.id}
            className={'bg-squircle w-[311px] h-[316px] bg-cover p-4'}
            data-testid={`category-list-item-${song.id}`}
          >
            {/* todo img below must be an iframe link to youtube video*/}
            <img
              alt="choice"
              src={
                song.meta?.thumbnail ||
                'https://bafybeicp7kjqwzzyfuryefv2l5q23exl3dbd6rgmuqzxs3cy6vaa2iekka.ipfs.w3s.link/sample.png'
              }
              className={'rounded-xl'}
            />
            <div className={'px-2 pt-1'}>
              <p className={'font-bold text-xl'}>{song.description}</p>
              {song.meta?.tags.map((tag, i) => {
                return (
                  <span key={i} className={'chips mr-2'}>
                    {tag.subject}: <span className={'font-semibold'}>{tag.title}</span>
                  </span>
                );
              })}
              {song.meta && (
                <p className={'text-dark-gray mt-4'} data-testid={`category-list-item-${song.id}-meta`}>
                  Added by <span className={'text-black font-semibold'}>{song.meta?.by}</span> at {song.meta?.date}
                </p>
              )}
              <a href={song.meta?.opensea || '#'} className={'flex gap-1.5 mt-2'}>
                <FontAwesomeIcon fontSize={24} icon={faHexagonVerticalNft} style={style} />
                <span className={'text-primary font-semibold text-under underline'}>View on Opensea</span>
              </a>
            </div>
          </div>
        );
      })
    ) : (
      <div>loading</div>
    );
  }

  return (
    <div className={'px-24 py-24'}>
      <VoteSongModal closeModal={closeVoteSongModal} open={voteSongModalOpen} />

      {/* todo #alimahdiyar This is Add song Modal, use proper Variables for it. */}

      <Modal
        className={'!max-w-4xl relative overflow-hidden'}
        title={`Select the song you want to add to this category`}
        closeModal={closeAddSongModal}
        open={AddSongModal}
      >
        <main className={'flex flex-wrap gap-6'}>
          {choices.map((song) => {
            return (
              <div
                onClick={() => openAction(song.id)}
                key={song.id}
                className={'rounded-3xl w-64 bg-light-gray-2 p-4'}
                data-testid={`category-list-item-${song.id}`}
              >
                {/* todo img below must be an iframe link to youtube video*/}
                <img
                  alt="choice"
                  src={
                    song.meta?.thumbnail ||
                    'https://bafybeicp7kjqwzzyfuryefv2l5q23exl3dbd6rgmuqzxs3cy6vaa2iekka.ipfs.w3s.link/sample.png'
                  }
                  className={'rounded-xl'}
                />
                <div className={'px-2 pt-2'}>
                  <p className={'font-bold text-xl'}>{song.description}</p>

                  <a href={song.meta?.opensea || '#'} className={'flex gap-1.5 mt-2'}>
                    <FontAwesomeIcon fontSize={24} icon={faCircleInfo} style={style} />
                    <span className={'text-primary font-semibold text-under underline'}>More Details</span>
                  </a>
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

      <Modal
        className={'relative overflow-hidden'}
        title={`What do you want to add?`}
        closeModal={closeMoreActionModal}
        open={MoreActionModal}
      >
        <main className={'flex flex-wrap gap-6'}>
          <button>new category</button>
          <button onClick={openAddSongModal}>new Song-a-day song</button>
        </main>
      </Modal>

      <div>{renderConnector()}</div>
      <header className={'bg-gradient-light w-full h-48 rounded-3xl flex p-6 mb-12'}>
        <div>
          <h1>Songs were written in a hotel room</h1>
          <p className={'text-label'}>
            This is the description section of this category called “songs were written in a hotel room”, as the name
            suggests, Jonathan recorded all of the songs here in a hotel room.
          </p>
        </div>
        <img alt="header" src={'/category-header.png'} />
      </header>
      <main className={'flex'}>
        <section className={'flex-1'}>
          <header></header>
          <main className={'flex flex-wrap gap-6'}>{renderList()}</main>
        </section>
        <aside className={'w-68'}>
          <button onClick={openVoteSongModal} className={'btn-primary btn-large w-full mb-2'}>
            Vote for a Song!
          </button>
          <button onClick={openMoreActionModal} className={'btn-primary-inverted btn-large w-full'}>
            More Actions
          </button>
          <section>
            <div className={'time-left'}></div>
            <div className={'info-summery'}></div>
          </section>
        </aside>
      </main>
      {/*<button className={'btn-primary-inverted'}>Hello Songdust!</button>*/}
    </div>
  );
};

export default Category; /* Rectangle 18 */
