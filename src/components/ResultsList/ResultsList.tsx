import React from 'react';
import './ResultsList.css';
import type { ResultsListProps } from '../../types/resultsList.types';
import type { Pokemon } from '../../types/pokemonSearch.types';

class ResultsList extends React.Component<ResultsListProps> {
  capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  shouldComponentUpdate(nextProps: ResultsListProps) {
    return (
      this.props.results !== nextProps.results ||
      this.props.loading !== nextProps.loading ||
      this.props.error !== nextProps.error ||
      this.props.selectedPokemonId !== nextProps.selectedPokemonId
    );
  }

  render() {
    const { results, loading, error, onPokemonSelect, selectedPokemonId } =
      this.props;

    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading Pokémon...</p>
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
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              isSelected={selectedPokemonId === pokemon.id}
              onSelect={onPokemonSelect}
              capitalize={this.capitalize}
            />
          ))}
        </ul>
      </div>
    );
  }
}

class PokemonCard extends React.Component<{
  pokemon: Pokemon;
  isSelected: boolean;
  onSelect: (pokemon: Pokemon) => void;
  capitalize: (str: string) => string;
}> {
  shouldComponentUpdate(nextProps: { pokemon: Pokemon; isSelected: boolean }) {
    return (
      this.props.pokemon !== nextProps.pokemon ||
      this.props.isSelected !== nextProps.isSelected
    );
  }

  handleClick = () => {
    this.props.onSelect(this.props.pokemon);
  };

  render() {
    const { pokemon, isSelected, capitalize } = this.props;

    return (
      <li
        className={`pokemon-card ${isSelected ? 'selected' : ''}`}
        onClick={this.handleClick}
      >
        <div className="pokemon-header">
          <span className="pokemon-id">
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
          <h3 className="pokemon-name">{capitalize(pokemon.name)}</h3>
        </div>
        <div className="pokemon-details">
          <div className="pokemon-type">
            <span>Type:</span>
            <div className="types-container">
              {pokemon.types.map((type) => (
                <span key={type} className={`type-badge type-${type}`}>
                  {capitalize(type)}
                </span>
              ))}
            </div>
          </div>
          <div className="pokemon-abilities">
            <span>Abilities:</span>
            <div className="abilities-container">
              {pokemon.abilities.slice(0, 3).map((ability) => (
                <span key={ability} className="ability-badge">
                  {capitalize(ability)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default ResultsList;
