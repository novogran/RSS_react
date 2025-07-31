import { vi } from 'vitest';
import type {
  Pokemon,
  PokemonDetailResponse,
  PokemonListResponse,
} from '../../components/PokemonSearch/types/pokemonSearch.types';

export const mockPokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  types: ['electric'],
  abilities: ['static', 'lightning-rod'],
  height: 4,
  weight: 60,
  stats: [
    { stat: { name: 'hp' }, base_stat: 35 },
    { stat: { name: 'attack' }, base_stat: 55 },
  ],
  sprites: {
    front_default: 'pikachu.png',
    other: {
      'official-artwork': {
        front_default: 'pikachu-artwork.png',
      },
    },
  },
  url: 'https://pokeapi.co/api/v2/pokemon/25/',
};

export const mockApiError = {
  status: 404,
  message: 'Pokémon not found',
};

export const mockFetch = vi.fn();

beforeAll(() => {
  global.fetch = mockFetch;
});

afterEach(() => {
  mockFetch.mockReset();
});

export const mockFailedFetch = (status = 500) => {
  mockFetch.mockResolvedValue({
    ok: false,
    status,
    json: async () => ({ error: `Error ${status}` }),
  });
};

export const mockPokemonListApi: PokemonListResponse = {
  count: 2,
  next: null,
  previous: null,
  results: [
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
  ],
};

export const mockPikachuDetailApi: PokemonDetailResponse = {
  id: 25,
  name: 'pikachu',
  url: 'https://pokeapi.co/api/v2/pokemon/25/',
  types: [{ type: { name: 'electric' } }],
  abilities: [
    { ability: { name: 'static' } },
    { ability: { name: 'lightning-rod' } },
  ],
  sprites: {
    front_default:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    other: {
      'official-artwork': {
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      },
    },
  },
  height: 4,
  weight: 60,
  stats: [
    { base_stat: 35, stat: { name: 'hp' } },
    { base_stat: 55, stat: { name: 'attack' } },
  ],
};

export const mockCharizardDetailApi: PokemonDetailResponse = {
  id: 6,
  name: 'charizard',
  url: 'https://pokeapi.co/api/v2/pokemon/6/',
  types: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }],
  abilities: [
    { ability: { name: 'blaze' } },
    { ability: { name: 'solar-power' } },
  ],
  sprites: {
    front_default:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
    other: {
      'official-artwork': {
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
      },
    },
  },
  height: 17,
  weight: 905,
  stats: [
    { base_stat: 78, stat: { name: 'hp' } },
    { base_stat: 84, stat: { name: 'attack' } },
  ],
};

export const mockSuccessfulApiListFetch = () => {
  mockFetch
    .mockResolvedValueOnce(
      new Response(JSON.stringify(mockPokemonListApi), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )
    .mockResolvedValueOnce(
      new Response(JSON.stringify(mockPikachuDetailApi), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )
    .mockResolvedValueOnce(
      new Response(JSON.stringify(mockCharizardDetailApi), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
};

export const mockSuccessfulApiSingleFetch = () => {
  mockFetch.mockResolvedValue(
    new Response(JSON.stringify(mockPikachuDetailApi), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  );
};
