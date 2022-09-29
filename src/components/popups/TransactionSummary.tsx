import { Fraction } from '@uniswap/sdk-core';
import { useWeb3React } from '@web3-react/core';
import { SONG } from 'constants/tokens';
import JSBI from 'jsbi';
import React from 'react';

import {
  ApproveTransactionInfo,
  TransactionInfo,
  TransactionType,
  VoteTransactionInfo,
} from '../../state/transactions/types';

function formatAmount(amountRaw: string, decimals: number, sigFigs: number): string {
  return new Fraction(amountRaw, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))).toSignificant(sigFigs);
}

function FormattedCurrencyAmount({
  rawAmount,
  symbol,
  decimals,
  sigFigs,
}: {
  rawAmount: string;
  symbol: string;
  decimals: number;
  sigFigs: number;
}) {
  return (
    <>
      {formatAmount(rawAmount, decimals, sigFigs)} {symbol}
    </>
  );
}

function FormattedSongAmount({ rawAmount, sigFigs = 6 }: { rawAmount: string; sigFigs?: number }) {
  const { chainId } = useWeb3React();
  const currency = chainId ? SONG[chainId] : undefined;
  return currency ? (
    <FormattedCurrencyAmount
      rawAmount={rawAmount}
      decimals={currency.decimals}
      sigFigs={sigFigs}
      symbol={currency.symbol ?? '???'}
    />
  ) : null;
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

export function TransactionSummary({ info }: { info: TransactionInfo }) {
  switch (info.type) {
    case TransactionType.APPROVAL:
      return <ApprovalSummary info={info} />;

    case TransactionType.VOTE:
      return <VoteSummary info={info} />;
  }
}
