import { AddressMap } from 'types';
import { Address } from 'wagmi';
import { goerli } from 'wagmi/chains';

export const ARENA_ADDRESS: AddressMap = {
  [goerli.id]: '0xe35058AA528F5bEE0E7bF0fcce9D9E9A3617Ce9B',
};
export const SONGADAY_CONTRACT_ADDRESS = (process.env.SONGADAY_CONTRACT_ADDRESS ??
  '0x19b703f65aA7E1E775BD06c2aa0D0d08c80f1C45') as Address;
