import { AddressMap } from 'types';
import { Address } from 'wagmi';
import { goerli } from 'wagmi/chains';

export const ARENA_ADDRESS_MAP: AddressMap = {
  [goerli.id]: '0x94ee3eD7548d18e7eB168387EcbFEc085D72E33b',
};
export const SONGADAY_CONTRACT_ADDRESS = (process.env.SONGADAY_CONTRACT_ADDRESS ??
  '0x19b703f65aA7E1E775BD06c2aa0D0d08c80f1C45') as Address;
