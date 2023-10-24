import { Address } from 'wagmi';

export const SONGADAY_CONTRACT_ADDRESS = (process.env.SONGADAY_CONTRACT_ADDRESS ??
  '0x19b703f65aA7E1E775BD06c2aa0D0d08c80f1C45') as Address;
