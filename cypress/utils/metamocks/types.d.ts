import { BaseContract, ContractTransaction } from '@ethersproject/contracts';

import { MetamocksContext } from './index';

type Keys<T> = keyof T;
type Values<T> = { [key in keyof T]: T[key] }; //  "myValue1" | "myValue2"

type X = Values<{ a: number; b: string; c: number; d: BigInteger }>;
export type ContractMethods<T extends BaseContract> = Omit<T, keyof BaseContract>;
export type MethodNames<T extends BaseContract> = keyof ContractMethods<T>;

export type ContractFunctionParameters<T> = T extends (...args: infer P) => any ? P : never;
export type ContractFunctionReturnType<T> = T extends (...args: any) => Promise<infer R>
  ? Promise<R extends ContractTransaction ? void : R>
  : any;
export type AbiHandlerMethods<T extends BaseContract> = {
  [methodName in keyof ContractMethods<T>]: (
    ...args: ContractFunctionParameters<ContractMethods<T>[methodName]>
  ) => ContractFunctionReturnType<ContractMethods<T>[methodName]>;
};
export type AbiHandlerInterface<T extends BaseContract> = AbiHandlerMethods<T> & {
  abi: any[];
  context: MetamocksContext;
  handleCall(context: MetamocksContext, data: string, setResult?: (result: string) => void): Promise<void>;
  handleTransaction(context: MetamocksContext, data: string, setResult: (arg0: string) => void): Promise<void>;
};
