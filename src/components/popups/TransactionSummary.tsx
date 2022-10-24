import { useWeb3React } from '@web3-react/core';
import { SONG } from 'constants/tokens';
import React from 'react';
import { formatRawAmount } from 'utils/formatRawAmount';

import {
  AddChoiceTransactionInfo,
  ApproveTransactionInfo,
  TransactionInfo,
  TransactionType,
  VoteTransactionInfo,
} from '../../state/transactions/types';

function FormattedSongAmount({ rawAmount, sigFigs = 6 }: { rawAmount: string; sigFigs?: number }) {
  const { chainId } = useWeb3React();
  const currency = chainId ? SONG[chainId] : undefined;
  return currency ? <>{formatRawAmount(rawAmount, currency.decimals, sigFigs, currency.symbol ?? '???')}</> : null;
}

function ApprovalSummary({ info }: { info: ApproveTransactionInfo }) {
  return (
    <>
      <p className={'font-semibold'}>Approve</p>
      <p className={'text-sm'}>Approve {info.tokenSymbol}</p>
    </>
  );
}

function VoteSummary({ info }: { info: VoteTransactionInfo }) {
  const truncatedChoiceTitle =
    info.choiceTitle.length > 13 ? info.choiceTitle.substring(0, 10) + '...' : info.choiceTitle;
  return (
    <>
      <span>
        Vote{' '}
        <span className={'font-bold'}>
          <FormattedSongAmount rawAmount={info.rawAmount} sigFigs={3} />
        </span>{' '}
        for <span className={'font-bold'}>{truncatedChoiceTitle}</span>
      </span>
    </>
  );
}

function AddChoiceSummary({ info }: { info: AddChoiceTransactionInfo }) {
  const truncatedChoiceTitle =
    info.choiceTitle.length > 13 ? info.choiceTitle.substring(0, 10) + '...' : info.choiceTitle;
  return (
    <>
      <span>
        Add <span className={'font-bold'}>{truncatedChoiceTitle}</span>
      </span>
    </>
  );
}

export function TransactionSummary({ info }: { info: TransactionInfo }) {
  switch (info.type) {
    case TransactionType.APPROVAL:
      return <ApprovalSummary info={info} />;

    case TransactionType.VOTE:
      return <VoteSummary info={info} />;

    case TransactionType.ADD_CHOICE:
      return <AddChoiceSummary info={info} />;
  }
}
