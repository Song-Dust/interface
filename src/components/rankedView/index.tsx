import { SONGADAY_CONTRACT_ADDRESS } from 'constants/addresses';
import { useTopicContext } from 'contexts/TopicContext';
import { useArenaTokenData } from 'hooks/useArena';
import React, { useMemo } from 'react';
import { Choice } from 'types';
import { toCompactFormat } from 'utils/number';
import { formatUnits } from 'viem';

const RankedView = ({ choice, onVoteClick }: { choice: Choice; onVoteClick?: () => void }) => {
  const { topicTotalShares } = useTopicContext();
  const { arenaTokenDecimals, arenaTokenSymbol } = useArenaTokenData();

  const parsedChoiceTokensAmount = useMemo(() => {
    return arenaTokenDecimals !== undefined ? formatUnits(choice.tokens, arenaTokenDecimals) : undefined;
  }, [arenaTokenDecimals, choice.tokens]);

  return (
    <div className="flex max-h-fit w-full gap-4">
      <div className="bg-light-gray-2 rounded-xl w-24 flex flex-col justify-center items-center">
        <p className="font-semibold text-[40px] leading-10">{choice.rank}</p>
      </div>
      <div className="bg-light-gray-2 rounded-xl w-full flex px-5 py-3">
        <div className="flex flex-col grow">
          <div className="flex">
            <p className="grow font-semibold text-xl">{choice?.meta?.name || `Could not load name from ipfs`}</p>
            {onVoteClick && (
              <button
                onClick={onVoteClick}
                className={'btn-primary font-semibold px-4 py-2'}
                data-testid="open-vote-modal"
              >
                Vote
              </button>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <p className="font-normal grow flex">
              <span className="text-3xl">
                {topicTotalShares !== undefined &&
                  choice.totalShares !== undefined &&
                  (choice.totalShares === 0n ? '0' : String((choice.totalShares * 100n) / topicTotalShares))}
                %
              </span>
              <span className="text-lg align-middle p-1">
                {toCompactFormat(Number(parsedChoiceTokensAmount))} {arenaTokenSymbol}
              </span>
            </p>
            {choice.meta && (
              <>
                <div className="flex items-center gap-1">
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M5.84802 7.79688C6.22302 7.75 6.55115 7.9375 6.69177 8.26562L8.23865 12.1562V8.54688C8.23865 8.125 8.61365 7.79688 8.98865 7.79688C9.41052 7.79688 9.73865 8.125 9.73865 8.54688V16.0469C9.73865 16.4219 9.50427 16.7031 9.12927 16.7969C8.80115 16.8438 8.42615 16.6562 8.3324 16.3281L6.73865 12.4375V16.0469C6.73865 16.4688 6.41052 16.7969 5.98865 16.7969C5.61365 16.7969 5.23865 16.4688 5.23865 16.0469V8.54688C5.23865 8.17188 5.5199 7.89062 5.84802 7.79688ZM11.2386 8.54688C11.2386 8.125 11.6136 7.79688 11.9886 7.79688H14.2386C14.6605 7.79688 14.9886 8.125 14.9886 8.54688C14.9886 8.96875 14.6605 9.29688 14.2386 9.29688H12.7386V11.5469H14.2386C14.6605 11.5469 14.9886 11.875 14.9886 12.2969C14.9886 12.7188 14.6605 13.0469 14.2386 13.0469H12.7386V16.0469C12.7386 16.4688 12.4105 16.7969 11.9886 16.7969C11.6136 16.7969 11.2386 16.4688 11.2386 16.0469V8.54688ZM19.4886 7.79688C19.9105 7.79688 20.2386 8.125 20.2386 8.54688C20.2386 8.96875 19.9105 9.29688 19.4886 9.29688H18.7386V16.0469C18.7386 16.4688 18.4105 16.7969 17.9886 16.7969C17.6136 16.7969 17.2386 16.4688 17.2386 16.0469V9.29688H16.4886C16.1136 9.29688 15.7386 8.96875 15.7386 8.54688C15.7386 8.125 16.1136 7.79688 16.4886 7.79688H19.4886Z"
                      fill="#565656"
                    />
                    <path
                      opacity="0.4"
                      d="M11.0511 1.09375C12.1293 0.484375 13.3949 0.484375 14.4261 1.09375L21.598 5.21875C22.6761 5.82812 23.2855 6.95312 23.2855 8.17188V16.4219C23.2855 17.6406 22.6761 18.7656 21.598 19.375L14.4261 23.5C13.3949 24.1094 12.1293 24.1094 11.0511 23.5L3.92615 19.375C2.84802 18.7656 2.23865 17.6406 2.23865 16.4219V8.17188C2.23865 6.95312 2.84802 5.82812 3.92615 5.21875L11.0511 1.09375ZM6.69177 8.26562C6.55115 7.9375 6.22302 7.75 5.84802 7.79688C5.5199 7.89062 5.23865 8.17188 5.23865 8.54688V16.0469C5.23865 16.4688 5.61365 16.7969 5.98865 16.7969C6.41052 16.7969 6.73865 16.4688 6.73865 16.0469V12.4375L8.3324 16.3281C8.42615 16.6562 8.80115 16.8438 9.12927 16.7969C9.50427 16.7031 9.73865 16.4219 9.73865 16.0469V8.54688C9.73865 8.125 9.41052 7.79688 8.98865 7.79688C8.61365 7.79688 8.23865 8.125 8.23865 8.54688V12.1562L6.69177 8.26562ZM11.2386 16.0469C11.2386 16.4688 11.6136 16.7969 11.9886 16.7969C12.4105 16.7969 12.7386 16.4688 12.7386 16.0469V13.0469H14.2386C14.6605 13.0469 14.9886 12.7188 14.9886 12.2969C14.9886 11.875 14.6605 11.5469 14.2386 11.5469H12.7386V9.29688H14.2386C14.6605 9.29688 14.9886 8.96875 14.9886 8.54688C14.9886 8.125 14.6605 7.79688 14.2386 7.79688H11.9886C11.6136 7.79688 11.2386 8.125 11.2386 8.54688V16.0469ZM16.4886 7.79688C16.1136 7.79688 15.7386 8.125 15.7386 8.54688C15.7386 8.96875 16.1136 9.29688 16.4886 9.29688H17.2386V16.0469C17.2386 16.4688 17.6136 16.7969 17.9886 16.7969C18.4105 16.7969 18.7386 16.4688 18.7386 16.0469V9.29688H19.4886C19.9105 9.29688 20.2386 8.96875 20.2386 8.54688C20.2386 8.125 19.9105 7.79688 19.4886 7.79688H16.4886Z"
                      fill="#EC2A64"
                    />
                  </svg>
                  <a
                    className="underline text-sm font-semibold"
                    href={`https://opensea.io/assets/${SONGADAY_CONTRACT_ADDRESS}/${choice.meta.token_id}`}
                  >
                    View on Opensea
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <svg width="27" height="19" viewBox="0 0 27 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M25.7644 3.10938C25.4832 1.98438 24.5925 1.09375 23.5144 0.8125C21.4988 0.25 13.53 0.25 13.53 0.25C13.53 0.25 5.5144 0.25 3.49878 0.8125C2.42065 1.09375 1.53003 1.98438 1.24878 3.10938C0.686279 5.07812 0.686279 9.29688 0.686279 9.29688C0.686279 9.29688 0.686279 13.4688 1.24878 15.4844C1.53003 16.6094 2.42065 17.4531 3.49878 17.7344C5.5144 18.25 13.53 18.25 13.53 18.25C13.53 18.25 21.4988 18.25 23.5144 17.7344C24.5925 17.4531 25.4832 16.6094 25.7644 15.4844C26.3269 13.4688 26.3269 9.29688 26.3269 9.29688C26.3269 9.29688 26.3269 5.07812 25.7644 3.10938ZM10.905 13.0938V5.5L17.5613 9.29688L10.905 13.0938Z"
                      fill="#FF0000"
                      fillOpacity="0.5"
                    />
                  </svg>
                  <a className="underline text-sm font-semibold" href={choice.meta.youtube_url}>
                    Watch on Youtube
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankedView;
