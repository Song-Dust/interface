import { faCircleCheck, faCircleXmark } from '@fortawesome/pro-solid-svg-icons';
// import { useTimeoutFn } from 'react-use'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Transition } from '@headlessui/react';
import React, { Fragment, PropsWithChildren, useEffect } from 'react';

import { Transaction, TransactionStatus } from '../../types';

export interface NotificationPropsInterface extends React.HTMLAttributes<HTMLElement> {
  open: boolean;
  duration: number;
  linkMessage: string;
  linkHref: string;
  tx: Transaction;

  closeNotif(): void;
}

export type NotificationProps = PropsWithChildren<NotificationPropsInterface>;

const Notification = (props: NotificationProps) => {
  const { className, open, duration, closeNotif, tx, linkMessage, linkHref } = props;
  // let [resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 500)

  const closeNotification = () =>
    setTimeout(() => {
      closeNotif();
    }, duration);

  useEffect(() => {
    const timer = closeNotification();
    return () => clearTimeout(timer);
  }, [closeNotification, open]);

  return (
    <div className={`${className}`}>
      <Transition
        as={Fragment}
        show={open}
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
          {tx.status !== TransactionStatus.PENDING && (
            <FontAwesomeIcon
              style={{ fontSize: 24 }}
              className={`${tx.status === TransactionStatus.SUCCESS ? 'text-green-600' : 'text-red-500'} `}
              icon={tx.status === TransactionStatus.SUCCESS ? faCircleCheck : faCircleXmark}
            ></FontAwesomeIcon>
          )}

          <div className={'flex flex-col gap-2'}>
            <p className={'font-semibold'}>{tx.type}</p>
            <p className={'text-sm'}>
              {tx.message}
              <br />
              {tx.amount && tx.tokenSymbol && tx.status === TransactionStatus.SUCCESS && (
                <span>
                  Swap{' '}
                  <span className={'font-bold'}>
                    {parseFloat(tx.amount)} {tx.tokenSymbol}
                  </span>{' '}
                  for <span className={'font-bold'}>{`${parseFloat(tx.amountTo)} MUON`}</span>
                </span>
              )}
            </p>

            {linkHref && (
              <a className={'text-primary text-sm font-semibold'} target="_blink" href={linkHref}>
                {linkMessage}
              </a>
            )}
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default Notification;
