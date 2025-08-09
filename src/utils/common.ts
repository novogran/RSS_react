import { API_URL } from '../constants';
import type {
  PokemonDetailResponse,
  Pokemon,
} from '../components/PokemonSearch/types/pokemonSearch.types';

export const prepareData = (pokemonData: PokemonDetailResponse): Pokemon => ({
  name: pokemonData.name,
  url: pokemonData.url || `${API_URL}/${pokemonData.id}`,
  id: pokemonData.id,
  types: pokemonData.types.map((t) => t.type.name),
  abilities: pokemonData.abilities.map((a) => a.ability.name),
  sprites: pokemonData.sprites,
  height: pokemonData.height,
  weight: pokemonData.weight,
  stats: pokemonData.stats,
});

export const handleDownload = (
  selectedPokemons: Pokemon[],
  selectedCount: number
) => {
  const csvContent = [
    'ID,Name,Types,Abilities,URL',
    selectedPokemons.map(
      (p) =>
        `${p.id},${p.name},${p.types.join('|')},${p.abilities.join('|')},${p.url}`
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${selectedCount}_pokemons.csv`;
  link.click();
};
