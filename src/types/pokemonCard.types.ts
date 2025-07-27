import type { Pokemon } from './pokemonSearch.types';

export interface PokemonCardProps {
  pokemon: Pokemon;
  isSelected: boolean;
  onSelect: (pokemon: Pokemon) => void;
}
