import { SupportedChainId } from './chains';

/**
 * These are the network URLs used by the interface when there is not another available source of chain data
 */
export const RPC_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.RINKEBY]: '',
  [SupportedChainId.GOERLI]: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
};
