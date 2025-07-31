import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { prepareData } from '../utils/common';
import {
  fetchPokemonByName,
  fetchPokemonList,
  fetchPokemonDetails,
} from '../utils/api';
import type {
  Pokemon,
  PokemonSearchState,
} from '../components/PokemonSearch/types/pokemonSearch.types';

export const usePokemonSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<PokemonSearchState>({
    searchTerm: '',
    results: [],
    listLoading: false,
    error: null,
    currentPage: 1,
    totalCount: 0,
  });

  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const loadData = useCallback(async (term: string, page: number) => {
    setState((prev) => ({ ...prev, listLoading: true, error: null }));

    try {
      let results: Pokemon[];
      let totalCount: number;

      if (term.trim()) {
        const pokemon = prepareData(await fetchPokemonByName(term));
        results = [pokemon];
        totalCount = 1;
      } else {
        const listData = await fetchPokemonList(page);

        results = await Promise.all(
          listData.results.map(async (p) => {
            const details = await fetchPokemonDetails(
              parsePokemonIdFromUrl(p.url)
            );
            return prepareData(details);
          })
        );

        totalCount = listData.count;
      }

      setState((prev) => ({
        ...prev,
        results,
        totalCount,
        listLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
        listLoading: false,
        results: [],
        totalCount: 0,
      }));
    }
  }, []);

  const parsePokemonIdFromUrl = (url: string): number => {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2]);
  };

  const loadDetails = useCallback(async (id: number) => {
    setDetailsLoading(true);
    try {
      setSelectedPokemon(prepareData(await fetchPokemonDetails(id)));
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  const pageParam = searchParams.get('page');

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    const detailsId = searchParams.get('details');

    setState((prev) => ({ ...prev, currentPage: page }));
    loadData(state.searchTerm, page);

    if (detailsId) {
      const pokemon = state.results.find((p) => p.id.toString() === detailsId);
      if (pokemon) loadDetails(pokemon.id);
    }
  }, [state.searchTerm, pageParam]);

  return {
    state,
    selectedPokemon,
    detailsLoading,
    handleSearch: (term: string) => {
      setSelectedPokemon(null);
      setState((prev) => ({ ...prev, searchTerm: term }));
      setSearchParams({ page: '1' });
    },
    handlePageChange: (page: number) => {
      setSearchParams({ page: page.toString() });
      setSelectedPokemon(null);
    },
    handlePokemonSelect: (pokemon: Pokemon) => {
      if (selectedPokemon?.id === pokemon.id) {
        setSelectedPokemon(null);
        return;
      }
      setSearchParams(
        { page: state.currentPage.toString(), details: pokemon.id.toString() },
        { replace: true }
      );
      loadDetails(pokemon.id);
    },
    handleCloseDetails: () => {
      setSelectedPokemon(null);
      setSearchParams({ page: state.currentPage.toString() });
    },
  };
};
