import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL, ITEMS_PER_PAGE } from '../constants';
import type {
  Pokemon,
  PokemonListResponse,
  PokemonDetailResponse,
  PokemonType,
  PokemonAbility,
} from '../components/PokemonSearch/types/pokemonSearch.types';

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  tagTypes: ['Pokemon'],
  endpoints: (builder) => ({
    getPokemonList: builder.query<Pokemon[], number>({
      query: (page) =>
        `?limit=${ITEMS_PER_PAGE}&offset=${(page - 1) * ITEMS_PER_PAGE}`,
      transformResponse: async (response: PokemonListResponse) => {
        const basePokemons = response.results.map((p) => ({
          name: p.name,
          url: p.url,
          id: parseInt(p.url.split('/').slice(-2, -1)[0]),
          types: [],
          abilities: [],
        }));

        const detailedPokemons = await Promise.all(
          basePokemons.map(async (pokemon) => {
            try {
              const detailResponse = await fetch(
                `${API_URL}/${pokemon.id}`
              ).then((res) => res.json());
              return {
                ...pokemon,
                types: detailResponse.types.map(
                  (t: PokemonType) => t.type.name
                ),
                abilities: detailResponse.abilities.map(
                  (a: PokemonAbility) => a.ability.name
                ),
                sprites: detailResponse.sprites,
                stats: detailResponse.stats,
                height: detailResponse.height,
                weight: detailResponse.weight,
              };
            } catch (error) {
              console.error(
                `Failed to load details for Pokemon ${pokemon.id}`,
                error
              );
              return pokemon;
            }
          })
        );

        return detailedPokemons;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Pokemon' as const, id })),
              { type: 'Pokemon', id: 'LIST' },
            ]
          : [{ type: 'Pokemon', id: 'LIST' }],
      keepUnusedDataFor: 60,
    }),

    getPokemonByName: builder.query<Pokemon, string>({
      query: (name) => `/${name.toLowerCase()}`,
      transformResponse: (response: PokemonDetailResponse) => ({
        id: response.id,
        name: response.name,
        url: response.url,
        types: response.types.map((t) => t.type.name),
        abilities: response.abilities.map((a) => a.ability.name),
        sprites: response.sprites,
        stats: response.stats,
        height: response.height,
        weight: response.weight,
      }),
      providesTags: (result) =>
        result ? [{ type: 'Pokemon', id: result.id }] : [],
      keepUnusedDataFor: 60,
    }),

    getPokemonDetails: builder.query<Pokemon, number>({
      query: (id) => `/${id}`,
      transformResponse: (response: PokemonDetailResponse) => ({
        id: response.id,
        name: response.name,
        url: response.url,
        types: response.types.map((t) => t.type.name),
        abilities: response.abilities.map((a) => a.ability.name),
        sprites: response.sprites,
        stats: response.stats,
        height: response.height,
        weight: response.weight,
      }),
      providesTags: (result) =>
        result ? [{ type: 'Pokemon', id: result.id }] : [],
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useGetPokemonListQuery,
  useGetPokemonByNameQuery,
  useGetPokemonDetailsQuery,
  useLazyGetPokemonListQuery,
  useLazyGetPokemonDetailsQuery,
} = pokemonApi;
