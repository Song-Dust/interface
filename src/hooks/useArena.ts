import { multicall } from '@wagmi/core';
import {
  arenaABI,
  topicABI,
  useArenaChoiceCreationFee,
  useArenaGetTopicsLength,
  useArenaToken,
  useArenaTopicCreationFee,
  useErc20BalanceOf,
  useErc20Decimals,
  useErc20Symbol,
} from 'abis/types/generated';
import axios from 'axios';
import { ARENA_ADDRESS_MAP } from 'constants/addresses';
import { useContractAddress } from 'hooks/useContractAddress';
import { useEffect, useState } from 'react';
import { parsePinataIpfsUri } from 'utils';
import { useAccount } from 'wagmi';

import { Topic, TopicMetadata, TopicRaw } from '../types';

export function useArena() {
  const arenaAddress = useContractAddress(ARENA_ADDRESS_MAP);
  const { data: choiceCreationFee } = useArenaChoiceCreationFee({
    address: arenaAddress,
  });
  const { data: topicCreationFee } = useArenaTopicCreationFee({
    address: arenaAddress,
  });
  return {
    topicCreationFee,
    choiceCreationFee,
  };
}

export function useArenaTokenData() {
  const arenaAddress = useContractAddress(ARENA_ADDRESS_MAP);
  const { address } = useAccount();
  const { data: arenaTokenAddress } = useArenaToken({
    address: arenaAddress,
  });
  const { data: arenaTokenSymbol } = useErc20Symbol({
    address: arenaTokenAddress,
  });
  const { data: arenaTokenDecimals } = useErc20Decimals({
    address: arenaTokenAddress,
  });
  const { data: arenaTokenBalance } = useErc20BalanceOf({
    address: arenaTokenAddress,
    args: address ? [address] : undefined,
  });
  return {
    arenaTokenBalance,
    arenaTokenAddress,
    arenaTokenSymbol,
    arenaTokenDecimals,
  };
}

export function useArenaTopicData() {
  const arenaAddress = useContractAddress(ARENA_ADDRESS_MAP);
  const { data: topicsLength } = useArenaGetTopicsLength({
    address: arenaAddress,
    watch: true,
  });
  const [topicsRaw, setTopicsRaw] = useState<TopicRaw[] | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!arenaAddress || topicsLength === undefined) return;
      console.log({ topicsLength });
      if (topicsLength === 0n) {
        setTopicsRaw([]);
        return;
      }
      const indexes = Array.from(Array(Number(topicsLength)).keys());
      const topicAddresses = await multicall({
        allowFailure: false,
        contracts: indexes.map((item) => ({
          address: arenaAddress,
          abi: arenaABI,
          functionName: 'topics',
          args: [BigInt(item)],
        })),
      });
      const metadataURIs = await multicall({
        allowFailure: false,
        contracts: topicAddresses.map((address) => ({
          address,
          abi: topicABI,
          functionName: 'metadataURI',
        })),
      });
      console.log(
        indexes.map((i) => ({
          id: i,
          metadataURI: metadataURIs[i],
          address: topicAddresses[i],
        })),
      );
      setTopicsRaw(
        indexes.map((i) => ({
          id: i,
          metadataURI: metadataURIs[i],
          address: topicAddresses[i],
        })),
      );
    }

    loadData();
  }, [topicsLength, arenaAddress]);

  const [topics, setTopics] = useState<Topic[] | undefined>(undefined);
  useEffect(() => {
    if (!topicsRaw || topics?.length === topicsRaw?.length) return;
    setTopics(topicsRaw);
    const loadedTopics: Topic[] = [];
    for (const topicRaw of topicsRaw) {
      axios
        .get<TopicMetadata>(parsePinataIpfsUri(topicRaw.metadataURI))
        .then((res) => {
          loadedTopics.push({
            ...topicRaw,
            meta: res.data,
          });
        })
        .catch((e) => {
          console.log('load metadata error');
          console.log(e);
          loadedTopics.push(topicRaw);
        })
        .finally(() => {
          if (loadedTopics.length === topicsRaw.length) {
            loadedTopics.sort((a, b) => a.id - b.id);
            setTopics(loadedTopics);
          }
        });
    }
  }, [topics, topicsRaw]);

  return { topicsLength, topics, loaded: topics !== undefined };
}
