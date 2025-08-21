'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LOCAL_STORAGE_SEARCHTERM_KEY } from '@/constants';
import { useLocalStorage } from './useLocalStorage';
import type { Pokemon, PokemonSearchState } from '@/types/pokemonSearch.types';
import {
  useGetPokemonListQuery,
  useGetPokemonByNameQuery,
  useGetPokemonDetailsQuery,
} from '../store/pokemonApi';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

export const usePokemonSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [savedSearchTerm] = useLocalStorage(LOCAL_STORAGE_SEARCHTERM_KEY, '');
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setSearchTerm(savedSearchTerm || '');
  }, [savedSearchTerm]);

  const page = isClient ? parseInt(searchParams?.get('page') || '1', 10) : 1;
  const detailsId = isClient ? searchParams?.get('details') : null;
  const [showDetails, setShowDetails] = useState(false);

  const {
    data: listData,
    isFetching: listLoading,
    error: listError,
    refetch: refetchList,
  } = useGetPokemonListQuery(page, {
    skip: !!searchTerm || !isClient,
  });

  const {
    data: searchData,
    isFetching: searchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useGetPokemonByNameQuery(searchTerm, {
    skip: !searchTerm || !isClient,
  });

  const {
    data: pokemonDetails,
    isFetching: detailsLoading,
    error: detailsError,
    refetch: refetchDetails,
  } = useGetPokemonDetailsQuery(Number(detailsId), {
    skip: !detailsId || !isClient,
  });

  const [state, setState] = useState<PokemonSearchState>({
    searchTerm: '',
    results: [],
    listLoading: false,
    error: null,
    currentPage: 1,
    totalCount: 0,
  });

  const updateSearchParams = useCallback(
    (params: Record<string, string>) => {
      if (!isClient) return;

      const newParams = new URLSearchParams(searchParams?.toString() || '');
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });
      router.replace(`${pathname}?${newParams.toString()}`);
    },
    [searchParams, pathname, router, isClient]
  );

  useEffect(() => {
    if (isClient) {
      setShowDetails(!!detailsId);
    }
  }, [detailsId, isClient]);

  useEffect(() => {
    if (listData && !searchTerm && isClient) {
      setState((prev) => ({
        ...prev,
        results: listData,
        totalCount: 1000,
        listLoading: false,
        error: null,
      }));
    }
  }, [listData, searchTerm, isClient]);

  useEffect(() => {
    if (searchTerm && searchData && isClient) {
      setState((prev) => ({
        ...prev,
        results: [searchData],
        totalCount: 1,
        listLoading: false,
        error: null,
      }));
    }
  }, [searchData, searchTerm, isClient]);

  useEffect(() => {
    if (!isClient) return;

    const error = listError || searchError || detailsError;
    setState((prev) => ({
      ...prev,
      error: getErrorMessage(error),
      listLoading: false,
    }));
  }, [listError, searchError, detailsError, isClient]);

  useEffect(() => {
    if (!isClient) return;

    setState((prev) => ({
      ...prev,
      currentPage: page,
      listLoading: listLoading || searchLoading,
    }));
  }, [page, listLoading, searchLoading, isClient]);

  const handlePokemonSelect = useCallback(
    (pokemon: Pokemon) => {
      if (!isClient) return;

      if (detailsId === pokemon.id.toString()) {
        updateSearchParams({ page: state.currentPage.toString(), details: '' });
      } else {
        updateSearchParams({
          page: state.currentPage.toString(),
          details: pokemon.id.toString(),
        });
      }
    },
    [detailsId, state.currentPage, updateSearchParams, isClient]
  );

  const handleCloseDetails = useCallback(() => {
    if (!isClient) return;
    updateSearchParams({ page: state.currentPage.toString(), details: '' });
  }, [state.currentPage, updateSearchParams, isClient]);

  const handleRefresh = useCallback(() => {
    if (!isClient) return;

    if (searchTerm) {
      refetchSearch();
    } else {
      refetchList();
    }
    if (detailsId) refetchDetails();
  }, [
    searchTerm,
    detailsId,
    refetchSearch,
    refetchList,
    refetchDetails,
    isClient,
  ]);

  const handleSearch = useCallback(
    (term: string) => {
      if (!isClient) return;

      setSearchTerm(term);
      updateSearchParams({ page: '1', details: '' });
    },
    [updateSearchParams, isClient]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (!isClient) return;
      updateSearchParams({ page: newPage.toString() });
    },
    [updateSearchParams, isClient]
  );

  const getErrorMessage = (error: unknown): string | null => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;

    const apiError = error as FetchBaseQueryError;
    if (typeof apiError.status === 'string') {
      return `Error: ${apiError.status}`;
    }
    if (typeof apiError.data === 'object' && apiError.data !== null) {
      return (
        (apiError.data as { message?: string })?.message || 'Unknown error'
      );
    }

    return 'Failed to fetch Pokémon data';
  };

  return {
    state: {
      ...state,
      searchTerm: isClient ? searchTerm : '',
      currentPage: isClient ? page : 1,
    },
    selectedPokemon: showDetails ? pokemonDetails : null,
    detailsLoading: showDetails ? detailsLoading : false,
    handleSearch,
    handlePageChange,
    handlePokemonSelect,
    handleCloseDetails,
    handleRefresh,
  };
};
