import { describe, it, expect } from 'vitest';
import type { Pokemon } from '@/types/pokemonSearch.types';
import { generateCSV } from './csv';

describe('generateCSV', () => {
  it('должен возвращать только заголовки для пустого массива', async () => {
    const result = await generateCSV([]);
    const expected = 'ID,Name,Types,Abilities,URL\n';
    expect(result).toBe(expected);
  });

  it('должен корректно форматировать данные одного покемона', async () => {
    const pokemons: Pokemon[] = [
      {
        id: 1,
        name: 'bulbasaur',
        types: ['grass', 'poison'],
        abilities: ['overgrow', 'chlorophyll'],
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
      },
    ];

    const result = await generateCSV(pokemons);
    const expected =
      'ID,Name,Types,Abilities,URL\n' +
      '1,bulbasaur,grass|poison,overgrow|chlorophyll,https://pokeapi.co/api/v2/pokemon/1/';

    expect(result).toBe(expected);
  });

  it('должен корректно форматировать данные нескольких покемонов', async () => {
    const pokemons: Pokemon[] = [
      {
        id: 1,
        name: 'bulbasaur',
        types: ['grass', 'poison'],
        abilities: ['overgrow', 'chlorophyll'],
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
      },
      {
        id: 2,
        name: 'ivysaur',
        types: ['grass', 'poison'],
        abilities: ['overgrow', 'chlorophyll'],
        url: 'https://pokeapi.co/api/v2/pokemon/2/',
      },
    ];

    const result = await generateCSV(pokemons);
    const expected =
      'ID,Name,Types,Abilities,URL\n' +
      '1,bulbasaur,grass|poison,overgrow|chlorophyll,https://pokeapi.co/api/v2/pokemon/1/\n' +
      '2,ivysaur,grass|poison,overgrow|chlorophyll,https://pokeapi.co/api/v2/pokemon/2/';

    expect(result).toBe(expected);
  });

  it('должен корректно обрабатывать покемона без типов и способностей', async () => {
    const pokemons: Pokemon[] = [
      {
        id: 3,
        name: 'venusaur',
        types: [],
        abilities: [],
        url: 'https://pokeapi.co/api/v2/pokemon/3/',
      },
    ];

    const result = await generateCSV(pokemons);
    const expected =
      'ID,Name,Types,Abilities,URL\n' +
      '3,venusaur,,,https://pokeapi.co/api/v2/pokemon/3/';

    expect(result).toBe(expected);
  });
});
