import './App.css';

import Category from 'pages/category';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import RoutePath, { getRoute, RouteParam } from './routes';

function App() {
  return (
    <Routes>
      <Route path={RoutePath.CATEGORY} element={<Category />} />
      <Route
        path={RoutePath.LANDING}
        element={
          <Navigate
            to={getRoute(RoutePath.CATEGORY, {
              [RouteParam.CATEGORY_ID]: '2',
            })}
          />
        }
      />
    </Routes>
  );
}

export default App;
