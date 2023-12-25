// import {faCheckToSlot, faCoins,faEye,faGuitars,faHourglassClock, faMagnifyingGlass,faPeopleGroup, faSpinnerThird} from '@fortawesome/pro-duotone-svg-icons';
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Input from 'components/basic/input';
import Header from 'components/Header';
import AddChoiceModal from 'components/modal/AddChoiceModal';
import VoteChoiceModal from 'components/modal/VoteChoiceModal';
import RankedView from 'components/rankedView';
import { useTopicContext } from 'contexts/TopicContext';
import { useArenaTokenData } from 'hooks/useArena';
import useTimer from 'hooks/useTimer';
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Choice } from 'types';
import { toCompactFormat } from 'utils/number';
import { formatUnits } from 'viem';

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

const SnapshotTimer = () => {
  const { startTime, cycleDuration, snapshotCycle } = useTopicContext();
  const snapshotTimestamp = useMemo(() => {
    if (startTime === undefined || cycleDuration === undefined || snapshotCycle === undefined) return undefined;
    return Number(startTime + cycleDuration * snapshotCycle);
  }, [cycleDuration, snapshotCycle, startTime]);

  const { days, hours, minutes, seconds } = useTimer(snapshotTimestamp);
  return (
    <section
      className={'days-left rounded-2xl bg-primary-light-2 flex gap-4 py-3 justify-center items-center mt-6 mb-4'}
    >
      {/*<div><FontAwesomeIcon fontSize={36} icon={faHourglassClock} style={style} /></div>*/}
      <svg width="36" height="33" viewBox="0 0 36 33" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18 23.5938C18 18.6562 22 14.5938 27 14.5938C31.9375 14.5938 36 18.6562 36 23.5938C36 28.5938 31.9375 32.5938 27 32.5938C22 32.5938 18 28.5938 18 23.5938ZM27.9375 19.5938C27.9375 19.0938 27.5 18.5938 26.9375 18.5938C26.4375 18.5938 25.9375 19.0938 25.9375 19.5938V23.5938C25.9375 24.1562 26.4375 24.5938 26.9375 24.5938H30C30.5 24.5938 31 24.1562 31 23.5938C31 23.0938 30.5 22.5938 30 22.5938H27.9375V19.5938Z"
          fill="#565656"
        />
        <path
          opacity="0.5"
          d="M0 2.59375C0 1.53125 0.875 0.59375 2 0.59375H22C23.0625 0.59375 24 1.53125 24 2.59375C24 3.71875 23.0625 4.59375 22 4.59375V5.28125C22 7.96875 20.9375 10.5312 19.0625 12.4062L14.8125 16.5938L17.0625 18.8438C16.375 20.2812 16 21.9062 16 23.5938C16 27.3438 17.8125 30.6562 20.625 32.5938H2C0.875 32.5938 0 31.7188 0 30.5938C0 29.5312 0.875 28.5938 2 28.5938V27.9062C2 25.2812 3 22.7188 4.875 20.8438L9.125 16.5938L4.875 12.4062C3 10.5312 2 7.96875 2 5.28125V4.59375C0.875 4.59375 0 3.71875 0 2.59375ZM6 4.59375V5.28125C6 6.46875 6.3125 7.65625 6.9375 8.59375H17C17.625 7.65625 18 6.46875 18 5.28125V4.59375H6Z"
          fill="#EC2A64"
        />
      </svg>
      <div>
        <div className="flex gap-2 items-center">
          <h2 className="tracking-wider font-bold">
            {days}:{hours}:{minutes}:{seconds}
          </h2>
        </div>
        <p className={'font-semibold'}>Left untill the snapshot</p>
      </div>
    </section>
  );
};

const Topic = () => {
  const { competitionAddress } = useParams();
  const [selectedChoiceToVote, setSelectedChoiceToVote] = useState<Choice | undefined>(undefined);

  const [addChoiceModalOpen, setAddChoiceModalOpen] = useState(false);

  function openAddChoiceModal() {
    setAddChoiceModalOpen(true);
  }

  function closeAddChoiceModal() {
    setAddChoiceModalOpen(false);
  }

  const { arenaTokenSymbol, arenaTokenDecimals } = useArenaTokenData();
  const { choices, metadata, currentCycleNumber, topicTokens } = useTopicContext();

  const parsedTopicTokensAmount = useMemo(() => {
    if (topicTokens === undefined || arenaTokenDecimals === undefined) return undefined;
    return formatUnits(topicTokens, arenaTokenDecimals);
  }, [arenaTokenDecimals, topicTokens]);

  const [filterString, setFilterString] = useState('');
  const choicesFilteredAndSorted = useMemo(() => {
    const choicesFiltered = filterString
      ? choices?.filter((choice) => choice.meta?.name.toLowerCase().includes(filterString.toLowerCase()))
      : choices;
    if (!choicesFiltered || choicesFiltered.some((choice) => choice.totalShares === undefined)) return undefined;
    return choicesFiltered?.sort((a, b) => Number(b.totalShares - a.totalShares));
  }, [choices, filterString]);

  return (
    <div className={'px-24 py-12'}>
      <Header />
      {competitionAddress && (
        <VoteChoiceModal
          closeModal={() => setSelectedChoiceToVote(undefined)}
          open={selectedChoiceToVote !== undefined}
          choice={selectedChoiceToVote}
        />
      )}
      <AddChoiceModal closeModal={closeAddChoiceModal} open={addChoiceModalOpen} />

      <header className={'bg-gradient-light w-full h-fit rounded-3xl flex px-8 py-6 mb-12 mt-16 relative'}>
        <div className="max-w-[80%]">
          <h1>{metadata?.title || '...'}</h1>
          <p className={'text-label py-3'}>{metadata?.description || '...'}</p>
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
                placeholder={'Search songs in this category'}
                value={filterString}
                onUserInput={setFilterString}
              ></Input>
            </div>
          </header>
          <main className={'flex flex-wrap gap-6'}>
            {choicesFilteredAndSorted?.map((choice, index) => (
              <RankedView
                key={choice.address}
                choice={choice}
                onVoteClick={competitionAddress ? () => setSelectedChoiceToVote(choice) : undefined}
              />
            ))}
          </main>
        </section>
        <aside className={'w-64'}>
          {competitionAddress && <SnapshotTimer />}
          <section className={'topic-info rounded-2xl bg-primary-light-2 flex flex-col gap-6 px-6 pt-6 mb-4 pb-7'}>
            <div className={'flex gap-3 flex-col'}>
              <label className={'font-semibold'}>Category&apos;s General Stats</label>
              <section className={'flex gap-4'}>
                <div className={'rounded-xl bg-yellowC flex flex-col justify-center items-center w-24 h-24'}>
                  {/*<FontAwesomeIcon fontSize={24} icon={faPeopleGroup} style={monoStyle} />*/}
                  <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18 4.5C18 6.1875 16.6406 7.5 15 7.5C13.3125 7.5 12 6.1875 12 4.5C12 2.85938 13.3125 1.5 15 1.5C16.6406 1.5 18 2.85938 18 4.5ZM18 21C18 21.8438 17.2969 22.5 16.5 22.5H13.5C12.6562 22.5 12 21.8438 12 21V19.0312C10.2188 18.1875 9 16.3594 9 14.25C9 11.3906 11.3438 9 14.25 9H15.75C18.6094 9 21 11.3906 21 14.25C21 16.3594 19.7344 18.1875 18 19.0312V21ZM12 12.2812C11.5312 12.7969 11.25 13.5 11.25 14.25C11.25 15.0469 11.5312 15.75 12 16.2656V12.2812ZM18.75 14.25C18.75 13.5 18.4219 12.7969 18 12.2812V16.2656C18.4219 15.7031 18.75 15.0469 18.75 14.25Z"
                      fill="#353535"
                    />
                    <path
                      opacity="0.4"
                      d="M3 4.5C3 2.85938 4.3125 1.5 6 1.5C7.64062 1.5 9 2.85938 9 4.5C9 6.1875 7.64062 7.5 6 7.5C4.3125 7.5 3 6.1875 3 4.5ZM9 18.5156V21C9 21.8438 8.29688 22.5 7.5 22.5H4.5C3.65625 22.5 3 21.8438 3 21V19.0312C1.21875 18.1875 0 16.3594 0 14.25C0 11.3906 2.34375 9 5.25 9H6.75C7.64062 9 8.53125 9.28125 9.28125 9.70312C8.15625 10.875 7.5 12.5156 7.5 14.25C7.5 15.8906 8.01562 17.3438 9 18.5156ZM3 16.2656V12.2812C2.53125 12.7969 2.25 13.5 2.25 14.25C2.25 15.0469 2.53125 15.75 3 16.2656ZM21 18.5156C21.9375 17.3438 22.5 15.8906 22.5 14.25C22.5 12.5156 21.7969 10.875 20.6719 9.70312C21.4219 9.28125 22.3125 9 23.25 9H24.75C27.6094 9 30 11.3906 30 14.25C30 16.3594 28.7344 18.1875 27 19.0312V21C27 21.8438 26.2969 22.5 25.5 22.5H22.5C21.6562 22.5 21 21.8438 21 21V18.5156ZM27.75 14.25C27.75 13.5 27.4219 12.7969 27 12.2812V16.2656C27.4219 15.7031 27.75 15.0469 27.75 14.25ZM21 4.5C21 2.85938 22.3125 1.5 24 1.5C25.6406 1.5 27 2.85938 27 4.5C27 6.1875 25.6406 7.5 24 7.5C22.3125 7.5 21 6.1875 21 4.5Z"
                      fill="#193154"
                    />
                  </svg>
                  <h2 className={'font-bold'}>
                    {parsedTopicTokensAmount !== undefined ? toCompactFormat(Number(parsedTopicTokensAmount)) : '...'}
                  </h2>
                  <p className={'font-normal text-sm'}>{arenaTokenSymbol} casted</p>
                </div>
                <div className={'rounded-xl bg-greenC flex-col flex justify-center items-center w-24 h-24'}>
                  {/*<FontAwesomeIcon fontSize={24} icon={faSpinnerThird} style={monoStyle} />*/}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10.5 1.5C10.5 0.703125 11.1562 0 12 0C18.6094 0 24 5.39062 24 12C24 14.2031 23.3906 16.2656 22.3594 18C21.9375 18.75 21.0469 18.9844 20.2969 18.5625C19.5938 18.1406 19.3594 17.25 19.7812 16.5C20.5312 15.1875 21 13.6406 21 12C21 7.03125 16.9688 3 12 3C11.1562 3 10.5 2.34375 10.5 1.5Z"
                      fill="#353535"
                    />
                    <path
                      opacity="0.4"
                      d="M11.9531 3C6.98438 3 2.95312 7.03125 2.95312 12C2.95312 16.9688 6.98438 21 11.9531 21C15.2812 21 18.1406 19.2656 19.6875 16.6406H19.7344C19.4062 17.3438 19.6406 18.1875 20.2969 18.5625C21.0469 18.9844 21.9375 18.75 22.3594 18H22.4062C20.3438 21.6094 16.4531 24 12 24C5.34375 24 0 18.6562 0 12C0 5.39062 5.34375 0 12 0C11.1562 0 10.5 0.703125 10.5 1.5C10.5 2.34375 11.1562 3 12 3H11.9531Z"
                      fill="#193154"
                    />
                  </svg>
                  <h2 className={'font-bold'}>{String(currentCycleNumber) ?? '...'}</h2>
                  <p className={'font-normal text-sm'}>Cycles past</p>
                </div>
              </section>
            </div>
          </section>
          <button onClick={openAddChoiceModal} className={'btn-primary-inverted btn-large w-full'}>
            Add Song
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

export default Topic; /* Rectangle 18 */
