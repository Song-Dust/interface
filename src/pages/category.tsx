import { faCircleInfo,faHexagonVerticalNft } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useWeb3React } from '@web3-react/core';
import Input from 'components/basic/input'
import Modal from 'components/modal';
import AddSongModal from 'components/modal/AddSongModal';
import VoteSongModal from 'components/modal/VoteSongModal';
import { SongTags } from 'components/song/SongTags';
import { SONGADAY_CONTRACT_ADDRESS } from 'constants/addresses';
import { useTopic } from 'hooks/useArena';
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToggleWalletModal } from 'state/application/hooks';
import { parseTokenURI, shortenAddress } from 'utils/index';

// todo we need to find a way to use our color variables (tailwind) to set primary and secondary color of duoton icons
const style = {
  '--fa-primary-color': '#353535',
  '--fa-secondary-color': '#EF476F',
  '--fa-primary-opacity': 1,
  '--fa-secondary-opacity': 0.4,
} as React.CSSProperties;

const Category = () => {
  const { account } = useWeb3React();
  const active = useMemo(() => !!account, [account]);

  const [voteSongModalOpen, setOpenVoteSongModalOpen] = useState(false);

  function openVoteSongModal() {
    setOpenVoteSongModalOpen(true);
  }

  function closeVoteSongModal() {
    setOpenVoteSongModalOpen(false);
  }

  const [addSongModalOpen, setAddSongModalOpen] = useState(false);

  function openAddSongModal() {
    setAddSongModalOpen(true);
  }

  function closeAddSongModal() {
    setAddSongModalOpen(false);
  }

  const [moreActionModalOpen, setMoreActionModalOpen] = useState(false);

  function openMoreActionModal() {
    setMoreActionModalOpen(true);
  }

  function closeMoreActionModal() {
    setMoreActionModalOpen(false);
  }

  const { id: topicId } = useParams();
  const { choices, loaded } = useTopic(Number(topicId));
  const toggleWalletModal = useToggleWalletModal();

  const renderConnector = () => {
    return active ? (
      <p data-testid="wallet-connect">Wallet Connected {shortenAddress(account)}</p>
    ) : (
      <button data-testid="wallet-connect" className={'btn-primary btn-large'} onClick={toggleWalletModal}>
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
              src={parseTokenURI(
                song.meta?.image ||
                  'https://bafybeicp7kjqwzzyfuryefv2l5q23exl3dbd6rgmuqzxs3cy6vaa2iekka.ipfs.w3s.link/sample.png',
              )}
              className={'rounded-xl'}
            />
            <div className={'px-2 pt-1'}>
              <p className={'font-bold text-xl'}>{song.meta?.name}</p>
              {song.meta?.attributes && <SongTags attributes={song.meta.attributes} />}
              {song.meta && (
                <p className={'text-dark-gray mt-4'} data-testid={`category-list-item-${song.id}-meta`}>
                  Added by <span className={'text-black font-semibold'}>{song.meta?.created_by}</span> at{' '}
                  {song.meta?.Date}
                </p>
              )}
              <a
                href={`https://opensea.io/assets/${SONGADAY_CONTRACT_ADDRESS}/${song.meta?.token_id}`}
                className={'flex gap-1.5 mt-2'}
              >
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

  // @ts-ignore
  return (
    <div className={'px-24 py-24'}>
      <VoteSongModal closeModal={closeVoteSongModal} open={voteSongModalOpen} />
      <AddSongModal closeModal={closeAddSongModal} open={addSongModalOpen} />
      <Modal
        className={'relative overflow-hidden'}
        title={`What do you want to add?`}
        closeModal={closeMoreActionModal}
        open={moreActionModalOpen}
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
          <header>
            <Input icon={faCircleInfo} placeholder={'Search songs in this category'} onUserInput={() => {}}></Input>
            {/*<Input type="button"></Input>*/}
          </header>
          <main className={'flex flex-wrap gap-6'}>{renderList()}</main>
        </section>
        <aside className={'w-68'}>
          <button
            onClick={openVoteSongModal}
            className={'btn-primary btn-large w-full mb-2'}
            data-testid="open-vote-modal"
          >
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
