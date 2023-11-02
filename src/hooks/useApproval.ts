import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import { erc20ABI, useErc20Allowance } from 'abis/types/generated';
import { useCallback, useMemo, useState } from 'react';
import { ApprovalState } from 'types/approval';
import { TransactionState } from 'types/transaction';
import { Address, useAccount } from 'wagmi';

export function useApproval({
  tokenAddress,
  spender,
  amount,
}: {
  tokenAddress?: Address;
  spender?: Address;
  amount?: bigint;
}) {
  const { address } = useAccount();
  const { data: allowance } = useErc20Allowance({
    address: tokenAddress,
    args: spender && address ? [address, spender] : undefined,
    watch: true,
  });

  const [txState, setTxState] = useState(TransactionState.INITIAL);

  const approve = useCallback(async () => {
    if (txState !== TransactionState.INITIAL || !address || !tokenAddress || !spender || !amount) return;
    setTxState(TransactionState.PREPARING_TRANSACTION);
    try {
      const { request } = await prepareWriteContract({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'approve',
        args: [spender, amount],
      });
      setTxState(TransactionState.AWAITING_USER_CONFIRMATION);
      const { hash } = await writeContract(request);
      setTxState(TransactionState.AWAITING_TRANSACTION);
      await waitForTransaction({
        hash,
      });
    } catch (err) {
      alert(String(err));
      throw err;
    } finally {
      setTxState(TransactionState.INITIAL);
    }
  }, [address, amount, spender, tokenAddress, txState]);

  const approvalState: ApprovalState = useMemo(() => {
    if (txState === TransactionState.PREPARING_TRANSACTION) return ApprovalState.PREPARING_TRANSACTION;
    if (txState === TransactionState.AWAITING_USER_CONFIRMATION) return ApprovalState.AWAITING_USER_CONFIRMATION;
    if (txState === TransactionState.AWAITING_TRANSACTION) return ApprovalState.AWAITING_TRANSACTION;
    if (amount === undefined || allowance === undefined) return ApprovalState.UNKNOWN;
    return amount > allowance ? ApprovalState.NOT_APPROVED : ApprovalState.APPROVED;
  }, [allowance, amount, txState]);

  return {
    approvalState,
    approve,
  };
}
