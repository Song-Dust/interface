import './App.css';

import Arena from 'pages';
import Topic from 'pages/topic';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import RoutePath from './routes';

function App() {
  return (
    <Routes>
      <Route path={RoutePath.CATEGORY} element={<Topic />} />
      <Route path={RoutePath.LANDING} element={<Arena />} />
    </Routes>
  );
}

export default App;
