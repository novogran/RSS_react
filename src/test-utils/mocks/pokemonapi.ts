import { vi } from 'vitest';

export const mockPokemonList = {
  results: [
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
    { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
  ],
};

export const mockPokemonDetails = {
  id: 25,
  name: 'pikachu',
  url: 'https://pokeapi.co/api/v2/pokemon/25/',
  types: [{ type: { name: 'electric' } }],
  abilities: [
    { ability: { name: 'static' } },
    { ability: { name: 'lightning-rod' } },
  ],
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

export const mockSuccessfulListFetch = () => {
  mockFetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemonList,
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemonDetails,
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockPokemonDetails,
        id: 6,
        name: 'charizard',
      }),
    });
};

export const mockSuccessfulSingleFetch = () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockPokemonDetails,
  });
};

export const mockFailedFetch = (status = 500) => {
  mockFetch.mockResolvedValue({
    ok: false,
    status,
    json: async () => ({ error: `Error ${status}` }),
  });
};
