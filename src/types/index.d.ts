import { ChoiceStruct } from './contracts/Arena';

export type SongTag = { subject: string; title: string };

export type SongMeta = {
  thumbnail: string;
  title: string;
  tags: SongTag[];
  by: string;
  date: string;
  opensea: string;
};

export type Choice = ChoiceStruct & {
  meta?: SongMeta | null;
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
