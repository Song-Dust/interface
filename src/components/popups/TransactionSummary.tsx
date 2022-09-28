import React from 'react';

import {
  ApproveTransactionInfo,
  TransactionInfo,
  TransactionType,
  VoteTransactionInfo,
} from '../../state/transactions/types';

// function formatAmount(amountRaw: string, decimals: number, sigFigs: number): string {
//   return new Fraction(amountRaw, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))).toSignificant(sigFigs);
// }

// function FormattedCurrencyAmount({
//   rawAmount,
//   symbol,
//   decimals,
//   sigFigs,
// }: {
//   rawAmount: string;
//   symbol: string;
//   decimals: number;
//   sigFigs: number;
// }) {
//   return (
//     <>
//       {formatAmount(rawAmount, decimals, sigFigs)} {symbol}
//     </>
//   );
// }

// function FormattedCurrencyAmountManaged({
//   rawAmount,
//   currencyId,
//   sigFigs = 6,
// }: {
//   rawAmount: string;
//   currencyId: string;
//   sigFigs: number;
// }) {
//   const currency = useCurrency(currencyId);
//   return currency ? (
//     <FormattedCurrencyAmount
//       rawAmount={rawAmount}
//       decimals={currency.decimals}
//       sigFigs={sigFigs}
//       symbol={currency.symbol ?? '???'}
//     />
//   ) : null;
// }

function ApprovalSummary({ info }: { info: ApproveTransactionInfo }) {
  // <p className={'font-semibold'}>{tx.type}</p>
  // <p className={'text-sm'}>
  //   {tx.message}
  //   <br />
  //   {tx.amount && tx.tokenSymbol && tx.status === TransactionStatus.SUCCESS && (
  //       <span>
  //                 Swap{' '}
  //         <span className={'font-bold'}>
  //                   {parseFloat(tx.amount)} {tx.tokenSymbol}
  //                 </span>{' '}
  //         for <span className={'font-bold'}>{`${parseFloat(tx.amountTo)} MUON`}</span>
  //               </span>
  //   )}
  // </p>
  return (
    <>
      <p className={'font-semibold'}>Approve</p>
      <p className={'text-sm'}>Approve {info.tokenSymbol}</p>
    </>
  );
}

function VoteSummary({ info }: { info: VoteTransactionInfo }) {
  return <div></div>;
}

export function TransactionSummary({ info }: { info: TransactionInfo }) {
  switch (info.type) {
    case TransactionType.APPROVAL:
      return <ApprovalSummary info={info} />;

    case TransactionType.VOTE:
      return <VoteSummary info={info} />;
  }
}
