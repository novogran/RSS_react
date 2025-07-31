export interface PokemonSprites {
  front_default: string;
  other?: {
    'official-artwork'?: {
      front_default: string;
    };
  };
}

export interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface Pokemon {
  name: string;
  url: string;
  id: number;
  types: string[];
  abilities: string[];
  sprites?: PokemonSprites;
  stats?: PokemonStat[];
  height?: number;
  weight?: number;
}

export interface PokemonSearchState {
  searchTerm: string;
  results: Pokemon[];
  listLoading: boolean;
  error: string | null;
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
  sprites: PokemonSprites;
  height: number;
  weight: number;
  stats: PokemonStat[];
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}
