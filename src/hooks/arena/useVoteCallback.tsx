import { BigNumberish } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useArenaContract } from 'hooks/useContract';
import React, { ReactNode, useMemo } from 'react';
import { TransactionType, VoteTransactionInfo } from 'state/transactions/types';

import useArenaTransaction from './useArenaTransaction';

export enum CallbackState {
  INVALID,
  VALID,
}

interface UseCallbackReturns {
  state: CallbackState;
  callback?: () => Promise<TransactionResponse>;
  error?: ReactNode;
}

export function useVoteCallback(
  topicId: BigNumberish,
  choiceId: BigNumberish,
  amount: string,
  choiceTitle: string,
): UseCallbackReturns {
  const { account, chainId, provider } = useWeb3React();
  const arenaContract = useArenaContract();
  const calls = useMemo(() => {
    if (!arenaContract) {
      return [];
    }
    return [
      {
        address: arenaContract.address,
        calldata: arenaContract.interface.encodeFunctionData('vote', [topicId, choiceId, amount]) ?? '',
        value: '0x0',
      },
    ];
  }, [amount, arenaContract, choiceId, topicId]);

  const info: VoteTransactionInfo = {
    type: TransactionType.VOTE,
    rawAmount: amount,
    choiceTitle,
  };
  const { callback } = useArenaTransaction(account, chainId, provider, calls, info);

  return useMemo(() => {
    if (!provider || !account || !chainId || !callback) {
      return { state: CallbackState.INVALID, error: <div>Missing dependencies</div> };
    }

    return {
      state: CallbackState.VALID,
      callback: async () => callback(),
    };
  }, [provider, account, chainId, callback]);
}
