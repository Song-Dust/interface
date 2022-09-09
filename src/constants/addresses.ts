import { SupportedChainId } from './chains';

export type AddressMap = { [chainId: number]: string };

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ARENA_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: '0x29eB89E03F317B87aB3510bE0ED748CBab916D21',
};

export const MULTICALL2_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: '0x85D395e783E1e5735B7bd66136D45Df194648EfB',
};

export const SONG_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
};
