import { useCompetitionSnapshotCycle, useCompetitionTopic } from 'abis/types/generated';
import { Address } from 'wagmi';

export function useCompetition(competitionAddress: Address | undefined) {
  const { data: topicAddress } = useCompetitionTopic({
    address: competitionAddress,
  });

  const { data: snapshotCycle } = useCompetitionSnapshotCycle({
    address: competitionAddress,
  });

  return {
    topicAddress,
    snapshotCycle,
  };
}
