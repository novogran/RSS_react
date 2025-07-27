import React, { memo } from 'react';
import './ResultsList.css';
import type { ResultsListProps } from '../../types/resultsList.types';
import type { Pokemon } from '../../types/pokemonSearch.types';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

interface PokemonCardProps {
  pokemon: Pokemon;
  isSelected: boolean;
  onSelect: (pokemon: Pokemon) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = memo(
  ({ pokemon, isSelected, onSelect }) => (
    <li
      className={`pokemon-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(pokemon)}
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
  )
);

PokemonCard.displayName = 'PokemonCard';

const ResultsList: React.FC<ResultsListProps> = ({
  results,
  loading,
  error,
  onPokemonSelect,
  selectedPokemonId,
}) => {
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
          />
        ))}
      </ul>
    </div>
  );
};

export default ResultsList;
