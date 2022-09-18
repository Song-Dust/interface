import { JsonRpcProvider } from '@ethersproject/providers';
import { RPC_URLS } from 'constants/networks';

import { SupportedChainId } from './chains';

export const Providers: { [chainId: number]: JsonRpcProvider } = {
  [SupportedChainId.GOERLI]: new JsonRpcProvider(RPC_URLS[SupportedChainId.GOERLI]),
};
