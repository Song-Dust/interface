import { JsonRpcProvider } from '@ethersproject/providers';

import { SupportedChainId } from './chains';
import { RPC_URLS } from 'constants/networks';

export const Providers: { [chainId: number]: JsonRpcProvider } = {
  [SupportedChainId.GOERLI]: new JsonRpcProvider(RPC_URLS[SupportedChainId.GOERLI]),
};
