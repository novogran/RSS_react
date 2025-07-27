import { render, screen } from '@testing-library/react';
import ResultsList from './ResultsList';
import { mockPokemon } from '../../test-utils/mocks/pokemonapi';

describe('ResultsList', () => {
  it('Отображает состояние загрузки', () => {
    render(
      <ResultsList
        loading={true}
        results={[]}
        error={null}
        onPokemonSelect={function (): void {
          throw new Error('Function not implemented.');
        }}
        onCloseDetails={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument();
  });

  it('Отображает сообщение об ошибке', () => {
    render(
      <ResultsList
        loading={false}
        results={[]}
        error="API error"
        onPokemonSelect={function (): void {
          throw new Error('Function not implemented.');
        }}
        onCloseDetails={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(screen.getByText('Error loading Pokémon')).toBeInTheDocument();
    expect(screen.getByText('API error')).toBeInTheDocument();
  });

  it('Отображает сообщение о пустых результатах', () => {
    render(
      <ResultsList
        loading={false}
        results={[]}
        error={null}
        onPokemonSelect={function (): void {
          throw new Error('Function not implemented.');
        }}
        onCloseDetails={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(screen.getByText('No Pokémon found')).toBeInTheDocument();
    expect(
      screen.getByText('Try searching for a different Pokémon name.')
    ).toBeInTheDocument();
  });

  it('Отображает список покемонов', () => {
    render(
      <ResultsList
        loading={false}
        results={[
          mockPokemon,
          {
            ...mockPokemon,
            id: 6,
            name: 'charizard',
            url: '',
          },
        ]}
        error={null}
        onPokemonSelect={function (): void {
          throw new Error('Function not implemented.');
        }}
        onCloseDetails={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    expect(screen.getByText('Search Results')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Charizard')).toBeInTheDocument();
  });

  it('Отображает типы и способности', () => {
    render(
      <ResultsList
        loading={false}
        results={[mockPokemon]}
        error={null}
        onPokemonSelect={function (): void {
          throw new Error('Function not implemented.');
        }}
        onCloseDetails={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('Static')).toBeInTheDocument();
    expect(screen.getByText('Lightning-rod')).toBeInTheDocument();
  });

  it('Обрабатывает отсутствие данных', () => {
    render(
      <ResultsList
        loading={false}
        results={[
          {
            ...mockPokemon,
            types: [],
            abilities: [],
            url: '',
          },
        ]}
        error={null}
        onPokemonSelect={function (): void {
          throw new Error('Function not implemented.');
        }}
        onCloseDetails={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    expect(screen.queryByText('Electric')).not.toBeInTheDocument();
    expect(screen.queryByText('Static')).not.toBeInTheDocument();
    expect(screen.queryByText('Lightning-rod')).not.toBeInTheDocument();
  });
});
