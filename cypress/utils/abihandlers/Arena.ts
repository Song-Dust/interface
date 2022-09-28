import ArenaJson from '@attentionstreams/contracts/artifacts/contracts/main/Arena.sol/Arena.json';
import { BigNumber } from '@ethersproject/bignumber';
import { AbiHandler, AbiHandlerInterface } from 'metamocks';

import { Arena } from '../../../src/types/contracts';
import { choices } from '../data';

export class ArenaHandler extends AbiHandler<Arena> implements AbiHandlerInterface<Arena> {
  DEFAULT_ADMIN_ROLE(decodedInput: any[]): Promise<[string]> {
    throw new Error('Method not implemented.');
  }

  addChoice(decodedInput: any[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  addTopic(decodedInput: any[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  aggregatedVoterPosition(decodedInput: any[]): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  balanceOf(decodedInput: any[]): Promise<[BigNumber]> {
    throw new Error('Method not implemented.');
  }

  calculateFees(decodedInput: any[]): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  choiceSummery(decodedInput: any[]): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  claimableBalance(decodedInput: any[]): Promise<[BigNumber]> {
    throw new Error('Method not implemented.');
  }

  getActiveCycle(decodedInput: any[]): Promise<[BigNumber]> {
    throw new Error('Method not implemented.');
  }

  getRoleAdmin(decodedInput: any[]): Promise<[string]> {
    throw new Error('Method not implemented.');
  }

  grantRole(decodedInput: any[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  hasRole(decodedInput: any[]): Promise<[false] | [true]> {
    throw new Error('Method not implemented.');
  }

  info(decodedInput: any[]): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  initialize(decodedInput: any[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  isChoiceDeleted(decodedInput: any[]): Promise<[false] | [true]> {
    throw new Error('Method not implemented.');
  }

  isTopicDeleted(decodedInput: any[]): Promise<[false] | [true]> {
    throw new Error('Method not implemented.');
  }

  async nextChoiceId(decodedInput: any[]): Promise<[BigNumber]> {
    const [topicId] = decodedInput;
    return [BigNumber.from(Object.values(choices[topicId.toNumber()]).length)];
  }

  nextClaimIndex(decodedInput: any[]): Promise<[BigNumber]> {
    throw new Error('Method not implemented.');
  }

  nextTopicId(decodedInput: any[]): Promise<[BigNumber]> {
    throw new Error('Method not implemented.');
  }

  positionsLength(decodedInput: any[]): Promise<[BigNumber]> {
    throw new Error('Method not implemented.');
  }

  removeChoice(decodedInput: any[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  removeTopic(decodedInput: any[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  renounceRole(decodedInput: any[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  revokeRole(decodedInput: any[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  supportsInterface(decodedInput: any[]): Promise<[false] | [true]> {
    throw new Error('Method not implemented.');
  }

  async topicChoices(decodedInput: any[]): Promise<any[]> {
    const [topicId, choiceId] = decodedInput;
    return [Object.values(choices[topicId.toNumber()][choiceId.toNumber()])];
  }

  topics(decodedInput: any[]): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  async vote(decodedInput: any[]): Promise<void> {}

  voterPosition(decodedInput: any[]): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  withdrawPosition(decodedInput: any[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  abi = ArenaJson.abi;
}
