import { render, screen } from '@testing-library/react';
import ResultsList from './ResultsList';

const mockPokemon = {
  id: 25,
  name: 'pikachu',
  types: ['electric'],
  abilities: ['static', 'lightning-rod'],
};

describe('ResultsList', () => {
  it('Отображает состояние загрузки', () => {
    render(<ResultsList loading={true} results={[]} error={null} />);
    expect(screen.getByText('Searching for Pokémon...')).toBeInTheDocument();
  });

  it('Отображает сообщение об ошибке', () => {
    render(<ResultsList loading={false} results={[]} error="API error" />);
    expect(screen.getByText('Error loading Pokémon')).toBeInTheDocument();
    expect(screen.getByText('API error')).toBeInTheDocument();
  });

  it('Отображает сообщение о пустых результатах', () => {
    render(<ResultsList loading={false} results={[]} error={null} />);
    expect(screen.getByText('No Pokémon found')).toBeInTheDocument();
  });

  it('Отображает список покемонов', () => {
    render(
      <ResultsList
        loading={false}
        results={[mockPokemon, { ...mockPokemon, id: 6, name: 'charizard' }]}
        error={null}
      />
    );

    expect(screen.getByText('#025')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('#006')).toBeInTheDocument();
    expect(screen.getByText('Charizard')).toBeInTheDocument();
  });

  it('Отображает типы и способности', () => {
    render(
      <ResultsList loading={false} results={[mockPokemon]} error={null} />
    );

    expect(screen.getByText('Type:')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('Abilities:')).toBeInTheDocument();
    expect(screen.getByText('Static')).toBeInTheDocument();
    expect(screen.getByText('Lightning-rod')).toBeInTheDocument();
  });

  it('Обрабатывает отсутствие данных', () => {
    render(
      <ResultsList
        loading={false}
        results={[{ ...mockPokemon, types: [], abilities: [] }]}
        error={null}
      />
    );

    expect(screen.getByText('Type:')).toBeInTheDocument();
    expect(screen.getByText('Abilities:')).toBeInTheDocument();

    expect(screen.queryByText('Electric')).not.toBeInTheDocument();
    expect(screen.queryByText('Static')).not.toBeInTheDocument();
    expect(screen.queryByText('Lightning-rod')).not.toBeInTheDocument();
  });
});
