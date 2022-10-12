// import PropTypes from 'prop-types';
import { Transition } from '@headlessui/react';
import { useWeb3React } from '@web3-react/core';
import algoliasearch from 'algoliasearch/lite';
import Modal, { ModalPropsInterface } from 'components/modal/index';
import SongMiniCard from 'components/song/SongMiniCard';
import useWalletActivation from 'hooks/useWalletActivation';
import React, { Fragment, useMemo, useState } from 'react';
import { InstantSearch, SearchBox, useHits } from 'react-instantsearch-hooks-web';

import { SongMetadata } from '../../types';

const AddSongModal = (props: ModalPropsInterface) => {
  const { account } = useWeb3React();
  const active = useMemo(() => !!account, [account]);
  const { tryActivation } = useWalletActivation();

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
