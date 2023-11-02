import { Address, Chain } from 'wagmi';

export type SongTag = { subject: string; title: string };

export interface SongMetadata {
  name: string;
  created_by: string;
  description: string;
  external_url: string;
  token_id: string | number;
  image: string;
  animation_url: string;
  audio_url: string;
  youtube_url: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  Date: string;
}

export type TopicRaw = {
  id: number;
  metadataURI: string;
  address: Address;
};
export type Topic = TopicRaw & {
  meta?: any | null;
};

export type ChoiceRaw = {
  id: number;
  metadataURI: string;
  address: Address;
};
export type Choice = ChoiceRaw & {
  meta?: SongMetadata | null;
};

export type AddressMap = {
  [key: Chain['id']]: Address;
};

export type TokenBalance = {
  decimals?: number;
  balance?: bigint;
  symbol?: string;
};
