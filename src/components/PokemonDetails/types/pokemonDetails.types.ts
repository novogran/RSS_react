import type { Pokemon } from '../../PokemonSearch/types/pokemonSearch.types';

export interface PokemonDetailsProps {
  pokemon: Pokemon;
  loading: boolean;
  onClose: () => void;
}
