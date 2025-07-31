import { API_URL } from '../constants';
import type {
  PokemonDetailResponse,
  Pokemon,
} from '../components/PokemonSearch/types/pokemonSearch.types';

export const prepareData = (pokemonData: PokemonDetailResponse): Pokemon => ({
  name: pokemonData.name,
  url: pokemonData.url || `${API_URL}/${pokemonData.id}`,
  id: pokemonData.id,
  types: pokemonData.types.map((t) => t.type.name),
  abilities: pokemonData.abilities.map((a) => a.ability.name),
  sprites: pokemonData.sprites,
  height: pokemonData.height,
  weight: pokemonData.weight,
  stats: pokemonData.stats,
});
