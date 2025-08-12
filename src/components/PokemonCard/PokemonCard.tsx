import { memo } from 'react';
import './PokemonCard.css';
import type { PokemonCardProps } from './types/pokemonCard.types';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const PokemonCard = memo(
  ({ pokemon, isSelected, onSelect }: PokemonCardProps) => (
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

export default PokemonCard;
