import { mainnet, multicall, readContract } from '@wagmi/core';
import { choiceABI, songADayABI, topicABI, useTopicChoicesLength } from 'abis/types/generated';
import axios from 'axios';
import { SONGADAY_CONTRACT_ADDRESS } from 'constants/addresses';
import { useCallback, useEffect, useState } from 'react';
import { parseTokenURI } from 'utils';
import { Address } from 'wagmi';

import { Choice, ChoiceRaw, SongMetadata } from '../types';

// export function useArena() {
//   const arenaContract = useArenaContract();
//
//   const nextTopicIdAndArenaInfoCall = useMemo(() => {
//     return [arenaInterface.encodeFunctionData('getNextTopicId', []), arenaInterface.encodeFunctionData('info', [])];
//   }, []);
//
//   const [nextTopicIdResult, infoResult] = useSingleContractWithCallData(arenaContract, nextTopicIdAndArenaInfoCall);
//
//   const nextTopicId: ContractFunctionReturnType<Arena['callStatic']['getNextTopicId']> | undefined =
//     nextTopicIdResult?.result?.[0];
//   const arenaInfo = infoResult?.result as ContractFunctionReturnType<Arena['callStatic']['info']> | undefined;
//
//   const getTopicsCallInputs = useMemo(() => {
//     const topicIds: number[] = nextTopicId ? Array.from(Array(nextTopicId.toNumber()).keys()) : [];
//     return topicIds.map((id) => [id]);
//   }, [nextTopicId]);
//
//   const getTopicsResult = useSingleContractMultipleData(arenaContract, 'topics', getTopicsCallInputs);
//
//   const topics = useMemo(() => {
//     return getTopicsResult.reduce((acc: TopicStruct[], value) => {
//       if (!value.result) return acc;
//       const result = value.result[0];
//       acc.push({
//         cycleDuration: result[0],
//         startTime: result[1],
//         sharePerCyclePercentage: result[2],
//         prevContributorsFeePercentage: result[3],
//         topicFeePercentage: result[4],
//         maxChoiceFeePercentage: result[5],
//         relativeSupportThreshold: result[6],
//         fundingPeriod: result[7],
//         fundingPercentage: result[8],
//         funds: result[9],
//       });
//       return acc;
//     }, []);
//   }, [getTopicsResult]);
//
//   return { nextTopicId, topics, arenaInfo };
// }

export function useTopic(topicAddress: Address | undefined) {
  const { data: choicesLength } = useTopicChoicesLength({
    address: topicAddress,
  });
  const [choicesRaw, setChoicesRaw] = useState<ChoiceRaw[] | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!topicAddress || choicesLength === undefined) return;
      if (choicesLength === 0n) {
        setChoicesRaw([]);
        return;
      }
      const indexes = Array.from(Array(choicesLength).keys());
      const choiceAddresses = await multicall({
        allowFailure: false,
        contracts: indexes.map((item) => ({
          address: topicAddress,
          abi: topicABI,
          functionName: 'choices',
          args: [BigInt(item)],
        })),
      });
      const metadataURIs = await multicall({
        allowFailure: false,
        contracts: choiceAddresses.map((address) => ({
          address,
          abi: choiceABI,
          functionName: 'metadataURI',
        })),
      });
      setChoicesRaw(
        indexes.map((i) => ({
          id: i,
          metadataURI: metadataURIs[i],
          address: choiceAddresses[i],
        })),
      );
    }

    loadData();
  }, [choicesLength, topicAddress]);

  const [choices, setChoices] = useState<Choice[] | undefined>(undefined);

  const fetchMetadata = useCallback(async (tokenId: string) => {
    const tokenURI = await readContract({
      chainId: mainnet.id,
      abi: songADayABI,
      address: SONGADAY_CONTRACT_ADDRESS,
      functionName: 'tokenURI',
      args: [BigInt(tokenId)],
    });
    const URI = parseTokenURI(tokenURI);
    return (await axios.get<SongMetadata>(URI)).data;
  }, []);

  useEffect(() => {
    if (!choicesRaw) return;
    if (!choices?.length) {
      setChoices(choicesRaw);
      const loadedChoices: Choice[] = [];
      for (const choiceRaw of choicesRaw) {
        fetchMetadata(choiceRaw.metadataURI)
          .then((m) => {
            loadedChoices.push({
              ...choiceRaw,
              meta: m,
            });
          })
          .catch((e) => {
            console.log('load metadata error');
            console.log(e);
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
  }, [choices, choicesRaw, fetchMetadata]);

  return { choices, loaded: choices !== undefined };
}
