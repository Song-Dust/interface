import { BigNumber } from '@ethersproject/bignumber';

import ERC20_ABI from '../../../src/abis/erc20.json';
import { Erc20 } from '../../../src/abis/types';
import { AbiHandler } from '../metamocks';
import { AbiHandlerInterface } from '../metamocks/types';

export class SongAbiHandler extends AbiHandler<Erc20> implements AbiHandlerInterface<Erc20> {
  abi = ERC20_ABI;

  symbol(decodedInput: any[]): Promise<string> {
    throw new Error('Method not implemented.');
  }

  name(decodedInput: any[]): Promise<string> {
    throw new Error('Method not implemented.');
  }

  approve(decodedInput: any[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  totalSupply(decodedInput: any[]): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  transferFrom(decodedInput: any[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  decimals(decodedInput: any[]): Promise<number> {
    throw new Error('Method not implemented.');
  }

  balanceOf(decodedInput: any[]): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  transfer(decodedInput: any[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  allowance(decodedInput: any[]): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }
}
