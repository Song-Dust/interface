// import {faCheckToSlot, faCoins,faEye,faGuitars,faHourglassClock, faMagnifyingGlass,faPeopleGroup, faSpinnerThird} from '@fortawesome/pro-duotone-svg-icons';
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Input from 'components/basic/input';
import Header from 'components/Header';
import Spinner from 'components/loadingSpinner';
import AddTopicModal from 'components/modal/AddTopicModal';
import TopicCard from 'components/TopicCard';
import { useArenaTopicData } from 'hooks/useArena';
import React, { useMemo, useState } from 'react';

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

const Arena = () => {
  const [addTopicModalOpen, setAddTopicModalOpen] = useState(false);

  function openAddTopicModal() {
    setAddTopicModalOpen(true);
  }

  function closeAddTopicModal() {
    setAddTopicModalOpen(false);
  }

  const { topics } = useArenaTopicData();

  const [filterString, setFilterString] = useState('');
  const topicsFiltered = useMemo(
    () => topics?.filter((topic) => topic.meta?.title.includes(filterString)),
    [topics, filterString],
  );

  function renderList() {
    return topicsFiltered !== undefined ? (
      topicsFiltered.map((topic) => {
        return topic.meta ? (
          <TopicCard key={topic.id} topic={topic} />
        ) : (
          <div
            key={topic.id}
            className={'bg-squircle w-[311px] h-[316px] bg-cover p-4'}
            data-testid={`topic-list-item-${topic.id}`}
          >
            <Spinner classes="h-full items-center" />
          </div>
        );
      })
    ) : (
      <Spinner />
    );
  }

  // @ts-ignore
  return (
    <div className={'px-24 py-12'}>
      <Header />
      <AddTopicModal closeModal={closeAddTopicModal} open={addTopicModalOpen} />
      <header className={'bg-gradient-light w-full h-fit rounded-3xl flex px-8 py-6 mb-12 mt-16 relative'}>
        <div className="max-w-[80%]">
          <h1>SongADAO</h1>
          <p className={'text-label py-3'}>
            Description of what this site does
            <br />
            Ranking songs
          </p>
        </div>
        <img alt="header" src={'/category-header.png'} className="absolute bottom-0 right-0 max-w-[240px]" />
      </header>
      <main className={'flex gap-8'}>
        <section className={'flex-1'}>
          <header className={'mb-8 flex gap-4 justify-between'}>
            <div className="flex w-full justify-between">
              <Input
                className={'w-104'}
                icon={
                  <svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M26.6544 26.2868L20.2574 19.8897C19.4577 21.1158 18.4449 22.1287 17.2721 22.9283L23.6158 29.3254C24.4687 30.125 25.8015 30.125 26.6544 29.3254C27.454 28.4724 27.454 27.1397 26.6544 26.2868Z"
                      fill="#353535"
                    />
                    <path
                      opacity="0.4"
                      d="M11.0349 2.61765C4.95772 2.61765 0 7.62868 0 13.7059C0 19.8364 4.95772 24.7941 11.0349 24.7941C17.1121 24.7941 22.1232 19.8364 22.1232 13.7059C22.1232 7.62868 17.1654 2.61765 11.0349 2.61765ZM11.0349 20.5294C7.25 20.5294 4.2114 17.4908 4.2114 13.7059C4.2114 9.97427 7.25 6.88235 11.0349 6.88235C14.7665 6.88235 17.8585 9.97427 17.8585 13.7059C17.8585 17.4908 14.8199 20.5294 11.0349 20.5294Z"
                      fill="#EC2A64"
                    />
                  </svg>
                }
                placeholder={'Search categories'}
                value={filterString}
                onUserInput={setFilterString}
              ></Input>
              <button
                className="btn-primary btn-large mb-2"
                onClick={openAddTopicModal}
                onClickCapture={closeAddTopicModal}
              >
                Add Category
              </button>
            </div>
          </header>
          <main className={'flex flex-wrap gap-6'}>{renderList()}</main>
        </section>
      </main>
    </div>
  );
};

export default Arena; /* Rectangle 18 */
