import React from 'react';
import './App.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PokemonSearch } from './components/PokemonSearch';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { NotFound } from './components/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PokemonSearch />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/page/:page',
    element: <PokemonSearch />,
  },
  {
    path: '/page/:page/details/:detailsId',
    element: <PokemonSearch />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

const App: React.FC = () => (
  <ErrorBoundary>
    <div className="app-container">
      <h1 className="app-title">Pokémon Search</h1>
      <RouterProvider router={router} />
    </div>
  </ErrorBoundary>
);

export default App;
