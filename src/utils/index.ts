import { getAddress } from '@ethersproject/address';
import { BigNumber } from '@ethersproject/bignumber';
import { hexStripZeros } from '@ethersproject/bytes';
import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

// account is not optional
function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any);
}

export function shortenAddress(address: string | null | undefined) {
  if (!address) return '';
  const addressStart = address.substring(0, 6);
  const addressEnd = address.substring(address.length - 4);
  return `${addressStart}...${addressEnd}`;
}

export function formatChainId(chainId: string) {
  return hexStripZeros(BigNumber.from(chainId).toHexString());
}

export const parseIpfsUri = (text: string) => text.replace('ipfs://', 'https://ipfs.io/ipfs/');

export const parsePinataIpfsUri = (text: string) =>
  text.replace('ipfs://', 'https://gray-liquid-boa-570.mypinata.cloud/ipfs/');
