import { useCompetition } from 'hooks/useCompetition';
import { useTopic, useTopicChoicesData } from 'hooks/useTopic';
import React, { createContext, ReactNode, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Address } from 'wagmi';

// Define the context
const TopicContext = createContext<
  (ReturnType<typeof useCompetition> & ReturnType<typeof useTopic> & ReturnType<typeof useTopicChoicesData>) | null
>(null);

interface ProviderProps {
  children: ReactNode;
}

// Define the Provider component
export const TopicContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const { topicAddress: topicAddressFromParams, competitionAddress } = useParams();
  const competitionData = useCompetition(competitionAddress as Address | undefined);
  const { topicAddress: topicAddressFromCompetition } = competitionData;
  const topicAddress = (topicAddressFromCompetition || topicAddressFromParams) as Address | undefined;
  const topicData = useTopic(topicAddress);
  const topicChoiceData = useTopicChoicesData(topicAddress);

  return (
    <TopicContext.Provider
      value={{
        ...competitionData,
        ...topicData,
        ...topicChoiceData,
        topicAddress,
      }}
    >
      {children}
    </TopicContext.Provider>
  );
};

export const useTopicContext = () => {
  const context = useContext(TopicContext);
  if (context === null) {
    throw new Error('TopicContext must be used within a TopicContexttProvider');
  }
  return context;
};
