// import {faCheckToSlot, faCoins,faEye,faGuitars,faHourglassClock, faMagnifyingGlass,faPeopleGroup, faSpinnerThird} from '@fortawesome/pro-duotone-svg-icons';
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { useWeb3React } from '@web3-react/core';
import Input from 'components/basic/input';
import Modal from 'components/modal';
import AddSongModal from 'components/modal/AddSongModal';
import VoteSongModal from 'components/modal/VoteSongModal';
import SongCard from 'components/song/SongCard';
import { useTopic } from 'hooks/useArena';
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToggleWalletModal } from 'state/application/hooks';
import { shortenAddress } from 'utils/index';

// const style = {
//   '--fa-primary-color': '#353535',
//   '--fa-secondary-color': '#EF476F',
//   '--fa-primary-opacity': 1,
//   '--fa-secondary-opacity': 0.4
// } as React.CSSProperties;
//
// const monoStyle = {
//   '--fa-primary-color': '#353535',
//   '--fa-secondary-color': '#193154',
//   '--fa-primary-opacity': 1,
//   '--fa-secondary-opacity': 0.4
// } as React.CSSProperties;

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
        return song.meta ? (
          <SongCard key={song.id} songMeta={song.meta} id={song.id} />
        ) : (
          <div className={'bg-squircle w-[311px] h-[316px] bg-cover p-4'} data-testid={`category-list-item-${song.id}`}>
            loading...
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
        className={'absolute right-0 overflow-hidden bottom-44 w-64'}
        title={`What do you want to add?`}
        closeModal={closeMoreActionModal}
        open={moreActionModalOpen}
      >
        <main className={'flex flex-wrap gap-6 flex-col items-start mt-4'}>
          <button className='bg-neutral-200 rounded-xl w-full py-3 text-start text-lg font-semibold text-black'>new category</button>
          <button className='bg-neutral-200 rounded-xl w-full py-3 text-start text-lg font-semibold text-black' onClick={openAddSongModal} onClickCapture={closeMoreActionModal} >new Song-a-day song</button>
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
      <main className={'flex gap-8'}>
        <section className={'flex-1'}>
          <header className={'mb-8 flex gap-4 justify-between'}>
            <Input
              className={'w-104'}
              icon={
                undefined
                // faMagnifyingGlass
              }
              placeholder={'Search songs in this category'}
              onUserInput={() => {}}
            ></Input>
            <Input
              type={'submit'}
              className={'basis-52'}
              icon={
                undefined
                // faEye
              }
              toggle
              toggleLabel={'Default View'}
              onUserInput={() => {}}
            ></Input>
            {/*<Input type="button"></Input>*/}
          </header>
          <main className={'flex flex-wrap gap-6'}>{renderList()}</main>
        </section>
        <aside className={'w-64'}>
          <button
            onClick={openVoteSongModal}
            className={'btn-primary btn-large w-full mb-2'}
            data-testid="open-vote-modal"
          >
            Vote for a Song!
          </button>
          <section
            className={'days-left rounded-2xl bg-primary-light-2 flex gap-4 py-3 justify-center items-center mt-6 mb-4'}
          >
            {/*<div><FontAwesomeIcon fontSize={36} icon={faHourglassClock} style={style} /></div>*/}
            <div>
              <h2 className={'font-bold'}>24 Days</h2>
              <p className={'font-semibold'}>Left untill the snapshot</p>
            </div>
          </section>
          <section className={'category-info rounded-2xl bg-primary-light-2 flex flex-col gap-6 px-6 pt-6 mb-4 pb-7'}>
            <div className={'flex gap-3 flex-col'}>
              <label className={'font-semibold'}>Category&apos;s General Stats</label>
              <div className={'rounded-xl bg-g1 flex gap-4 py-4 px-5 justify-between items-center'}>
                {/*<div><FontAwesomeIcon fontSize={42} icon={faCheckToSlot} style={monoStyle} /></div>*/}
                <div className={''}>
                  <h1 className={'font-bold'}>2.25k</h1>
                  <p className={'font-semibold relative -mt-2'}>SONG casted</p>
                </div>
              </div>
              <section className={'flex gap-4'}>
                <div className={'rounded-xl bg-yellowC flex flex-col justify-center items-center w-24 h-24'}>
                  {/*<FontAwesomeIcon fontSize={24} icon={faPeopleGroup} style={monoStyle} />*/}
                  <h2 className={'font-bold'}>3</h2>
                  <p className={'font-normal text-sm'}>Participants</p>
                </div>
                <div className={'rounded-xl bg-greenC flex-col flex justify-center items-center w-24 h-24'}>
                  {/*<FontAwesomeIcon fontSize={24} icon={faSpinnerThird} style={monoStyle} />*/}
                  <h2 className={'font-bold'}>32/50</h2>
                  <p className={'font-normal text-sm'}>Cycles past</p>
                </div>
              </section>
            </div>
            <div className={'flex gap-3 flex-col'}>
              <label className={'font-semibold'}>Your stats in this category</label>
              <div className={'rounded-xl bg-g1 flex gap-4 py-4 px-5 justify-between items-center'}>
                {/*<div><FontAwesomeIcon fontSize={42} icon={faCoins} style={monoStyle} /></div>*/}
                <div className={''}>
                  <h1 className={'font-bold'}>2.73</h1>
                  <p className={'font-semibold relative -mt-2'}>SONG earned</p>
                </div>
              </div>
              <section className={'flex gap-4'}>
                <div className={'rounded-xl bg-yellowC flex flex-col justify-center items-center w-24 h-24'}>
                  {/*<FontAwesomeIcon fontSize={24} icon={faGuitars} style={monoStyle} />*/}
                  <h2 className={'font-bold'}>3</h2>
                  <p className={'font-normal text-sm'}>Song voted</p>
                </div>
                <div className={'rounded-xl bg-greenC flex-col flex justify-center items-center w-24 h-24'}>
                  {/*<FontAwesomeIcon fontSize={24} icon={faCheckToSlot} style={monoStyle} />*/}
                  <h2 className={'font-bold'}>240</h2>
                  <p className={'font-normal text-sm'}>SONG casted</p>
                </div>
              </section>
            </div>
          </section>
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
