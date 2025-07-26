import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import ResultsList from '../ResultsList/ResultsList';
import { API_URL } from '../../types/constants';
import type {
  Pokemon,
  PokemonDetailResponse,
  PokemonListResponse,
  PokemonSearchState,
} from '../../types/pokemonSearch.types';

class PokemonSearch extends React.Component<
  Record<string, never>,
  PokemonSearchState
> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      searchTerm: '',
      results: [],
      loading: false,
      error: null,
      shouldThrowError: false,
    };
  }

  componentDidMount() {
    const savedSearchTerm = localStorage.getItem('pokemonSearchTerm') || '';
    this.setState({ searchTerm: savedSearchTerm }, () => {
      this.fetchData(savedSearchTerm);
    });
  }

  fetchData = (searchTerm: string) => {
    this.setState({ loading: true, error: null });

    const trimmedTerm = searchTerm.trim();

    let apiUrl = API_URL;
    if (trimmedTerm) {
      apiUrl += `/${trimmedTerm.toLowerCase()}`;
    } else {
      apiUrl += '?limit=20';
    }

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Pokémon not found');
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: PokemonDetailResponse | PokemonListResponse) => {
        if (trimmedTerm) {
          const pokemonData: PokemonDetailResponse =
            data as PokemonDetailResponse;
          const pokemon: Pokemon = this.prepareData(pokemonData);
          this.setState({
            results: [pokemon],
            loading: false,
          });
        } else {
          const listData = data as PokemonListResponse;
          const promises = listData.results.map((p) =>
            fetch(p.url).then((res) => res.json())
          );

          Promise.all(promises)
            .then((pokemonData: PokemonDetailResponse[]) => {
              const pokemons: Pokemon[] = pokemonData.map(this.prepareData);
              this.setState({
                results: pokemons,
                loading: false,
              });
            })
            .catch((error) => {
              console.error('Error fetching Pokémon details:', error);
              this.setState({
                error: error.message || 'Failed to fetch Pokémon details',
                loading: false,
                results: [],
              });
            });
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        this.setState({
          error: error.message || 'Failed to fetch data',
          loading: false,
          results: [],
        });
      });
  };

  prepareData = (pokemonData: PokemonDetailResponse): Pokemon => ({
    name: pokemonData.name,
    url: `${API_URL}/${pokemonData.id}`,
    id: pokemonData.id,
    types: pokemonData.types.map((t) => t.type.name),
    abilities: pokemonData.abilities.map((a) => a.ability.name),
  });

  handleSearchChange = (term: string) => {
    this.setState({ searchTerm: term });
  };

  handleSearchSubmit = () => {
    const { searchTerm } = this.state;
    const trimmedTerm = searchTerm.trim();

    localStorage.setItem('pokemonSearchTerm', trimmedTerm);

    this.fetchData(trimmedTerm);
  };

  handleTestError = () => {
    this.setState({ shouldThrowError: true });
  };

  render() {
    const { searchTerm, results, loading, error, shouldThrowError } =
      this.state;

    if (shouldThrowError) {
      throw new Error('This is a test error thrown by the application');
    }

    return (
      <div className="pokemon-search-container">
        <div className="search-section">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={this.handleSearchChange}
            onSearchSubmit={this.handleSearchSubmit}
          />
        </div>

        <div className="results-section">
          <ResultsList results={results} loading={loading} error={error} />
        </div>

        <div className="test-error-container">
          <button onClick={this.handleTestError} className="error-button">
            Test Error Boundary
          </button>
        </div>
      </div>
    );
  }
}

export default PokemonSearch;
