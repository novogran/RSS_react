import React from 'react';
import './PokemonDetails.css';
import type { PokemonDetailsProps } from './types/pokemonDetails.types';

const PokemonDetails = ({ pokemon, loading, onClose }: PokemonDetailsProps) => {
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const imageUrl =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default ||
    '';

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="pokemon-details-container" onClick={handleContainerClick}>
      {loading && (
        <div className="pokemon-details-container loading">
          <div className="loading-spinner" data-testid="loading-spinner"></div>
          <p>Loading details...</p>
        </div>
      )}
      <button onClick={onClose} className="close-details-button">
        ×
      </button>

      <div className="pokemon-details-header">
        <span className="pokemon-id">
          #{pokemon.id.toString().padStart(3, '0')}
        </span>
        <h2 className="pokemon-name">{capitalize(pokemon.name)}</h2>
      </div>

      {imageUrl && (
        <div className="pokemon-image">
          <img src={imageUrl} alt={pokemon.name} />
        </div>
      )}

      <div className="pokemon-details-content">
        <div className="detail-section">
          <h3>Physical</h3>
          <div className="physical-details">
            <div>
              <span>Height</span>
              <span>{(pokemon.height || 0) / 10}m</span>
            </div>
            <div>
              <span>Weight</span>
              <span>{(pokemon.weight || 0) / 10}kg</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Types</h3>
          <div className="types-container">
            {pokemon.types.map((type) => (
              <span key={type} className={`type-badge type-${type}`}>
                {capitalize(type)}
              </span>
            ))}
          </div>
        </div>

        <div className="detail-section">
          <h3>Abilities</h3>
          <div className="abilities-container">
            {pokemon.abilities.map((ability) => (
              <span key={ability} className="ability-badge">
                {capitalize(ability)}
              </span>
            ))}
          </div>
        </div>

        {pokemon.stats && (
          <div className="detail-section">
            <h3>Stats</h3>
            <div className="stats-container">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="stat-row">
                  <span className="stat-name">
                    {capitalize(stat.stat.name)}
                  </span>
                  <div className="stat-bar">
                    <div
                      className="stat-value"
                      style={{ width: `${Math.min(100, stat.base_stat)}%` }}
                    >
                      {stat.base_stat}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonDetails;
