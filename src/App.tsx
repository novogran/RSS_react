import './App.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PokemonSearch } from './components/PokemonSearch';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { NotFound } from './components/NotFound';
import { AboutPage } from './components/AboutPage';
import { Header } from './components/Header';
import { ThemeProvider } from './context/ThemeProvider';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <Header />
        <PokemonSearch />
      </ErrorBoundary>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/page/:page',
    element: (
      <ErrorBoundary>
        <Header />
        <PokemonSearch />
      </ErrorBoundary>
    ),
  },
  {
    path: '/page/:page/details/:detailsId',
    element: (
      <ErrorBoundary>
        <Header />
        <PokemonSearch />
      </ErrorBoundary>
    ),
  },
  {
    path: '/about',
    element: (
      <ErrorBoundary>
        <Header />
        <AboutPage />
      </ErrorBoundary>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

const App = () => (
  <ThemeProvider>
    <RouterProvider router={router} />;
  </ThemeProvider>
);

export default App;
