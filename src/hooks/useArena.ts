import { mainnet, multicall, readContract } from '@wagmi/core';
import {
  arenaABI,
  choiceABI,
  songADayABI,
  topicABI,
  useArenaChoiceCreationFee,
  useArenaGetTopicsLength,
  useArenaToken,
  useErc20BalanceOf,
  useErc20Decimals,
  useErc20Symbol,
  useTopicChoicesLength,
} from 'abis/types/generated';
import axios from 'axios';
import { ARENA_ADDRESS, SONGADAY_CONTRACT_ADDRESS } from 'constants/addresses';
import { useContractAddress } from 'hooks/useContractAddress';
import { useCallback, useEffect, useState } from 'react';
import { parseTokenURI } from 'utils';
import { Address, useAccount } from 'wagmi';

import { Choice, ChoiceRaw, SongMetadata, Topic, TopicRaw } from '../types';

export function useArena() {
  const arenaAddress = useContractAddress(ARENA_ADDRESS);
  const { data: choiceCreationFee } = useArenaChoiceCreationFee({
    address: arenaAddress,
  });
  return {
    choiceCreationFee,
  };
}

export function useArenaTokenData(topicAddress?: Address) {
  const arenaAddress = useContractAddress(ARENA_ADDRESS);
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

export function useArenaTopics() {
  const arenaAddress = useContractAddress(ARENA_ADDRESS);
  const { data: topicsLength } = useArenaGetTopicsLength({
    address: arenaAddress,
  });
  const [topicsRaw, setTopicsRaw] = useState<TopicRaw[] | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!arenaAddress || topicsLength === undefined) return;
      if (topicsLength === 0n) {
        setTopicsRaw([]);
        return;
      }
      const indexes = Array.from(Array(topicsLength).keys());
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

  return { topicsLength, topics: topicsRaw as Topic[] };
}

export function useTopicChoices(topicAddress: Address | undefined) {
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
      const indexes = Array.from(Array(Number(choicesLength)).keys());
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
      console.log(
        indexes.map((i) => ({
          id: i,
          metadataURI: metadataURIs[i],
          address: choiceAddresses[i],
        })),
      );
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
