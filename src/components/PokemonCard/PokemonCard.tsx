import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './PokemonCard.css';
import type { PokemonCardProps } from './types/pokemonCard.types';
import {
  selectedPokemonSelector,
  togglePokemonSelection,
} from '../store/pokemonSelectionSlice';
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const PokemonCard = memo(
  ({ pokemon, isSelected, onSelect }: PokemonCardProps) => {
    const dispatch = useDispatch();
    const selectedPokemons = useSelector(selectedPokemonSelector);
    const isChecked = !!selectedPokemons.find((item) => item.id === pokemon.id);

    const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
      e.stopPropagation();
      dispatch(togglePokemonSelection(pokemon));
    };

    const handleCardClick = (e: React.MouseEvent<HTMLLIElement>) => {
      if (!(e.target instanceof HTMLInputElement)) {
        onSelect(pokemon);
      }
    };

    return (
      <li
        className={`pokemon-card ${isSelected ? 'selected' : ''}`}
        onClick={handleCardClick}
      >
        <div className="pokemon-header">
          <span className="pokemon-id">
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
          <h3 className="pokemon-name">{capitalize(pokemon.name)}</h3>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => {}}
            onClick={handleCheckboxClick}
            className="pokemon-checkbox"
          />
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
);

PokemonCard.displayName = 'PokemonCard';

export default PokemonCard;
