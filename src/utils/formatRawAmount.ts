import { Fraction } from '@uniswap/sdk-core';
import JSBI from 'jsbi';

export function formatRawAmount(amountRaw: string, decimals: number, sigFigs: number, symbol: string): string {
  return (
    new Fraction(amountRaw, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))).toSignificant(sigFigs) +
    ' ' +
    symbol
  );
}
