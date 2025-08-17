import './ResultsList.css';
import type { ResultsListProps } from './types/resultsList.types';
import { PokemonCard } from '../PokemonCard';
import { useTranslations } from 'next-intl';

const ResultsList = ({
  results,
  loading,
  error,
  onPokemonSelect,
  selectedPokemonId,
}: ResultsListProps) => {
  const t = useTranslations('ResultsList');

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" aria-label={t('loadingAriaLabel')} />
        <p>{t('loadingText')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message" role="alert">
        <div className="error-icon" aria-hidden="true">
          ⚠️
        </div>
        <h3>{t('errorTitle')}</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="no-results">
        <div className="pikachu-icon" aria-hidden="true">
          🐭
        </div>
        <h3>{t('noResultsTitle')}</h3>
        <p>{t('noResultsSuggestion')}</p>
      </div>
    );
  }

  return (
    <div className="results-container">
      <h2 className="results-title">{t('resultsTitle')}</h2>
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
