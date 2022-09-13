import { Token } from '@uniswap/sdk-core';

import { SONG_ADDRESS } from './addresses';
import { SupportedChainId } from './chains';

export const SONG: { [chainId: number]: Token } = {
  [SupportedChainId.GOERLI]: new Token(SupportedChainId.GOERLI, SONG_ADDRESS[5], 18, 'UNI', 'Uniswap'),
};
