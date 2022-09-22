import MulticallJson from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json';
import { BigNumber } from 'ethers';

import { UniswapInterfaceMulticall } from '../../../src/abis/types/uniswap';
import { AbiHandler, isTheSameAddress } from '../metamocks';
import { AbiHandlerInterface } from '../metamocks/types';

const { abi: MulticallABI } = MulticallJson;

export default class MulticallUniswapAbiHandler
  extends AbiHandler<UniswapInterfaceMulticall>
  implements AbiHandlerInterface<UniswapInterfaceMulticall>
{
  getCurrentBlockTimestamp(decodedInput: any[]): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  getEthBalance(decodedInput: any[]): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  async multicall(decodedInput: any[]) {
    const [calls] = decodedInput;
    const results: any[] = [];
    for (const call of calls) {
      const [callAddress, gasEstimated, callInput] = call;
      for (const contractAddress in this.context.handlers) {
        if (isTheSameAddress(contractAddress, callAddress)) {
          await this.context.handlers[contractAddress].handleCall(context, callInput, (r: string) =>
            results.push([true, gasEstimated, r]),
          );
        }
      }
    }
    return [this.context.getLatestBlock().number, results];
  }
}
