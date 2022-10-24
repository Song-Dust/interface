import ArenaJson from '@attentionstreams/contracts/artifacts/contracts/main/Arena.sol/Arena.json';
import { Interface } from '@ethersproject/abi';
import { useArenaContract, useSongadayContract } from 'hooks/useContract';
import { useSingleContractMultipleData, useSingleContractWithCallData } from 'lib/hooks/multicall';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { parseTokenURI } from 'utils';

import { Choice } from '../types';
import { Arena, TopicStruct } from '../types/contracts/Arena';

const { abi: ArenaABI } = ArenaJson;
const arenaInterface = new Interface(ArenaABI);

export type ContractFunctionReturnType<T> = T extends (...args: any) => Promise<infer R>
  ? // TODO: handle struct return type
    R extends void
    ? void
    : R
  : any;

export function useArena() {
  const arenaContract = useArenaContract();

  const nextTopicIdAndArenaInfoCall = useMemo(() => {
    return [arenaInterface.encodeFunctionData('nextTopicId', []), arenaInterface.encodeFunctionData('info', [])];
  }, []);

  const [nextTopicIdResult, infoResult] = useSingleContractWithCallData(arenaContract, nextTopicIdAndArenaInfoCall);

  const nextTopicId: ContractFunctionReturnType<Arena['callStatic']['nextTopicId']> | undefined =
    nextTopicIdResult?.result?.[0];
  const arenaInfo = infoResult?.result as ContractFunctionReturnType<Arena['callStatic']['info']> | undefined;

  const getTopicsCallInputs = useMemo(() => {
    const topicIds: number[] = nextTopicId ? Array.from(Array(nextTopicId.toNumber()).keys()) : [];
    return topicIds.map((id) => [id]);
  }, [nextTopicId]);

  const getTopicsResult = useSingleContractMultipleData(arenaContract, 'topics', getTopicsCallInputs);

  const topics = useMemo(() => {
    return getTopicsResult.reduce((acc: TopicStruct[], value) => {
      if (!value.result) return acc;
      const result = value.result[0];
      acc.push({
        cycleDuration: result[0],
        startBlock: result[1],
        sharePerCyclePercentage: result[2],
        prevContributorsFeePercentage: result[3],
        topicFeePercentage: result[4],
        maxChoiceFeePercentage: result[5],
        relativeSupportThreshold: result[6],
        fundingPeriod: result[7],
        fundingPercentage: result[8],
        funds: result[9],
        metaDataUrl: result[10],
      });
      return acc;
    }, []);
  }, [getTopicsResult]);

  return { nextTopicId, topics, arenaInfo };
}

export function useTopic(topicId: number) {
  const arenaContract = useArenaContract();
  const nextChoiceIdCall = useMemo(() => {
    return [arenaInterface.encodeFunctionData('nextChoiceId', [topicId])];
  }, [topicId]);

  const [nextChoiceIdResult] = useSingleContractWithCallData(arenaContract, nextChoiceIdCall);

  const nextChoiceId: ContractFunctionReturnType<Arena['callStatic']['nextChoiceId']> | null =
    nextChoiceIdResult?.result?.[0];

  const getChoicesCallInputs = useMemo(() => {
    const choiceIds: number[] = nextChoiceId ? Array.from(Array(nextChoiceId.toNumber()).keys()) : [];
    return choiceIds.map((id) => [topicId, id]);
  }, [nextChoiceId, topicId]);

  const getChoicesResult = useSingleContractMultipleData(arenaContract, 'topicChoices', getChoicesCallInputs);
  const choicesRaw = useMemo(() => {
    return getChoicesResult.reduce((acc: Choice[], value, i) => {
      if (!value.result) return acc;
      const result = value.result[0];
      acc.push({
        id: i,
        description: result[0],
        funds: result[1],
        feePercentage: result[2],
        fundingTarget: result[3],
        metaDataUrl: result[4],
      });
      return acc;
    }, []);
  }, [getChoicesResult]);

  const [choices, setChoices] = useState<Choice[]>([]);

  const songadayContract = useSongadayContract();
  const fetchMetadata = useCallback(
    async (tokenId: string) => {
      if (!songadayContract) throw new Error('contract not loaded');
      try {
        const tokenURI = await songadayContract.tokenURI(tokenId);
        const URI = parseTokenURI(tokenURI);
        const response = await fetch(URI);
        const songmeta = await response.json();
        return songmeta;
      } catch (e) {
        console.log('metaData fatch error', e);
      }
    },
    [songadayContract],
  );

  useEffect(() => {
    if (!choices.length) {
      setChoices(choicesRaw);
      const loadedChoices: Choice[] = [];
      for (const choiceRaw of choicesRaw) {
        fetchMetadata(choiceRaw.metaDataUrl)
          .then((m) => {
            loadedChoices.push({
              ...choiceRaw,
              meta: m,
            });
          })
          .catch((_e) => {
            loadedChoices.push(choiceRaw);
          })
          .finally(() => {
            if (loadedChoices.length === choicesRaw.length) {
              loadedChoices.sort((a, b) => a.id - b.id);
              setChoices(loadedChoices);
            }
          });
      }
    }
  }, [choices.length, choicesRaw, fetchMetadata]);

  const nextChoiceIdLoaded = nextChoiceIdResult && !nextChoiceIdResult.loading;
  const topicsLoaded =
    nextChoiceId?.toNumber() === 0 ||
    (getChoicesResult.length > 0 && !getChoicesResult.some((callState) => callState.loading));
  const loaded = nextChoiceIdLoaded && topicsLoaded;

  return { nextChoiceId, choicesRaw, choices, loaded };
}
