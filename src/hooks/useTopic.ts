import { multicall } from '@wagmi/core';
import {
  choiceABI,
  topicABI,
  useTopicChoicesLength,
  useTopicCurrentCycleNumber,
  useTopicMetadataUri,
} from 'abis/types/generated';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Choice, ChoiceMetadata, ChoiceRaw, TopicMetadata } from 'types';
import { parseIpfsUri, parsePinataIpfsUri } from 'utils';
import { Address, useBlockNumber } from 'wagmi';

export function useTopic(topicAddress: Address | undefined) {
  const { data: metaDataUri } = useTopicMetadataUri({
    address: topicAddress,
  });
  const [metadata, setMetadata] = useState<TopicMetadata | undefined>(undefined);

  const { data: currentCycleNumber } = useTopicCurrentCycleNumber({
    address: topicAddress,
  });

  useEffect(() => {
    if (metaDataUri) {
      axios.get<TopicMetadata>(parsePinataIpfsUri(metaDataUri)).then((res) => {
        setMetadata(res.data);
      });
    }
  }, [metaDataUri]);

  return {
    currentCycleNumber,
    metaDataUri,
    metadata,
  };
}

export function useTopicChoicesData(topicAddress: Address | undefined) {
  const { data: choicesLength } = useTopicChoicesLength({
    address: topicAddress,
    watch: true,
  });
  const { data: blockNumber } = useBlockNumber();
  const [choicesRaw, setChoicesRaw] = useState<ChoiceRaw[] | undefined>(undefined);

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
      setChoicesRaw(
        indexes.map((i) => ({
          id: i,
          address: choiceAddresses[i],
        })),
      );
    }

    loadData();
  }, [choicesLength, topicAddress]);

  const [choiceMetadatas, setChoiceMetadatas] = useState<(ChoiceMetadata | undefined)[] | undefined>(undefined);
  useEffect(() => {
    if (!choicesRaw) return;
    multicall({
      allowFailure: false,
      contracts: choicesRaw.map((choiceRaw) => ({
        address: choiceRaw.address,
        abi: choiceABI,
        functionName: 'metadataURI',
      })),
    }).then((metadataURIs) => {
      Promise.all(
        metadataURIs.map(
          (metadataURI) =>
            new Promise<ChoiceMetadata | undefined>((resolve, reject) => {
              axios
                .get<ChoiceMetadata>(parseIpfsUri(metadataURI))
                .then((res) => resolve(res.data))
                .catch((e) => {
                  console.log('load metadata error');
                  console.log(e);
                  resolve(undefined);
                });
            }),
        ),
      ).then((metadatas) => setChoiceMetadatas(metadatas));
    });
  }, [choicesRaw]);

  const [choiceTotalShares, setChoiceTotalShares] = useState<bigint[] | undefined>(undefined);
  const [choiceTokens, setChoiceTokens] = useState<bigint[] | undefined>(undefined);
  useEffect(() => {
    if (choicesRaw === undefined) return;
    if (choicesRaw.length === 0) {
      setChoiceTokens([]);
      setChoiceTotalShares([]);
      return;
    }
    multicall({
      allowFailure: false,
      contracts: choicesRaw.map((choiceRaw) => ({
        address: choiceRaw.address,
        abi: choiceABI,
        functionName: 'totalShares',
      })),
    }).then((res) => setChoiceTotalShares(res));

    multicall({
      allowFailure: false,
      contracts: choicesRaw.map((choiceRaw) => ({
        address: choiceRaw.address,
        abi: choiceABI,
        functionName: 'tokens',
      })),
    }).then((res) => setChoiceTokens(res));
  }, [choicesRaw, blockNumber]);

  const choices: Choice[] | undefined = useMemo(() => {
    if (
      choicesLength !== undefined &&
      choiceTotalShares?.length === Number(choicesLength) &&
      choiceTokens?.length === Number(choicesLength)
    ) {
      return choicesRaw
        ?.map((choice, i) => ({
          ...choice,
          meta: choiceMetadatas?.[i],
          totalShares: choiceTotalShares[i],
          tokens: choiceTokens[i],
        }))
        .sort((a, b) => Number(b.totalShares - a.totalShares))
        .map((choice, index) => ({
          ...choice,
          rank: index + 1,
        }));
    }
    return undefined;
  }, [choiceMetadatas, choiceTokens, choiceTotalShares, choicesLength, choicesRaw]);

  const topicTotalShares = useMemo(() => choiceTotalShares?.reduce((a, c) => a + c, 0n), [choiceTotalShares]);

  const topicTokens = useMemo(() => choiceTokens?.reduce((a, c) => a + c, 0n), [choiceTokens]);

  return {
    choices,
    loaded: choiceMetadatas !== undefined,
    topicTotalShares,
    topicTokens,
  };
}
