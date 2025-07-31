import { API_URL, ITEMS_PER_PAGE } from '../constants';
import type {
  PokemonListResponse,
  PokemonDetailResponse,
} from '../components/PokemonSearch/types/pokemonSearch.types';

export const fetchPokemonList = async (
  page: number = 1
): Promise<PokemonListResponse> => {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const response = await fetch(
    `${API_URL}?limit=${ITEMS_PER_PAGE}&offset=${offset}`
  );
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return response.json();
};

export const fetchPokemonByName = async (
  name: string
): Promise<PokemonDetailResponse> => {
  const response = await fetch(`${API_URL}/${name.toLowerCase()}`);
  if (!response.ok) {
    throw new Error(
      response.status === 404 ? 'Pokémon not found' : 'Failed to fetch'
    );
  }
  return response.json();
};

export const fetchPokemonDetails = async (
  id: number
): Promise<PokemonDetailResponse> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Failed to fetch details');
  return response.json();
};
