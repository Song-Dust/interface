import { BaseContract, CallOverrides, ContractTransaction, Overrides } from '@ethersproject/contracts';
import { BigNumber, BigNumberish } from 'ethers';

import ERC20_ABI from '../../../src/abis/erc20.json';
import { Erc20 } from '../../../src/abis/types';
import { decodeEthCall, encodeEthResult, MetamocksContext } from '../metamocks';

type ContractMethods<T extends BaseContract> = Omit<T, keyof BaseContract>;
type ContractFunctionParameters<T> = T extends (...args: infer P) => any ? P : never;
type ContractFunctionReturnType<T> = T extends (...args: any) => Promise<infer R>
  ? Promise<R extends ContractTransaction ? void : R>
  : any;

type AbiHandlerMethods<T extends BaseContract> = {
  [methodName in keyof ContractMethods<T>]: (
    ...args: [context: MetamocksContext, ...params: ContractFunctionParameters<ContractMethods<T>[methodName]>]
  ) => ContractFunctionReturnType<ContractMethods<T>[methodName]>;
};

type AbiHandlerInterface<T extends BaseContract> = AbiHandlerMethods<T> & {
  abi: any[];
};

export class AbiHandler implements AbiHandlerInterface<BaseContract> {
  abi: any[] = [];
}

export class SongAbiHandler extends AbiHandler implements AbiHandlerInterface<Erc20> {
  abi = ERC20_ABI;

  symbol(context: MetamocksContext, overrides?: CallOverrides | undefined): Promise<string> {
    throw new Error('Method not implemented.');
  }

  name(context: MetamocksContext, overrides?: CallOverrides | undefined): Promise<string> {
    throw new Error('Method not implemented.');
  }

  approve(
    context: MetamocksContext,
    _spender: string,
    _value: BigNumberish,
    overrides?: (Overrides & { from?: string | Promise<string> | undefined }) | undefined,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  totalSupply(context: MetamocksContext, overrides?: CallOverrides | undefined): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  transferFrom(
    context: MetamocksContext,
    _from: string,
    _to: string,
    _value: BigNumberish,
    overrides?: (Overrides & { from?: string | Promise<string> | undefined }) | undefined,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  decimals(context: MetamocksContext, overrides?: CallOverrides | undefined): Promise<number> {
    throw new Error('Method not implemented.');
  }

  balanceOf(context: MetamocksContext, _owner: string, overrides?: CallOverrides | undefined): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  transfer(
    context: MetamocksContext,
    _to: string,
    _value: BigNumberish,
    overrides?: (Overrides & { from?: string | Promise<string> | undefined }) | undefined,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  allowance(
    context: MetamocksContext,
    _owner: string,
    _spender: string,
    overrides?: CallOverrides | undefined,
  ): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  async handleCall(context: MetamocksContext, data: string, setResult?: (arg0: string) => void) {
    const decoded = decodeEthCall<Erc20>(this.abi, data);
    const res = await this[decoded.method](context, ...decoded.inputs);
    setResult?.(encodeEthResult(this.abi, decoded.method, res));
  }
}
