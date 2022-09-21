import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { CallOverrides, Overrides } from '@ethersproject/contracts';

import ERC20_ABI from '../../../src/abis/erc20.json';
import { Erc20 } from '../../../src/abis/types';
import { AbiHandler } from '../metamocks';
import { AbiHandlerInterface } from '../metamocks/types';

export class SongAbiHandler extends AbiHandler<Erc20> implements AbiHandlerInterface<Erc20> {
  abi = ERC20_ABI;

  symbol(overrides?: CallOverrides | undefined): Promise<string> {
    throw new Error('Method not implemented.');
  }

  name(overrides?: CallOverrides | undefined): Promise<string> {
    throw new Error('Method not implemented.');
  }

  approve(
    _spender: string,
    _value: BigNumberish,
    overrides?: (Overrides & { from?: string | Promise<string> | undefined }) | undefined,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  totalSupply(overrides?: CallOverrides | undefined): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  transferFrom(
    _from: string,
    _to: string,
    _value: BigNumberish,
    overrides?: (Overrides & { from?: string | Promise<string> | undefined }) | undefined,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  decimals(overrides?: CallOverrides | undefined): Promise<number> {
    throw new Error('Method not implemented.');
  }

  balanceOf(_owner: string, overrides?: CallOverrides | undefined): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  transfer(
    _to: string,
    _value: BigNumberish,
    overrides?: (Overrides & { from?: string | Promise<string> | undefined }) | undefined,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  allowance(_owner: string, _spender: string, overrides?: CallOverrides | undefined): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }
}
