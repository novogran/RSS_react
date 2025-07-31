import type { Pokemon } from '../../PokemonSearch/types/pokemonSearch.types';

export type PokemonSort = Omit<Pokemon, 'url'>;

export interface ResultsListProps {
  results: Pokemon[];
  loading: boolean;
  error: string | null;
  onPokemonSelect: (pokemon: Pokemon) => void;
  selectedPokemonId?: number;
}
