import { Transition } from '@headlessui/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import { arenaABI } from 'abis/types/generated';
import axios from 'axios';
import Modal, { ModalPropsInterface } from 'components/modal/index';
import { ARENA_ADDRESS_MAP } from 'constants/addresses';
import { useApproval } from 'hooks/useApproval';
import { useArena, useArenaTokenData } from 'hooks/useArena';
import { useContractAddress } from 'hooks/useContractAddress';
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PinataResponse, TopicMetadata } from 'types';
import { ApprovalState } from 'types/approval';
import { TransactionState } from 'types/transaction';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';

const AddCategoryModal = (props: ModalPropsInterface) => {
  const { address: account } = useAccount();

  const active = useMemo(() => !!account, [account]);
  const { topicCreationFee } = useArena();
  const { arenaTokenAddress, arenaTokenBalance, arenaTokenSymbol, arenaTokenDecimals } = useArenaTokenData();

  const parsedAmount = useMemo(() => {
    if (topicCreationFee === undefined) return undefined;
    if (topicCreationFee === 0n) return '0';
    if (arenaTokenDecimals === undefined) return undefined;
    return formatUnits(topicCreationFee, arenaTokenDecimals);
  }, [arenaTokenDecimals, topicCreationFee]);

  const arenaAddress = useContractAddress(ARENA_ADDRESS_MAP);

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const [txState, setTxState] = useState(TransactionState.INITIAL);
  const [title, setTitle] = useState('Test Category 2');
  const [description, setDescription] = useState('Test Description 2');
  const { address } = useAccount();
  const handleAddChoice = useCallback(async () => {
    if (txState !== TransactionState.INITIAL || !address) return;
    try {
      setTxState(TransactionState.UPLOADING_METADATA);
      const metadata: TopicMetadata = {
        title,
        description,
      };
      const { data } = await axios.post<PinataResponse>(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        {
          pinataContent: metadata,
        },
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer ' + process.env.REACT_APP_PINATA_JWT,
            'content-type': 'application/json',
          },
        },
      );
      console.log({ data });
      setTxState(TransactionState.PREPARING_TRANSACTION);
      const { request } = await prepareWriteContract({
        address: arenaAddress,
        abi: arenaABI,
        functionName: 'deployTopic',
        args: [
          BigInt(1699117753),
          BigInt(1800),
          BigInt(300),
          BigInt(400),
          BigInt(500),
          address,
          0,
          'ipfs://' + data.IpfsHash,
        ],
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
  }, [address, arenaAddress, description, title, txState]);

  const { openConnectModal } = useConnectModal();

  const insufficientBalance = useMemo(
    () => Boolean(arenaTokenBalance && topicCreationFee && topicCreationFee > arenaTokenBalance),
    [arenaTokenBalance, topicCreationFee],
  );

  const { approvalState: approvalStateArenaToken, approve: approveArenaToken } = useApproval({
    tokenAddress: arenaTokenAddress,
    amount: topicCreationFee,
    spender: arenaAddress,
  });

  function renderButton() {
    if (!active) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large'} onClick={openConnectModal}>
          Connect Wallet
        </button>
      );
    }
    if (topicCreationFee === undefined) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'}>
          Loading...
        </button>
      );
    }
    if (insufficientBalance) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'}>
          Insufficient {arenaTokenSymbol} balance
        </button>
      );
    }
    if (approvalStateArenaToken === ApprovalState.NOT_APPROVED) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'} onClick={approveArenaToken}>
          Approve {arenaTokenSymbol}
        </button>
      );
    }
    if (
      approvalStateArenaToken === ApprovalState.PREPARING_TRANSACTION ||
      approvalStateArenaToken === ApprovalState.AWAITING_USER_CONFIRMATION
    ) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'}>
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
        <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'}>
          Loading Approval State...
        </button>
      );
    }
    if (txState === TransactionState.UPLOADING_METADATA) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'}>
          Uploading Metadata...
        </button>
      );
    }
    if (txState !== TransactionState.INITIAL) {
      return (
        <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'}>
          Sending Transaction...
        </button>
      );
    }
    return (
      <button data-testid="add-song-btn" className={'btn-primary btn-large w-64'} onClick={handleAddChoice}>
        Add song to category
      </button>
    );
  }

  return (
    <Modal
      className={'!max-w-4xl w-full px-6 h-3/4 max-h'}
      title={`Select the song you want to add to this category`}
      closeModal={props.closeModal}
      open={props.open}
    >
      <div className="w-full flex"></div>
      <Transition
        as={Fragment}
        show={true}
        enter="transform ease-in-out transition duration-[400ms]"
        enterFrom="opacity-0 translate-y-32"
        enterTo="opacity-100 translate-y-0"
        leave="transform duration-500 transition ease-in-out"
        leaveFrom="opacity-100"
        leaveTo="opacity-0 translate-y-32 "
      >
        <footer className={'absolute left-0 right-0 bottom-0 bg-white border-gray border-t rounded-b-2xl py-4 px-8'}>
          <section className={'flex'}>
            <div className={'flex-1'}>
              {!active && <p className={''}>You need to Connect your wallet for adding a topic</p>}
              <p>
                Submit fee: <span className={'font-semibold'}>{parsedAmount ?? '...'}</span>
              </p>
            </div>
          </section>
          <section className={'vote-modal-action flex justify-end mt-8'}>{renderButton()}</section>
        </footer>
      </Transition>
    </Modal>
  );
};

export default AddCategoryModal;
