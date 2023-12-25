import './App.css';

import { TopicContextProvider } from 'contexts/TopicContext';
import Arena from 'pages';
import Competition from 'pages/competition';
import Topic from 'pages/topic';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import RoutePath from './routes';

function App() {
  return (
    <Routes>
      <Route
        path={RoutePath.TOPIC}
        element={
          <TopicContextProvider>
            <Topic />
          </TopicContextProvider>
        }
      />
      <Route
        path={RoutePath.COMPETITION}
        element={
          <TopicContextProvider>
            <Competition />
          </TopicContextProvider>
        }
      />
      <Route path={RoutePath.LANDING} element={<Arena />} />
    </Routes>
  );
}

export default App;
