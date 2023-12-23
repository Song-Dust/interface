import { useTopic, useTopicChoicesData } from 'hooks/useTopic';
import React, { createContext, ReactNode, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Address } from 'wagmi';

// Define the context
const TopicContext = createContext<(ReturnType<typeof useTopic> & ReturnType<typeof useTopicChoicesData>) | null>(null);

interface ProviderProps {
  children: ReactNode;
}

// Define the Provider component
export const TopicContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const { topicAddress } = useParams();
  const topicData = useTopic(topicAddress as Address);
  const topicChoiceData = useTopicChoicesData(topicAddress as Address);

  return (
    <TopicContext.Provider
      value={{
        ...topicData,
        ...topicChoiceData,
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
