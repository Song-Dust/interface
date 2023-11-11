import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useChoiceWrite, usePrepareChoiceContribute } from 'abis/types/generated';
import Input from 'components/basic/input';
import ChoiceTile from 'components/choice/ChoiceTile';
import Modal, { ModalPropsInterface } from 'components/modal/index';
import { useApproval } from 'hooks/useApproval';
import { useArenaTokenData } from 'hooks/useArena';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Choice } from 'types';
import { ApprovalState } from 'types/approval';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';

const VoteChoiceModal = ({ choice, ...props }: ModalPropsInterface & { choice: Choice | undefined }) => {
  const { address: account } = useAccount();
  // const chainId = chain?.id;
  const active = useMemo(() => !!account, [account]);

  const { arenaTokenAddress, arenaTokenBalance, arenaTokenSymbol, arenaTokenDecimals } = useArenaTokenData();

  const { openConnectModal } = useConnectModal();

  const [voteAmount, setVoteAmount] = useState('');

  const parsedAmount = useMemo(() => {
    return arenaTokenDecimals !== undefined ? parseUnits(voteAmount, arenaTokenDecimals) : undefined;
  }, [arenaTokenDecimals, voteAmount]);

  const { approvalState: approvalStateArenaToken, approve: approveArenaToken } = useApproval({
    tokenAddress: arenaTokenAddress,
    amount: parsedAmount,
    spender: choice?.address,
  });
  const { config } = usePrepareChoiceContribute({
    address: choice?.address,
    args: parsedAmount ? [parsedAmount] : undefined,
  });
  const { write: voteCallback } = useChoiceWrite(config);

  const [loading, setLoading] = useState(false);

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleVote = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await voteCallback?.();
    } catch (e) {
      console.log('vote failed');
      console.log(e);
    }
    if (mounted.current) {
      setLoading(false);
    }
  };

  const insufficientBalance = useMemo(
    () => Boolean(arenaTokenBalance && parsedAmount && parsedAmount > arenaTokenBalance),
    [arenaTokenBalance, parsedAmount],
  );

  function renderButton() {
    if (!active) {
      return (
        <button data-testid="cast-vote-btn" className={'btn-primary btn-large'} onClick={openConnectModal}>
          Connect Wallet
        </button>
      );
    }
    if (!Number(voteAmount)) {
      return (
        <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'}>
          Enter Amount
        </button>
      );
    }
    if (insufficientBalance) {
      return (
        <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'}>
          Insufficient {arenaTokenSymbol} balance
        </button>
      );
    }
    if (approvalStateArenaToken === ApprovalState.NOT_APPROVED) {
      return (
        <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'} onClick={approveArenaToken}>
          Approve {arenaTokenSymbol}
        </button>
      );
    }
    if (
      approvalStateArenaToken === ApprovalState.PREPARING_TRANSACTION ||
      approvalStateArenaToken === ApprovalState.AWAITING_USER_CONFIRMATION
    ) {
      return (
        <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'}>
          Waiting for Approve...
        </button>
      );
    }
    if (approvalStateArenaToken === ApprovalState.AWAITING_TRANSACTION) {
      return (
        <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'}>
          Sending Approval Transaction...
        </button>
      );
    }
    if (approvalStateArenaToken === ApprovalState.UNKNOWN) {
      return (
        <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'}>
          Loading Approval State...
        </button>
      );
    }
    if (loading) {
      return (
        <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'}>
          Sending Transaction...
        </button>
      );
    }
    return (
      <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'} onClick={handleVote}>
        Cast <span className={'font-bold'}>{Number(voteAmount).toLocaleString()}</span> {arenaTokenSymbol}
      </button>
    );
  }

  return (
    <Modal
      className={'!max-w-2xl relative overflow-hidden h-2/3'}
      {...props}
      title={`Contributing to ${choice?.meta?.name}`}
    >
      <main className={'flex flex-wrap gap-6'}>
        {choice && <ChoiceTile className={`opacity-100`} id={choice.id} choiceMeta={choice.meta} />}
      </main>
      <footer className={'absolute left-0 right-0 bottom-0 rounded-xl bg-white border-gray border-t py-4 px-2'}>
        <section className={'flex'}>
          <div className={'flex-1'}>
            <p className={'font-semibold text-xl'}>
              <span className="text-primary">{choice?.meta?.name}</span> selected
            </p>
            <p className={''}>
              {active ? 'Enter the amount that you want to cast' : 'Connect your wallet to cast your vote'}
            </p>
          </div>
          <div className={'flex-1'}>
            <Input
              type={'number'}
              testid="vote-amount"
              placeholder="Enter Amount"
              value={voteAmount}
              tokenBalance={{
                balance: arenaTokenBalance,
                symbol: arenaTokenSymbol,
                decimals: arenaTokenDecimals,
              }}
              onUserInput={setVoteAmount}
            />
          </div>
        </section>
        <section className={'vote-modal-action flex justify-end mt-8'}>{renderButton()}</section>
        {/* footer action */}
      </footer>
    </Modal>
  );
};

export default VoteChoiceModal;
