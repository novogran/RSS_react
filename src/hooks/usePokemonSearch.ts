import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LOCAL_STORAGE_SEARCHTERM_KEY } from '../constants';
import { useLocalStorage } from './useLocalStorage';
import type { Pokemon, PokemonSearchState } from '../types/pokemonSearch.types';
import {
  useGetPokemonListQuery,
  useGetPokemonByNameQuery,
  useGetPokemonDetailsQuery,
} from '../store/pokemonApi';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

export const usePokemonSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [savedSearchTerm] = useLocalStorage(LOCAL_STORAGE_SEARCHTERM_KEY, '');
  const [searchTerm, setSearchTerm] = useState(savedSearchTerm || '');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const detailsId = searchParams.get('details');
  const [showDetails, setShowDetails] = useState(false);

  const {
    data: listData,
    isFetching: listLoading,
    error: listError,
    refetch: refetchList,
  } = useGetPokemonListQuery(page, {
    skip: !!searchTerm,
  });

  const {
    data: searchData,
    isFetching: searchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useGetPokemonByNameQuery(searchTerm, {
    skip: !searchTerm,
  });

  const {
    data: pokemonDetails,
    isFetching: detailsLoading,
    error: detailsError,
    refetch: refetchDetails,
  } = useGetPokemonDetailsQuery(Number(detailsId), {
    skip: !detailsId,
  });

  const [state, setState] = useState<PokemonSearchState>({
    searchTerm: savedSearchTerm,
    results: [],
    listLoading: false,
    error: null,
    currentPage: page,
    totalCount: 0,
  });

  useEffect(() => {
    setShowDetails(!!detailsId);
  }, [detailsId]);

  useEffect(() => {
    if (listData && !searchTerm) {
      setState((prev) => ({
        ...prev,
        results: listData,
        totalCount: 1000,
        listLoading: false,
        error: null,
      }));
    }
  }, [listData, searchTerm]);

  useEffect(() => {
    if (searchTerm && searchData) {
      setState((prev) => ({
        ...prev,
        results: [searchData],
        totalCount: 1,
        listLoading: false,
        error: null,
      }));
    }
  }, [page, searchData, searchTerm]);

  useEffect(() => {
    const error = listError || searchError || detailsError;

    setState((prev) => ({
      ...prev,
      error: getErrorMessage(error),
      listLoading: false,
    }));
  }, [listError, searchError, detailsError]);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      currentPage: page,
      listLoading: listLoading || searchLoading,
    }));
  }, [page, listLoading, searchLoading]);

  const handlePokemonSelect = (pokemon: Pokemon) => {
    if (detailsId === pokemon.id.toString()) {
      setSearchParams(
        { page: state.currentPage.toString() },
        { replace: true }
      );
    } else {
      setSearchParams(
        {
          page: state.currentPage.toString(),
          details: pokemon.id.toString(),
        },
        { replace: true }
      );
    }
  };

  const handleCloseDetails = () => {
    setSearchParams({ page: state.currentPage.toString() }, { replace: true });
  };

  const handleRefresh = () => {
    if (searchTerm) {
      refetchSearch();
    } else {
      refetchList();
    }
    if (detailsId) refetchDetails();
  };

  const getErrorMessage = (error: unknown): string => {
    let errorMessage = 'Failed to fetch Pokémon data';

    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as FetchBaseQueryError;
      if (typeof apiError.data === 'object' && apiError.data !== null) {
        errorMessage =
          (apiError.data as { message?: string }).message || errorMessage;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return errorMessage;
  };

  return {
    state: {
      ...state,
      searchTerm,
    },
    selectedPokemon: showDetails ? pokemonDetails : null,
    detailsLoading: showDetails ? detailsLoading : false,
    handleSearch: (term: string) => {
      setSearchTerm(term);
      setSearchParams({ page: '1' });
    },
    handlePageChange: (page: number) => {
      setSearchParams({ page: page.toString() });
    },
    handlePokemonSelect,
    handleCloseDetails,
    handleRefresh,
  };
};
