import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import ResultsList from '../ResultsList/ResultsList';
import Pagination from '../Pagination/Pagination';
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
    loading: false,
    error: null,
    shouldThrowError: false,
    currentPage: 1,
    totalCount: 0,
  });

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    const savedSearchTerm = localStorage.getItem('pokemonSearchTerm') || '';

    setState((prev) => ({
      ...prev,
      searchTerm: savedSearchTerm,
      currentPage: page,
    }));

    fetchData(savedSearchTerm, page);
  }, []);

  const fetchData = async (searchTerm: string, page: number = 1) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

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
          loading: false,
          totalCount: 1,
        }));
      } else {
        const listData = data as PokemonListResponse;
        const pokemonData = await Promise.all(
          listData.results.map((p) => fetch(p.url).then((res) => res.json()))
        );

        setState((prev) => ({
          ...prev,
          results: pokemonData.map(prepareData),
          loading: false,
          totalCount: listData.count,
        }));
      }
    } catch (error) {
      handleFetchError(error as Error);
    }
  };

  const handleFetchError = (error: Error) => {
    console.error('Error fetching data:', error);
    setState((prev) => ({
      ...prev,
      error: error.message || 'Failed to fetch data',
      loading: false,
      results: [],
      totalCount: 0,
    }));
  };

  const prepareData = (pokemonData: PokemonDetailResponse): Pokemon => ({
    name: pokemonData.name,
    url: `${API_URL}/${pokemonData.id}`,
    id: pokemonData.id,
    types: pokemonData.types.map((t) => t.type.name),
    abilities: pokemonData.abilities.map((a) => a.ability.name),
  });

  const handleSearchChange = (term: string) => {
    setState((prev) => ({ ...prev, searchTerm: term }));
  };

  const handleSearchSubmit = () => {
    const trimmedTerm = state.searchTerm.trim();
    localStorage.setItem('pokemonSearchTerm', trimmedTerm);
    setSearchParams({ page: '1' });
    setState((prev) => ({ ...prev, currentPage: 1 }));
    fetchData(trimmedTerm, 1);
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
    setState((prev) => ({ ...prev, currentPage: page }));
    fetchData(state.searchTerm, page);
  };

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
        <ResultsList
          results={state.results}
          loading={state.loading}
          error={state.error}
        />
        {!state.loading &&
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

      <div className="test-error-container">
        <button onClick={handleTestError} className="error-button">
          Test Error Boundary
        </button>
      </div>
    </div>
  );
};

export default PokemonSearch;
