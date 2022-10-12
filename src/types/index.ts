import { ChoiceStruct } from './contracts/Arena';

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

export type Choice = ChoiceStruct & {
  meta?: SongMetadata | null;
  id: number;
};

export enum TransactionStatus {
  SUCCESS,
  PENDING,
}

export type Transaction = {
  status: TransactionStatus;
  type: string;
  message: string;
  amount: string;
  tokenSymbol: string;
  amountTo: string;
};
