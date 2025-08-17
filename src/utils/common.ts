import { API_URL } from '@/constants';
import type {
  PokemonDetailResponse,
  Pokemon,
} from '@/types/pokemonSearch.types';
import { generateCSV } from '@/app/[locale]/actions/csv';

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

export const handleDownloadCSV = async (
  selectedPokemons: Pokemon[],
  selectedCount: number
) => {
  if (typeof window === 'undefined') {
    console.warn('CSV download is only available in browser environment');
    return;
  }

  try {
    const csv = await generateCSV(selectedPokemons);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedCount}_pokemons.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
  }
};
