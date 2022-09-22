import { BaseContract, ContractTransaction } from '@ethersproject/contracts';

import { MetamocksContext } from './index';

export type ContractMethods<T extends BaseContract> = Omit<T, keyof BaseContract>;

// export type ContractFunctionParameters<T> = T extends (...args: infer P) => any ? P : never;
export type ContractFunctionReturnType<T> = T extends (...args: any) => Promise<infer R>
  ? Promise<R extends ContractTransaction ? void : R>
  : any;
export type AbiHandlerMethods<T extends BaseContract> = {
  [methodName in keyof ContractMethods<T>]: (
    decodedInput: any[],
  ) => ContractFunctionReturnType<ContractMethods<T>[methodName]>;
};
export type AbiHandlerInterface<T extends BaseContract> = AbiHandlerMethods<T> & {
  abi: any[];
  context: MetamocksContext;
  handleCall(data: string, setResult?: (result: string) => void): Promise<void>;
  handleTransaction(data: string, setResult: (arg0: string) => void): Promise<void>;
};
