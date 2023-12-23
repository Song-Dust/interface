import { AddressMap } from 'types';
import { Address } from 'wagmi';
import { goerli } from 'wagmi/chains';

export const ARENA_ADDRESS_MAP: AddressMap = {
  [goerli.id]: '0x94a1CB7e2fc2bd2d5DA0480762779CAa2Fa4E124',
};
export const SONGADAY_CONTRACT_ADDRESS = (process.env.SONGADAY_CONTRACT_ADDRESS ??
  '0x19b703f65aA7E1E775BD06c2aa0D0d08c80f1C45') as Address;
