import React from 'react';
import './ResultsList.css';

interface Pokemon {
  name: string;
  id: number;
  types: string[];
  abilities: string[];
}

interface ResultsListProps {
  results: Pokemon[];
  loading: boolean;
  error: string | null;
}

class ResultsList extends React.Component<ResultsListProps> {
  capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  render() {
    const { results, loading, error } = this.props;

    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Searching for Pokémon...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <h3>Error loading Pokémon</h3>
          <p>{error}</p>
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="no-results">
          <div className="pikachu-icon">🐭</div>
          <h3>No Pokémon found</h3>
          <p>Try searching for a different Pokémon name.</p>
        </div>
      );
    }

    return (
      <div className="results-container">
        <h2 className="results-title">Search Results</h2>
        <ul className="pokemon-list">
          {results.map((pokemon) => (
            <li key={pokemon.id} className="pokemon-card">
              <div className="pokemon-header">
                <span className="pokemon-id">
                  #{pokemon.id.toString().padStart(3, '0')}
                </span>
                <h3 className="pokemon-name">
                  {this.capitalize(pokemon.name)}
                </h3>
              </div>
              <div className="pokemon-details">
                <div className="pokemon-type">
                  <span>Type:</span>
                  <div className="types-container">
                    {pokemon.types.map((type) => (
                      <span key={type} className={`type-badge type-${type}`}>
                        {this.capitalize(type)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pokemon-abilities">
                  <span>Abilities:</span>
                  <div className="abilities-container">
                    {pokemon.abilities.slice(0, 3).map((ability) => (
                      <span key={ability} className="ability-badge">
                        {this.capitalize(ability)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ResultsList;
