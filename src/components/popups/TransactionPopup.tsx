import { faCircleCheck, faCircleXmark } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Transition } from '@headlessui/react';
import { useWeb3React } from '@web3-react/core';
import { TransactionSummary } from 'components/popups/TransactionSummary';
import React, { Fragment } from 'react';
import { ExplorerDataType, getExplorerLink } from 'utils/getExplorerLink';

import { useTransaction } from '../../state/transactions/hooks';

export default function TransactionPopup({ hash, show }: { hash: string; show: boolean }) {
  const { chainId } = useWeb3React();

  const tx = useTransaction(hash);

  if (!tx) return null;
  const success = Boolean(tx.receipt && tx.receipt.status === 1);

  return (
    <Transition
      as={Fragment}
      show={show}
      enter="transform ease-in-out transition duration-[400ms]"
      enterFrom="opacity-0 w-0 translate-x-32"
      enterTo="opacity-100 w-full translate-x-0"
      leave="transform duration-500 transition ease-in-out"
      leaveFrom="opacity-100 "
      leaveTo="opacity-0 scale-95 -translate-y-32 "
    >
      <div
        className="w-80 pr-3 pl-4 py-4 fixed right-8 gap-4 top-8 z-100 rounded-xl bg-white shadow-md flex items-center
          "
      >
        {tx.receipt && (
          <FontAwesomeIcon
            style={{ fontSize: 24 }}
            className={`${success ? 'text-green-600' : 'text-red-500'} `}
            icon={success ? faCircleCheck : faCircleXmark}
          ></FontAwesomeIcon>
        )}
        <div className={'flex flex-col gap-2'}>
          <TransactionSummary info={tx.info} />
          {chainId && (
            <a
              className={'text-primary text-sm font-semibold'}
              target="_blink"
              href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}
            >
              View on Explorer
            </a>
          )}
        </div>
      </div>
    </Transition>
  );
}
