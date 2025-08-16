import type { Pokemon } from '../../../types/pokemonSearch.types';

export interface PokemonDetailsProps {
  pokemon: Pokemon;
  loading: boolean;
  onClose: () => void;
}
