import type { Pokemon } from '../../PokemonSearch/types/pokemonSearch.types';

export interface PokemonCardProps {
  pokemon: Pokemon;
  isSelected: boolean;
  onSelect: (pokemon: Pokemon) => void;
}
