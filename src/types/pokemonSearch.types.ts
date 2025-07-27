export interface Pokemon {
  name: string;
  url: string;
  id: number;
  types: string[];
  abilities: string[];
}

export interface PokemonSearchState {
  searchTerm: string;
  results: Pokemon[];
  loading: boolean;
  error: string | null;
  shouldThrowError: boolean;
  currentPage: number;
  totalCount: number;
}

export interface PokemonType {
  type: {
    name: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
  };
}

export interface PokemonDetailResponse {
  name: string;
  id: number;
  url: string;
  types: PokemonType[];
  abilities: PokemonAbility[];
}

export interface PokemonListResponse {
  count: number;
  results: Array<{
    name: string;
    url: string;
  }>;
}
