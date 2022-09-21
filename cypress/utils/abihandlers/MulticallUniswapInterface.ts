import MulticallJson from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json';
import { BigNumber, CallOverrides, Overrides } from 'ethers';

import { UniswapInterfaceMulticall } from '../../../src/abis/types/uniswap';
import { AbiHandler } from '../metamocks';
import { AbiHandlerInterface } from '../metamocks/types';

const { abi: MulticallABI } = MulticallJson;

export default class MulticallUniswapAbiHandler
  extends AbiHandler<UniswapInterfaceMulticall>
  implements AbiHandlerInterface<UniswapInterfaceMulticall>
{
  getCurrentBlockTimestamp(overrides?: CallOverrides | undefined): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  getEthBalance(addr: string, overrides?: CallOverrides | undefined): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  multicall(
    calls: [...UniswapInterfaceMulticall.CallStruct][],
    overrides?: (Overrides & { from?: string | Promise<string> | undefined }) | undefined,
  ): Promise<void> {
    const results: any[] = [];
    for (const call of calls) {
      const [callAddress, gasEstimated, callInput] = call;
      for (const contractAddress in context.handlers) {
        if (isTheSameAddress(contractAddress, callAddress)) {
          await context.handlers[contractAddress].handleCall(context, callInput, (r: string) =>
            results.push([true, gasEstimated, r]),
          );
        }
      }
    }
    return [context.getLatestBlock().number, results];
  }
}
