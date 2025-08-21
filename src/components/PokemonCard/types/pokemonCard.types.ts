import type { Pokemon } from '../../../types/pokemonSearch.types';

export interface PokemonCardProps {
  pokemon: Pokemon;
  isSelected: boolean;
  onSelect: (pokemon: Pokemon) => void;
}
