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
              [RouteParam.CATEGORY_ADDRESS]: '0x5142A2CC8c164A640f004925429AE0C8367A6A5c',
            })}
          />
        }
      />
    </Routes>
  );
}

export default App;
