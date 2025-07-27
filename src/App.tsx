import React from 'react';
import './App.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PokemonSearch } from './components/PokemonSearch';
import { Routes, Route } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <ErrorBoundary>
        <div className="app-container">
          <h1 className="app-title">Pokémon Search</h1>
          <Routes>
            <Route path="/" element={<PokemonSearch />} />
          </Routes>
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
