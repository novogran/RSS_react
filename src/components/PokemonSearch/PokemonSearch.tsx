import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../SearchBar';
import { ResultsList } from '../ResultsList';
import { Pagination } from '../Pagination';
import { PokemonDetails } from '../PokemonDetails';
import { API_URL, ITEMS_PER_PAGE } from '../../types/constants';
import type {
  Pokemon,
  PokemonDetailResponse,
  PokemonListResponse,
  PokemonSearchState,
} from '../../types/pokemonSearch.types';

const PokemonSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<PokemonSearchState>({
    searchTerm: '',
    results: [],
    listLoading: false,
    detailsLoading: false,
    error: null,
    shouldThrowError: false,
    currentPage: 1,
    totalCount: 0,
    selectedPokemon: null,
  });

  const prepareData = useCallback(
    (pokemonData: PokemonDetailResponse): Pokemon => ({
      name: pokemonData.name,
      url: `${API_URL}/${pokemonData.id}`,
      id: pokemonData.id,
      types: pokemonData.types.map((t) => t.type.name),
      abilities: pokemonData.abilities.map((a) => a.ability.name),
      sprites: pokemonData.sprites,
      height: pokemonData.height,
      weight: pokemonData.weight,
      stats: pokemonData.stats,
    }),
    []
  );

  const fetchPokemonDetails = useCallback(
    async (id: number) => {
      setState((prev) => ({ ...prev, detailsLoading: true }));
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch details');
      const data: PokemonDetailResponse = await response.json();
      setState((prev) => ({
        ...prev,
        selectedPokemon: prepareData(data),
        detailsLoading: false,
      }));
    },
    [prepareData]
  );

  const fetchData = useCallback(
    async (
      searchTerm: string,
      page: number = 1,
      detailsId: string | null = null
    ) => {
      setState((prev) => ({
        ...prev,
        listLoading: true,
        error: null,
        results: prev.searchTerm !== searchTerm ? [] : prev.results,
      }));

      try {
        const trimmedTerm = searchTerm.trim();
        const offset = (page - 1) * ITEMS_PER_PAGE;
        let apiUrl = API_URL;

        if (trimmedTerm) {
          apiUrl += `/${trimmedTerm.toLowerCase()}`;
        } else {
          apiUrl += `?limit=${ITEMS_PER_PAGE}&offset=${offset}`;
        }

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? 'Pokémon not found'
              : `HTTP error! Status: ${response.status}`
          );
        }

        const data = await response.json();

        if (trimmedTerm) {
          const pokemon = prepareData(data as PokemonDetailResponse);
          setState((prev) => ({
            ...prev,
            results: [pokemon],
            listLoading: false,
            totalCount: 1,
            selectedPokemon: pokemon,
          }));
          setSearchParams({ details: pokemon.id.toString() });
        } else {
          const listData = data as PokemonListResponse;
          const pokemonData = await Promise.all(
            listData.results.map((p) => fetch(p.url).then((res) => res.json()))
          );

          const results = pokemonData.map(prepareData);
          let selectedPokemon = null;

          if (detailsId) {
            selectedPokemon =
              results.find((p) => p.id.toString() === detailsId) || null;
            if (selectedPokemon) {
              await fetchPokemonDetails(selectedPokemon.id);
            }
          }

          setState((prev) => ({
            ...prev,
            results,
            listLoading: false,
            totalCount: listData.count,
            selectedPokemon,
          }));
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: (error as Error).message || 'Failed to fetch data',
          listLoading: false,
          results: [],
          totalCount: 0,
        }));
      }
    },
    [prepareData, fetchPokemonDetails, setSearchParams]
  );

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    const detailsId = searchParams.get('details');
    const savedSearchTerm = localStorage.getItem('pokemonSearchTerm') || '';

    setState((prev) => ({
      ...prev,
      searchTerm: savedSearchTerm,
      currentPage: page,
      listLoading: true,
      selectedPokemon: null,
    }));

    fetchData(savedSearchTerm, page, detailsId);
  }, [fetchData, searchParams]);

  const handleSearchChange = (term: string) => {
    setState((prev) => {
      if (prev.searchTerm === term) return prev;
      return { ...prev, searchTerm: term };
    });
  };

  const handleSearchSubmit = useCallback(() => {
    const trimmedTerm = state.searchTerm.trim();
    localStorage.setItem('pokemonSearchTerm', trimmedTerm);
    setSearchParams({ page: '1' });
    setState((prev) => ({ ...prev, currentPage: 1 }));
    fetchData(trimmedTerm, 1);
  }, [state.searchTerm, fetchData, setSearchParams]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page === state.currentPage) return;

      setSearchParams({ page: page.toString() }, { replace: true });

      setState((prev) => ({
        ...prev,
        currentPage: page,
        selectedPokemon: null,
      }));
    },
    [state.currentPage, setSearchParams]
  );

  const handlePokemonSelect = useCallback(
    async (pokemon: Pokemon) => {
      if (state.selectedPokemon?.id === pokemon.id) return;

      setSearchParams(
        {
          page: state.currentPage.toString(),
          details: pokemon.id.toString(),
        },
        { replace: true }
      );

      setState((prev) => ({
        ...prev,
        selectedPokemon: pokemon,
        detailsLoading: true,
        listLoading: false,
      }));

      const response = await fetch(`${API_URL}/${pokemon.id}`);
      if (!response.ok) throw new Error('Failed to fetch details');
      const data: PokemonDetailResponse = await response.json();

      setState((prev) => ({
        ...prev,
        selectedPokemon: prepareData(data),
        detailsLoading: false,
      }));
    },
    [state.currentPage, state.selectedPokemon, setSearchParams, prepareData]
  );

  const handleCloseDetails = useCallback(() => {
    setState((prev) => ({ ...prev, selectedPokemon: null }));
    setSearchParams({ page: state.currentPage.toString() });
  }, [state.currentPage, setSearchParams]);

  const handleTestError = () => {
    setState((prev) => ({ ...prev, shouldThrowError: true }));
  };

  if (state.shouldThrowError) {
    throw new Error('This is a test error thrown by the application');
  }

  const totalPages = Math.ceil(state.totalCount / ITEMS_PER_PAGE);

  return (
    <div className="pokemon-search-container">
      <div className="search-section">
        <SearchBar
          searchTerm={state.searchTerm}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
        />
      </div>

      <div className="results-section">
        <div className="master-detail-container">
          <div className="master-list">
            <ResultsList
              results={state.results}
              loading={state.listLoading}
              error={state.error}
              onPokemonSelect={handlePokemonSelect}
              selectedPokemonId={state.selectedPokemon?.id}
            />
            {!state.listLoading &&
              !state.error &&
              state.results.length > 0 &&
              totalPages > 1 && (
                <Pagination
                  currentPage={state.currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
          </div>

          {state.selectedPokemon && (
            <div className="detail-view">
              <PokemonDetails
                pokemon={state.selectedPokemon}
                loading={state.detailsLoading}
                onClose={handleCloseDetails}
              />
            </div>
          )}
        </div>
      </div>

      <div className="test-error-container">
        <button onClick={handleTestError} className="error-button">
          Test Error Boundary
        </button>
      </div>
    </div>
  );
};

export default PokemonSearch;
