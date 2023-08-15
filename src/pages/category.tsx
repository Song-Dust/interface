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
          <div className='bg-neutral-200 rounded-xl flex w-full items-center px-3 gap-2'>
            <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25.5 17.0695C25.5 20.1945 22.9609 22.6945 19.875 22.6945C16.75 22.6945 14.25 20.1945 14.25 17.0695C14.25 13.9835 16.75 11.4445 19.875 11.4445C22.9609 11.4445 25.5 13.9835 25.5 17.0695ZM19.25 14.5695V16.4445H17.375C17.0234 16.4445 16.75 16.757 16.75 17.0695C16.75 17.421 17.0234 17.6945 17.375 17.6945H19.25V19.5695C19.25 19.921 19.5234 20.1945 19.875 20.1945C20.1875 20.1945 20.5 19.921 20.5 19.5695V17.6945H22.375C22.6875 17.6945 23 17.421 23 17.0695C23 16.757 22.6875 16.4445 22.375 16.4445H20.5V14.5695C20.5 14.257 20.1875 13.9445 19.875 13.9445C19.5234 13.9445 19.25 14.257 19.25 14.5695Z" fill="#353535" />
              <path opacity="0.4" d="M3 22.6945C1.59375 22.6945 0.5 21.6007 0.5 20.1945V11.4445C0.5 10.0773 1.59375 8.94446 3 8.94446H18C18.8984 8.94446 19.7188 9.45227 20.1484 10.2335C20.0703 10.2335 19.9531 10.1945 19.875 10.1945C16.0469 10.1945 13 13.2804 13 17.0695C13 19.4132 14.1328 21.4835 15.8906 22.6945H3ZM17.6875 7.69446H3.3125C2.76562 7.69446 2.375 7.30383 2.375 6.75696C2.375 6.24915 2.76562 5.81946 3.3125 5.81946H17.6875C18.1953 5.81946 18.625 6.24915 18.625 6.75696C18.625 7.30383 18.1953 7.69446 17.6875 7.69446ZM15.8125 4.56946H5.1875C4.64062 4.56946 4.25 4.17883 4.25 3.63196C4.25 3.12415 4.64062 2.69446 5.1875 2.69446H15.8125C16.3203 2.69446 16.75 3.12415 16.75 3.63196C16.75 4.17883 16.3203 4.56946 15.8125 4.56946Z" fill="#EC2A64" />
            </svg>
            <button className='py-3 text-start text-base font-semibold text-black'>new category</button>
          </div>
          <div className='bg-neutral-200 rounded-xl flex w-full items-center px-3 gap-2'>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.25 16.375C23.25 19.5 20.7109 22 17.625 22C14.5 22 12 19.5 12 16.375C12 13.2891 14.5 10.75 17.625 10.75C20.7109 10.75 23.25 13.2891 23.25 16.375ZM17 13.875V15.75H15.125C14.7734 15.75 14.5 16.0625 14.5 16.375C14.5 16.7266 14.7734 17 15.125 17H17V18.875C17 19.2266 17.2734 19.5 17.625 19.5C17.9375 19.5 18.25 19.2266 18.25 18.875V17H20.125C20.4375 17 20.75 16.7266 20.75 16.375C20.75 16.0625 20.4375 15.75 20.125 15.75H18.25V13.875C18.25 13.5625 17.9375 13.25 17.625 13.25C17.2734 13.25 17 13.5625 17 13.875Z" fill="#353535" />
              <path opacity="0.4" d="M15.75 3.25C17.1172 3.25 18.25 4.38281 18.25 5.75V9.53906C18.0156 9.53906 17.8203 9.5 17.625 9.5C16.8047 9.5 16.0625 9.65625 15.3594 9.89062C14.5 7.46875 12.1953 5.75 9.46094 5.75C6.02344 5.75 3.21094 8.5625 3.21094 12C3.21094 15.4766 6.02344 18.25 9.46094 18.25C9.96875 18.25 10.4766 18.2109 10.9453 18.0938C11.1797 19.1094 11.6484 20.0078 12.3125 20.75H3.25C1.84375 20.75 0.75 19.6562 0.75 18.25V5.75C0.75 4.38281 1.84375 3.25 3.25 3.25H15.75ZM10.7109 12C10.7109 12.7031 10.1641 13.25 9.46094 13.25C8.79688 13.25 8.21094 12.7031 8.21094 12C8.21094 11.3359 8.79688 10.75 9.46094 10.75C10.1641 10.75 10.7109 11.3359 10.7109 12Z" fill="#EC2A64" />
            </svg>
            <button className='py-3 text-start text-base font-semibold text-black' onClick={openAddSongModal} onClickCapture={closeMoreActionModal} >new Song-a-day song</button>
          </div>
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
              onUserInput={() => { }}
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
              onUserInput={() => { }}
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
