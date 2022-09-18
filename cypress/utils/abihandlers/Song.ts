import { BigNumber } from '@ethersproject/bignumber/lib.esm';
import { MaxUint256 } from '@ethersproject/constants';
import { AbiHandler, MetamocksContext } from 'metamocks';

import ERC20_ABI from '../../../src/abis/erc20.json';

export default class SongAbiHandler extends AbiHandler {
  methods = {
    async allowance(context: MetamocksContext, decodedInput: [BigNumber, BigNumber]) {
      const [_owner, _spender] = decodedInput;
      return [MaxUint256];
    },
    async balanceOf(context: MetamocksContext, decodedInput: [BigNumber]) {
      const [_owner] = decodedInput;
      return [100000000];
    },
  };

  constructor() {
    super(ERC20_ABI);
  }
}
