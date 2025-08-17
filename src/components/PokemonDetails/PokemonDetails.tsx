'use client';

import React from 'react';
import './PokemonDetails.css';
import type { PokemonDetailsProps } from './types/pokemonDetails.types';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const PokemonDetails = ({ pokemon, loading, onClose }: PokemonDetailsProps) => {
  const t = useTranslations('PokemonDetails');
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
          <div
            className="loading-spinner"
            data-testid="loading-spinner"
            aria-label={t('loadingAriaLabel')}
          ></div>
          <p>{t('loadingText')}</p>
        </div>
      )}
      <button
        onClick={onClose}
        className="close-details-button"
        aria-label={t('closeButtonLabel')}
      >
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
          <Image
            src={imageUrl}
            alt={t('imageAlt', { name: pokemon.name })}
            width={200}
            height={200}
            priority={true}
          />
        </div>
      )}

      <div className="pokemon-details-content">
        <div className="detail-section">
          <h3>{t('physicalTitle')}</h3>
          <div className="physical-details">
            <div>
              <span>{t('heightLabel')}</span>
              <span>
                {(pokemon.height || 0) / 10}
                {t('metersAbbr')}
              </span>
            </div>
            <div>
              <span>{t('weightLabel')}</span>
              <span>
                {(pokemon.weight || 0) / 10}
                {t('kilogramsAbbr')}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>{t('typesTitle')}</h3>
          <div className="types-container">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className={`type-badge type-${type}`}
                aria-label={t('typeBadge', { type })}
              >
                {capitalize(type)}
              </span>
            ))}
          </div>
        </div>

        <div className="detail-section">
          <h3>{t('abilitiesTitle')}</h3>
          <div className="abilities-container">
            {[...new Set(pokemon.abilities)].map((ability) => (
              <span
                key={ability}
                className="ability-badge"
                aria-label={t('abilityBadge', { ability })}
              >
                {capitalize(ability)}
              </span>
            ))}
          </div>
        </div>

        {pokemon.stats && (
          <div className="detail-section">
            <h3>{t('statsTitle')}</h3>
            <div className="stats-container">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="stat-row">
                  <span className="stat-name">
                    {t(`stats.${stat.stat.name}`, {
                      defaultValue: capitalize(stat.stat.name),
                    })}
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
