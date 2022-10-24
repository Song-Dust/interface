import ArenaJson from '@attentionstreams/contracts/artifacts/contracts/main/Arena.sol/Arena.json';
import { isAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import MulticallJson from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json';
import { useWeb3React } from '@web3-react/core';
import ERC20_ABI from 'abis/erc20.json';
import ERC20_BYTES32_ABI from 'abis/erc20_bytes32.json';
import SONGADAY_ABI from 'abis/songaday.json';
import { Erc20, Songaday } from 'abis/types';
import { ARENA_ADDRESS, MULTICALL_ADDRESS, SONGADAY_CONTRACT_ADDRESS } from 'constants/addresses';
import { SupportedChainId } from 'constants/chains';
import { Providers } from 'constants/providers';
import { useMemo } from 'react';
import { Arena } from 'types/contracts/Arena';

import { UniswapInterfaceMulticall } from '../abis/types/uniswap';

const { abi: ArenaABI } = ArenaJson;
const { abi: MulticallABI } = MulticallJson;

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true,
  targetChainId?: SupportedChainId,
): T | null {
  const { provider, account, chainId } = useWeb3React();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !provider || !chainId) return null;
    let address: string | undefined;
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address) return null;
    try {
      return getContract(address, ABI, provider, withSignerIfPossible && account ? account : undefined, targetChainId);
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [addressOrAddressMap, ABI, provider, chainId, withSignerIfPossible, account, targetChainId]) as T;
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
  targetChainId?: SupportedChainId,
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

export function useSongadayContract() {
  return useContract<Songaday>(SONGADAY_CONTRACT_ADDRESS, SONGADAY_ABI, true, SupportedChainId.MAINNET);
}

export function useInterfaceMulticall() {
  return useContract<UniswapInterfaceMulticall>(MULTICALL_ADDRESS, MulticallABI, false) as UniswapInterfaceMulticall;
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}
