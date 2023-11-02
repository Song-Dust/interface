import { Transition } from '@headlessui/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useChoiceWrite, usePrepareChoiceContribute } from 'abis/types/generated';
import Input from 'components/basic/input';
import Modal, { ModalPropsInterface } from 'components/modal/index';
import SongTile from 'components/song/SongTile';
import { useApproval } from 'hooks/useApproval';
import { useArenaTokenData, useTopicChoices } from 'hooks/useArena';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Choice } from 'types';
import { ApprovalState } from 'types/approval';
import { parseUnits } from 'viem';
import { Address, useAccount } from 'wagmi';

const VoteSongModal = (props: ModalPropsInterface) => {
  const { address: account } = useAccount();
  // const chainId = chain?.id;
  const active = useMemo(() => !!account, [account]);

  const { topicAddress } = useParams();
  const { choices } = useTopicChoices(topicAddress as Address | undefined);
  const { arenaTokenAddress, arenaTokenBalance, arenaTokenSymbol, arenaTokenDecimals } = useArenaTokenData(
    topicAddress as Address,
  );

  const [selectedChoiceAddress, setSelectedChoiceAddress] = useState<Address | undefined>(undefined);
  const selectedChoice = useMemo(() => {
    if (!choices || selectedChoiceAddress === null) return null;
    return choices.find((c) => c.address === selectedChoiceAddress)!;
  }, [choices, selectedChoiceAddress]);

  function closeAction() {
    setSelectedChoiceAddress(undefined);
  }

  const { openConnectModal } = useConnectModal();

  const [voteAmount, setVoteAmount] = useState('');

  const parsedAmount = useMemo(() => {
    return arenaTokenDecimals !== undefined ? parseUnits(voteAmount, arenaTokenDecimals) : undefined;
  }, [arenaTokenDecimals, voteAmount]);

  const { approvalState: approvalStateArenaToken, approve: approveArenaToken } = useApproval({
    tokenAddress: arenaTokenAddress,
    amount: parsedAmount,
    spender: selectedChoiceAddress,
  });
  const { config } = usePrepareChoiceContribute({
    address: selectedChoiceAddress as Address | undefined,
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

  function modalContent(items: Choice[]) {
    return (
      <>
        <main className={'flex flex-wrap gap-6'}>
          {items.map((song) => {
            return (
              <SongTile
                onClick={() => setSelectedChoiceAddress(song.address)}
                className={`${
                  song.address === selectedChoiceAddress || selectedChoiceAddress === null
                    ? 'opacity-100'
                    : 'opacity-30'
                }`}
                key={song.id}
                id={song.id}
                songMeta={song.meta}
              />
            );
          })}
        </main>
        <Transition
          as={Fragment}
          show={selectedChoiceAddress !== null}
          enter="transform ease-in-out transition duration-[400ms]"
          enterFrom="opacity-0 translate-y-32"
          enterTo="opacity-100 translate-y-0"
          leave="transform duration-500 transition ease-in-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 translate-y-32 "
        >
          <footer className={'absolute left-0 right-0 bottom-0 rounded-xl bg-white border-gray border-t py-4 px-2'}>
            <section className={'flex'}>
              <div className={'flex-1'}>
                <p className={'font-semibold text-xl'}>
                  <span className="text-primary">{selectedChoice?.meta?.name}</span> selected
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
            <section className={'vote-modal-action flex justify-end mt-8'}>
              <button onClick={closeAction} className={'btn-primary-inverted btn-large mr-2'}>
                Go back
              </button>
              {renderButton()}
            </section>
            {/* footer action */}
          </footer>
        </Transition>
      </>
    );
  }

  return (
    <Modal
      className={'!max-w-2xl relative overflow-hidden h-2/3'}
      {...props}
      title={`Select the song you want to vote for (${choices?.length || '...'} songs nominated)`}
    >
      {choices !== undefined ? modalContent(choices) : <div>loading</div>}
    </Modal>
  );
};

export default VoteSongModal;
