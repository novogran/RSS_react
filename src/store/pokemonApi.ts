import {
  createApi,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { API_URL, ITEMS_PER_PAGE } from '../constants';
import type {
  Pokemon,
  PokemonDetailResponse,
  PokemonListResponse,
} from '../types/pokemonSearch.types';
import { prepareData } from '../utils/common';

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  tagTypes: ['Pokemon'],
  endpoints: (builder) => ({
    getPokemonList: builder.query<Pokemon[], number>({
      async queryFn(page, _api, _extraOptions, baseQuery) {
        try {
          const listResult = await baseQuery(
            `?limit=${ITEMS_PER_PAGE}&offset=${(page - 1) * ITEMS_PER_PAGE}`
          );

          if (listResult.error) {
            return { error: listResult.error as FetchBaseQueryError };
          }

          const response = listResult.data as PokemonListResponse;
          const basePokemons = response.results.map((p) => ({
            name: p.name,
            url: p.url,
            id: parseInt(p.url.split('/').slice(-2, -1)[0]),
            types: [],
            abilities: [],
          }));

          const detailedPokemons = await Promise.all(
            basePokemons.map(async (pokemon) => {
              const detailResult = await baseQuery(`/${pokemon.id}`);
              if (detailResult.error) {
                console.error(
                  `Failed to load details for Pokemon ${pokemon.id}`,
                  detailResult.error
                );
                return pokemon;
              }
              return prepareData({
                ...pokemon,
                ...(detailResult.data as PokemonDetailResponse),
              });
            })
          );

          return { data: detailedPokemons as Pokemon[] };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              data: error,
            } as FetchBaseQueryError,
          };
        }
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
      transformResponse: prepareData,
      providesTags: (result) =>
        result ? [{ type: 'Pokemon', id: result.id }] : [],
      keepUnusedDataFor: 60,
    }),

    getPokemonDetails: builder.query<Pokemon, number>({
      query: (id) => `/${id}`,
      transformResponse: prepareData,
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
