'use server';

import { Pokemon } from '@/types/pokemonSearch.types';

export async function generateCSV(pokemons: Pokemon[]) {
  const headers = 'ID,Name,Types,Abilities,URL\n';
  const rows = pokemons
    .map(
      (p) =>
        `${p.id},${p.name},${p.types.join('|')},${p.abilities.join('|')},${p.url}`
    )
    .join('\n');

  return headers + rows;
}
