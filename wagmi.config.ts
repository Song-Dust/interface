import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';
import { Abi } from 'viem';
import { erc20ABI } from 'wagmi';

import ArenaABI from './src/abis/arena.json';
import ChoiceABI from './src/abis/choice.json';
import SongADayABI from './src/abis/songaday.json';
import TopicABI from './src/abis/topic.json';

export default defineConfig({
  out: 'src/abis/types/generated.ts',
  contracts: [
    {
      name: 'erc20',
      abi: erc20ABI,
    },
    {
      name: 'SongADay',
      abi: SongADayABI as Abi,
    },
    {
      name: 'Arena',
      abi: ArenaABI as Abi,
    },
    {
      name: 'Topic',
      abi: TopicABI as Abi,
    },
    {
      name: 'Choice',
      abi: ChoiceABI as Abi,
    },
  ],
  plugins: [react()],
});
