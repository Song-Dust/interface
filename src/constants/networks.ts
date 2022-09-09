import { SupportedChainId } from './chains';

/**
 * These are the network URLs used by the interface when there is not another available source of chain data
 */
export const RPC_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.RINKEBY]: '',
  [SupportedChainId.GOERLI]: 'https://rpc.goerli.mudit.blog/',
};
