import { BigNumberish } from '@ethersproject/bignumber';
import { MaxUint256 } from '@ethersproject/constants';
import { TransactionResponse } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useArenaContract } from 'hooks/useContract';
import React, { ReactNode, useMemo } from 'react';
import { AddChoiceTransactionInfo, TransactionType } from 'state/transactions/types';

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

export function useAddChoiceCallback(topicId: BigNumberish, metaData: string, choiceTitle: string): UseCallbackReturns {
  const { account, chainId, provider } = useWeb3React();
  const arenaContract = useArenaContract();
  const calls = useMemo(() => {
    if (!arenaContract) {
      return [];
    }
    return [
      {
        address: arenaContract.address,
        calldata:
          arenaContract.interface.encodeFunctionData('addChoice', [
            topicId,
            {
              description: '',
              funds: '0xaa6cD66cA508F22fe125e83342c7dc3dbE779250',
              feePercentage: 1000,
              fundingTarget: MaxUint256,
              metaDataUrl: metaData,
            },
          ]) ?? '',
        value: '0x0',
      },
    ];
  }, [arenaContract, metaData, topicId]);

  const info: AddChoiceTransactionInfo = {
    type: TransactionType.ADD_CHOICE,
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
