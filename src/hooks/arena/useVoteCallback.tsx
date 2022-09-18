import React, { ReactNode, useMemo } from 'react';
import { TransactionResponse } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import useArenaTransaction from './useArenaTransaction';
import { useArenaContract } from 'hooks/useContract';
import { BigNumberish } from '@ethersproject/bignumber';

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
  amount: BigNumberish,
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

  const { callback } = useArenaTransaction(account, chainId, provider, calls);

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
