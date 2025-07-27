import type { Pokemon } from './pokemonSearch.types';

export interface PokemonDetailsProps {
  pokemon: Pokemon;
  loading: boolean;
  onClose: () => void;
}
