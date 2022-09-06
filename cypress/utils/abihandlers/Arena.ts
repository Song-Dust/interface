import { BigNumber } from '@ethersproject/bignumber/lib.esm';
import ArenaJson from '@attentionstreams/contracts/artifacts/contracts/main/Arena.sol/Arena.json';

import { AbiHandler, MetamocksContext } from 'metamocks';
import { choices } from '../data';

function isTheSameAddress(address1: string, address2: string) {
  return address1.toLowerCase() === address2.toLowerCase();
}

export class ArenaHandler extends AbiHandler {
  methods = {
    async nextChoiceId(context: MetamocksContext, decodedInput: [BigNumber]) {
      const [topicId] = decodedInput;
      return [Object.values(choices[topicId.toNumber()]).length];
    },

    async topicChoices(context: MetamocksContext, decodedInput: [BigNumber, BigNumber]) {
      const [topicId, choiceId] = decodedInput;
      return [Object.values(choices[topicId.toNumber()][choiceId.toNumber()])];
    },
  };

  constructor() {
    super(ArenaJson.abi);
  }
}
