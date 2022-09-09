import { TradeType } from '@uniswap/sdk-core';

export interface SerializableTransactionReceipt {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: number;
  blockHash: string;
  transactionHash: string;
  blockNumber: number;
  status?: number;
}

/**
 * Be careful adding to this enum, always assign a unique value (typescript will not prevent duplicate values).
 * These values is persisted in state and if you change the value it will cause errors
 */
export enum TransactionType {
  APPROVAL = 0,
  SWAP,
  CLAIM,
  DELEGATE,
}

export interface BaseTransactionInfo {
  type: TransactionType;
}

export interface DelegateTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.DELEGATE;
  delegatee: string;
}

export interface ApproveTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.APPROVAL;
  tokenAddress: string;
  spender: string;
}

interface BaseSwapTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.SWAP;
  tradeType: TradeType;
  inputCurrencyId: string;
  outputCurrencyId: string;
}

export interface ExactInputSwapTransactionInfo extends BaseSwapTransactionInfo {
  tradeType: TradeType.EXACT_INPUT;
  inputCurrencyAmountRaw: string;
  expectedOutputCurrencyAmountRaw: string;
  minimumOutputCurrencyAmountRaw: string;
}

export interface ExactOutputSwapTransactionInfo extends BaseSwapTransactionInfo {
  tradeType: TradeType.EXACT_OUTPUT;
  outputCurrencyAmountRaw: string;
  expectedInputCurrencyAmountRaw: string;
  maximumInputCurrencyAmountRaw: string;
}

export interface ClaimTransactionInfo {
  type: TransactionType.CLAIM;
  recipient: string;
  uniAmountRaw?: string;
}

export type TransactionInfo =
  | ApproveTransactionInfo
  | ExactOutputSwapTransactionInfo
  | ExactInputSwapTransactionInfo
  | ClaimTransactionInfo
  | DelegateTransactionInfo;

export interface TransactionDetails {
  hash: string;
  receipt?: SerializableTransactionReceipt;
  lastCheckedBlockNumber?: number;
  addedTime: number;
  confirmedTime?: number;
  from: string;
  info: TransactionInfo;
}
