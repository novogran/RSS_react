import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import PokemonSearch from './components/PokemonSearch';

class App extends React.Component {
  render() {
    return (
      <ErrorBoundary>
        <div className="app-container">
          <h1 className="app-title">Pokémon Search</h1>
          <PokemonSearch />
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
