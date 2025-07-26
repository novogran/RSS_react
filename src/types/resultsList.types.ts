import type { Pokemon } from './pokemonSearch.types';

export type PokemonSort = Omit<Pokemon, 'url'>;

export interface ResultsListProps {
  results: PokemonSort[];
  loading: boolean;
  error: string | null;
}
