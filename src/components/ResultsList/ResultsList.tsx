import './ResultsList.css';
import type { ResultsListProps } from '../../types/resultsList.types';
import { PokemonCard } from '../PokemonCard';

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
