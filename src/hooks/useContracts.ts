import { isAddress } from '@ethersproject/address';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { Web3Provider } from '@ethersproject/providers';
import ArenaJson from '@attentionstreams/contracts/artifacts/contracts/main/Arena.sol/Arena.json';
import { AddressMap, ARENA_ADDRESS, MULTICALL2_ADDRESS, ZERO_ADDRESS } from 'constants/addresses';
import { useMemo } from 'react';
import { Arena } from 'types/contracts/Arena';
import useWeb3React from 'hooks/useWeb3';
import Multicall2Json from '@attentionstreams/contracts/artifacts/contracts/main/multicall.sol/Multicall2.json';
import ERC20_ABI from 'abis/erc20.json';
import { Providers } from 'constants/providers';
import { Erc20 } from 'abis/types';
import { Multicall2 } from 'types/contracts';

const { abi: ArenaABI } = ArenaJson;
const { abi: Multicall2ABI } = Multicall2Json;

export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | AddressMap | undefined,
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const { library, account, chainId } = useWeb3React();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !chainId) return null;
    let address: string | undefined;
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address || address === ZERO_ADDRESS) return null;
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined);
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [addressOrAddressMap, ABI, library, chainId, withSignerIfPossible, account]) as T;
}

export function getProviderOrSigner(library: any, account?: string): any {
  return account ? getSigner(library, account) : library;
}

export function getSigner(library: any, account: string): any {
  return library.getSigner(account).connectUnchecked();
}

export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string,
  targetChainId?: number,
): Contract | null {
  if (!isAddress(address) || address === AddressZero) {
    throw new Error(`Invalid 'address' parameter '${address}'.`);
  }

  let providerOrSigner;
  if (targetChainId) {
    providerOrSigner = getProviderOrSigner(Providers[targetChainId], account);
  } else {
    providerOrSigner = getProviderOrSigner(library, account);
  }

  return new Contract(address, ABI, providerOrSigner) as any;
}

export function useArenaContract() {
  return useContract<Arena>(ARENA_ADDRESS, ArenaABI, true);
}

export function useMulticall2Contract() {
  const { chainId } = useWeb3React();
  const address = useMemo(() => (chainId ? MULTICALL2_ADDRESS[chainId] : undefined), [chainId]);
  return useContract<Multicall2>(address, Multicall2ABI);
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible);
}
