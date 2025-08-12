import React from 'react';
import SearchBar from './SearchBar';
import ResultsList from './ResultsList';

interface Pokemon {
  name: string;
  url: string;
  id: number;
  types: string[];
  abilities: string[];
}

interface PokemonSearchState {
  searchTerm: string;
  results: Pokemon[];
  loading: boolean;
  error: string | null;
  shouldThrowError: boolean;
}

interface PokemonType {
  type: {
    name: string;
  };
}

interface PokemonAbility {
  ability: {
    name: string;
  };
}

interface PokemonDetailResponse {
  name: string;
  id: number;
  url: string;
  types: PokemonType[];
  abilities: PokemonAbility[];
}

interface PokemonListResponse {
  results: Array<{
    name: string;
    url: string;
  }>;
}

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

    let apiUrl = 'https://pokeapi.co/api/v2/pokemon';
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
          const pokemon: Pokemon = {
            name: pokemonData.name,
            url: `https://pokeapi.co/api/v2/pokemon/${pokemonData.id}`,
            id: pokemonData.id,
            types: pokemonData.types.map((t) => t.type.name),
            abilities: pokemonData.abilities.map((a) => a.ability.name),
          };
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
              const pokemons = pokemonData.map((p) => ({
                name: p.name,
                url: p.url,
                id: p.id,
                types: p.types.map((t) => t.type.name),
                abilities: p.abilities.map((a) => a.ability.name),
              }));
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
