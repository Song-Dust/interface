import { BaseContract } from '@ethersproject/contracts';

import MetamocksContext from './context';
import { AbiHandlerInterface } from './types';
import { decodeEthCall, encodeEthResult } from './utils/abi';

export default class AbiHandler<T extends BaseContract> implements AbiHandlerInterface<BaseContract> {
  abi: any[] = [];
  context: MetamocksContext = new MetamocksContext(5);

  constructor(context: MetamocksContext, abi?: any[]) {
    this.context = context;
    if (abi) {
      this.abi = abi;
    }
  }

  async handleCall(context: MetamocksContext, data: string, setResult?: (result: string) => void) {
    const decoded = decodeEthCall<T>(this.abi, data);
    const res: any = await (this as unknown as AbiHandlerInterface<T>)[decoded.method](context, ...decoded.inputs);
    setResult?.(encodeEthResult(this.abi, decoded.method as string, res));
  }

  async handleTransaction(context: MetamocksContext, data: string, setResult: (arg0: string) => void) {
    await this.handleCall(context, data);
    setResult(context.getFakeTransactionHash());
  }
}
