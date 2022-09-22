import { BigNumber } from '@ethersproject/bignumber';
import { Zero } from '@ethersproject/constants';
import { AbiHandler, AbiHandlerInterface } from 'metamocks';

import ERC20_ABI from '../../../src/abis/erc20.json';
import { Erc20 } from '../../../src/abis/types';

export class SongAbiHandler extends AbiHandler<Erc20> implements AbiHandlerInterface<Erc20> {
  abi = ERC20_ABI;

  name(decodedInput: any[]): Promise<[string]> {
    throw new Error('Method not implemented.');
  }

  approve(decodedInput: any[]): Promise<[true] | [false]> {
    throw new Error('Method not implemented.');
  }

  totalSupply(decodedInput: any[]): Promise<[BigNumber]> {
    throw new Error('Method not implemented.');
  }

  transferFrom(decodedInput: any[]): Promise<[true] | [false]> {
    throw new Error('Method not implemented.');
  }

  decimals(decodedInput: any[]): Promise<[number]> {
    throw new Error('Method not implemented.');
  }

  async balanceOf(decodedInput: any[]): Promise<[BigNumber]> {
    const [_owner] = decodedInput;
    return [BigNumber.from(10).pow(16)];
  }

  symbol(decodedInput: any[]): Promise<[string]> {
    throw new Error('Method not implemented.');
  }

  transfer(decodedInput: any[]): Promise<[true] | [false]> {
    throw new Error('Method not implemented.');
  }

  async allowance(decodedInput: any[]): Promise<[BigNumber]> {
    const [_owner, _spender] = decodedInput;
    return [Zero];
  }
}
