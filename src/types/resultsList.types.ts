import type { Pokemon } from './pokemonSearch.types';

export type PokemonSort = Omit<Pokemon, 'url'>;

export interface ResultsListProps {
  results: Pokemon[];
  loading: boolean;
  error: string | null;
  onPokemonSelect: (pokemon: Pokemon) => void;
  selectedPokemonId?: number;
  onCloseDetails: () => void;
}
