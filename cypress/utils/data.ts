import { BigNumber } from '@ethersproject/bignumber';
import { Wallet } from '@ethersproject/wallet';

import { SongMetadata } from '../../src/types';
import { ChoiceStruct, TopicStruct } from '../../src/types/contracts/Arena';
import { shortenAddress } from '../../src/utils';

export const TEST_PRIVATE_KEY = '0xe580410d7c37d26c6ad1a837bbae46bc27f9066a466fb3a66e770523b4666d19';
export const TEST_ADDRESS_NEVER_USE = new Wallet(TEST_PRIVATE_KEY).address;
// address of the above key
export const TEST_ADDRESS_NEVER_USE_SHORTENED = shortenAddress(TEST_ADDRESS_NEVER_USE);

export const IPFS_SERVER_URL = 'https://some.ipfs.server';

export const topics: {
  [topicId: number]: TopicStruct;
} = {
  0: {
    cycleDuration: 2,
    startBlock: 0,
    sharePerCyclePercentage: 10000,
    prevContributorsFeePercentage: 1200,
    topicFeePercentage: 500,
    maxChoiceFeePercentage: 2500,
    relativeSupportThreshold: 0,
    fundingPeriod: 0,
    fundingPercentage: 0,
    funds: '0x211eEBa0ebe516744614C35572555BdFDD13424d',
    metaDataUrl: IPFS_SERVER_URL + '/topic/topic1.json',
  },
};

export const choices: {
  [topicId: number]: {
    [choiceId: number]: ChoiceStruct;
  };
} = {
  0: {
    ...Object.assign({}, [
      ...[1, 2, 3, 4, 5, 6].map((i) => ({
        description: 'The Song ' + i,
        funds: '0x211eEBa0ebe516744614C35572555BdFDD13424d',
        feePercentage: 1000,
        fundingTarget: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        metaDataUrl: IPFS_SERVER_URL + `/choice/${i}.json`,
      })),
    ]),
  },
};

export const songMeta: SongMetadata = {
  name: 'Bellatrix',
  description: 'The merge is coming!',
  created_by: 'Jonathan Mann',
  token_id: 4997,
  image: 'ipfs://bafybeig4anscx7fcgnt6pxa7tngkkyzqt3hzzvl7dgve6b3ixo7mzox74i',
  animation_url: 'ipfs://bafybeicc4wzslexwckam424pcyn6ne2epgh53jnj2inysqyogtubhkfc3a',
  audio_url: 'ipfs://bafybeic5yqx6kqtbj5qwvwxetufjilhvkfwuibhup6xvvmshrd4i3s3zaq',
  external_url: 'https://songaday.world/song/4997',
  youtube_url: 'https://youtu.be/v-zBVeS1ha8',
  attributes: [
    {
      trait_type: 'Date',
      value: '2022-09-06',
    },
    {
      trait_type: 'Location',
      value: 'Hartford, CT Studio 2',
    },
    {
      trait_type: 'Topic',
      value: 'Ethereum',
    },
    {
      trait_type: 'Instrument',
      value: 'Piano',
    },
    {
      trait_type: 'Mood',
      value: 'Excited',
    },
    {
      trait_type: 'Beard',
      value: 'Beard',
    },
    {
      trait_type: 'Genre',
      value: 'Soul',
    },
    {
      trait_type: 'Style',
      value: 'Dark',
    },
    {
      trait_type: 'Length',
      value: '1:17',
    },
    {
      trait_type: 'Key',
      value: 'Cm',
    },
    {
      trait_type: 'Tempo',
      value: '90',
    },
    {
      trait_type: 'Song A Day',
      value: '4997',
    },
    {
      trait_type: 'Year',
      value: '2022',
    },
    {
      trait_type: 'Instrument',
      value: 'Samples',
    },
    {
      trait_type: 'Instrument',
      value: 'Acoustic Guitar',
    },
    {
      trait_type: 'Instrument',
      value: 'Synths',
    },
    {
      trait_type: 'Instrument',
      value: 'Drum Machine',
    },
    {
      trait_type: 'Instrument',
      value: 'Drums',
    },
    {
      trait_type: 'Style',
      value: 'Fun',
    },
    {
      trait_type: 'Style',
      value: 'Dreamy',
    },
    {
      trait_type: 'Style',
      value: 'Soulful',
    },
    {
      trait_type: 'Style',
      value: 'Bouncy',
    },
  ],
  Date: '2022-09-06',
  Location: 'Hartford, CT Studio 2',
  Topic: 'Ethereum',
  Instrument: ['Piano', 'Samples', 'Acoustic Guitar', 'Synths', 'Drum Machine', 'Drums'],
  Mood: 'Excited',
  Beard: 'Beard',
  Genre: 'Soul',
  Style: ['Dark', 'Fun', 'Dreamy', 'Soulful', 'Bouncy'],
  Length: '1:17',
  Key: 'Cm',
  Tempo: '90',
  'Song A Day': '4997',
  Year: '2022',
  objectID: '4997',
  _highlightResult: {
    name: {
      value: 'Bellatrix',
      matchLevel: 'none',
      matchedWords: [],
    },
    description: {
      value: 'The merge is coming!',
      matchLevel: 'none',
      matchedWords: [],
    },
    token_id: {
      value: '4997',
      matchLevel: 'none',
      matchedWords: [],
    },
    attributes: [
      {
        value: {
          value: '2022-09-06',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: 'Hartford, CT Studio 2',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: 'Ethereum',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: 'Piano',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: 'Excited',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: 'Beard',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: 'Soul',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: 'Dark',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: '1:17',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: 'Cm',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: '90',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: '4997',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: '2022',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: 'Samples',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: 'Acoustic Guitar',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: 'Synths',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: 'Drum Machine',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: 'Drums',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: 'Fun',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: 'Dreamy',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: 'Soulful',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
      {
        value: {
          value: 'Bouncy',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
    ],
  },
};

export const songBalance = BigNumber.from(10).pow(16);
