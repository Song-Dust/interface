import { AbiHandler, isTheSameAddress, MetamocksContext } from 'metamocks';
import MulticallJson from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json';

const { abi: MulticallABI } = MulticallJson;

export default class MulticallUniswapAbiHandler extends AbiHandler {
  methods = {
    async multicall(context: MetamocksContext, decodedInput: any[]) {
      const [calls] = decodedInput;
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
    },
  };

  constructor() {
    super(MulticallABI);
  }
}
