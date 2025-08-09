import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LOCAL_STORAGE_SEARCHTERM_KEY } from '../constants';
import { useLocalStorage } from './useLocalStorage';
import type {
  Pokemon,
  PokemonSearchState,
} from '../components/PokemonSearch/types/pokemonSearch.types';
import {
  useGetPokemonListQuery,
  useGetPokemonByNameQuery,
  useGetPokemonDetailsQuery,
} from '../utils/api';
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
  } = useGetPokemonListQuery(page, {
    skip: !!searchTerm,
  });

  const {
    data: searchData,
    isFetching: searchLoading,
    error: searchError,
  } = useGetPokemonByNameQuery(searchTerm, {
    skip: !searchTerm,
  });

  const {
    data: pokemonDetails,
    isFetching: detailsLoading,
    error: detailsError,
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

    if (error) {
      let errorMessage = 'Failed to fetch Pokémon data';

      if ('status' in error) {
        const apiError = error as FetchBaseQueryError;
        if (typeof apiError.data === 'object' && apiError.data !== null) {
          errorMessage =
            (apiError.data as { message?: string }).message || errorMessage;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        listLoading: false,
      }));
    }
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

  const { refetch: refetchList } = useGetPokemonListQuery(page, {
    skip: !!searchTerm,
  });

  const { refetch: refetchSearch } = useGetPokemonByNameQuery(searchTerm, {
    skip: !searchTerm,
  });

  const { refetch: refetchDetails } = useGetPokemonDetailsQuery(
    Number(detailsId),
    {
      skip: !detailsId,
    }
  );

  const handleRefresh = () => {
    if (searchTerm) {
      refetchSearch();
    } else {
      refetchList();
    }
    if (detailsId) refetchDetails();
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
