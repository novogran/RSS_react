import { render, screen } from '@testing-library/react';
import PokemonDetails from './PokemonDetails';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { mockPokemon } from '../../test-utils/mocks/pokemonapi';

describe('PokemonDetails', () => {
  const mockOnClose = vi.fn();

  it('отображает индикатор загрузки при loading=true', () => {
    render(
      <PokemonDetails
        pokemon={mockPokemon}
        loading={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Loading details...')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('корректно отображает основную информацию о покемоне', () => {
    render(
      <PokemonDetails
        pokemon={mockPokemon}
        loading={false}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('#025')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument();

    const image = screen.getByAltText('pikachu');
    expect(image).toHaveAttribute('src', 'pikachu-artwork.png');

    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
  });

  it('корректно отображает физические характеристики', () => {
    render(
      <PokemonDetails
        pokemon={mockPokemon}
        loading={false}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Height')).toBeInTheDocument();
    expect(screen.getByText('0.4m')).toBeInTheDocument();

    expect(screen.getByText('Weight')).toBeInTheDocument();
    expect(screen.getByText('6kg')).toBeInTheDocument();
  });

  it('корректно отображает типы покемона', () => {
    render(
      <PokemonDetails
        pokemon={mockPokemon}
        loading={false}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Types')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toHaveClass('type-badge');
    expect(screen.getByText('Electric')).toHaveClass('type-electric');
  });

  it('корректно отображает способности покемона', () => {
    render(
      <PokemonDetails
        pokemon={mockPokemon}
        loading={false}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Abilities')).toBeInTheDocument();
    expect(screen.getByText('Static')).toBeInTheDocument();
    expect(screen.getByText('Lightning-rod')).toBeInTheDocument();
  });

  it('корректно отображает статистику покемона', () => {
    render(
      <PokemonDetails
        pokemon={mockPokemon}
        loading={false}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Stats')).toBeInTheDocument();
    expect(screen.getByText('Hp')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('Attack')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();

    const hpStat = screen.getByText('35').closest('.stat-value');
    expect(hpStat).toHaveStyle('width: 35%');
  });

  it('вызывает onClose при клике на кнопку закрытия', () => {
    render(
      <PokemonDetails
        pokemon={mockPokemon}
        loading={false}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByRole('button', { name: '×' });
    closeButton.click();

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('использует fallback изображение если основное недоступно', () => {
    const pokemonWithoutArtwork = {
      ...mockPokemon,
      sprites: { front_default: 'fallback.png' },
    };

    render(
      <PokemonDetails
        pokemon={pokemonWithoutArtwork}
        loading={false}
        onClose={mockOnClose}
      />
    );

    const image = screen.getByAltText('pikachu');
    expect(image).toHaveAttribute('src', 'fallback.png');
  });
});
