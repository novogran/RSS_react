import { render, screen, fireEvent } from '@testing-library/react';
import PokemonCard from './PokemonCard';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { mockPokemon } from '../../test-utils/mocks/pokemonapi';

describe('PokemonCard', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('корректно отображает информацию о покемоне', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('#025')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('Static')).toBeInTheDocument();
    expect(screen.getByText('Lightning-rod')).toBeInTheDocument();
  });

  it('добавляет класс selected при выделении', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isSelected={true}
        onSelect={mockOnSelect}
      />
    );

    const card = screen.getByRole('listitem');
    expect(card).toHaveClass('selected');
  });

  it('вызывает onSelect с правильным покемоном при клике', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    const card = screen.getByRole('listitem');
    fireEvent.click(card);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(mockPokemon);
  });

  it('корректно форматирует ID покемона', () => {
    const pokemonWithSingleDigitId = { ...mockPokemon, id: 5 };
    render(
      <PokemonCard
        pokemon={pokemonWithSingleDigitId}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('#005')).toBeInTheDocument();
  });

  it('корректно отображает несколько типов', () => {
    const multiTypePokemon = {
      ...mockPokemon,
      types: ['electric', 'flying'],
    };

    render(
      <PokemonCard
        pokemon={multiTypePokemon}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('Flying')).toBeInTheDocument();
  });

  it('отображает не более 3 способностей', () => {
    const pokemonWithManyAbilities = {
      ...mockPokemon,
      abilities: ['ability1', 'ability2', 'ability3', 'ability4'],
    };

    render(
      <PokemonCard
        pokemon={pokemonWithManyAbilities}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Ability1')).toBeInTheDocument();
    expect(screen.getByText('Ability2')).toBeInTheDocument();
    expect(screen.getByText('Ability3')).toBeInTheDocument();
    expect(screen.queryByText('Ability4')).not.toBeInTheDocument();
  });
});
