import { Ether, NativeCurrency, Token, WETH9 } from '@uniswap/sdk-core';

import { SONG_ADDRESS } from './addresses';
import { SupportedChainId } from './chains';

export const SONG: { [chainId: number]: Token } = {
  [SupportedChainId.GOERLI]: new Token(SupportedChainId.GOERLI, SONG_ADDRESS[5], 18, 'UNI', 'Uniswap'),
};

export const WRAPPED_NATIVE_CURRENCY: { [chainId: number]: Token | undefined } = {
  ...(WETH9 as Record<SupportedChainId, Token>),
};

export class ExtendedEther extends Ether {
  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId];
    if (wrapped) return wrapped;
    throw new Error('Unsupported chain ID');
  }

  private static _cachedExtendedEther: { [chainId: number]: NativeCurrency } = {};

  public static onChain(chainId: number): ExtendedEther {
    return this._cachedExtendedEther[chainId] ?? (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId));
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency | Token } = {};

export function nativeOnChain(chainId: number): NativeCurrency | Token {
  if (cachedNativeCurrency[chainId]) return cachedNativeCurrency[chainId];
  // let nativeCurrency: NativeCurrency | Token;
  // if (isMatic(chainId)) {
  //   nativeCurrency = new MaticNativeCurrency(chainId);
  // } else if (isCelo(chainId)) {
  //   nativeCurrency = getCeloNativeCurrency(chainId);
  // } else {
  //   nativeCurrency = ExtendedEther.onChain(chainId);
  // }
  const nativeCurrency: NativeCurrency | Token = ExtendedEther.onChain(chainId);
  return (cachedNativeCurrency[chainId] = nativeCurrency);
}
