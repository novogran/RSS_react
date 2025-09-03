import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import ResultsList from './ResultsList';
import { mockPokemon } from '../../test-utils/mocks/pokemonapi';
import { NextIntlClientProvider } from 'next-intl';
import { vi } from 'vitest';

const messages = {
  ResultsList: {
    loadingText: 'Loading Pokémon...',
    loadingAriaLabel: 'Loading',
    errorTitle: 'Error loading Pokémon',
    noResultsTitle: 'No Pokémon found',
    noResultsSuggestion: 'Try searching for a different Pokémon name.',
    resultsTitle: 'Search Results',
  },
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <NextIntlClientProvider locale="en" messages={messages}>
        {ui}
      </NextIntlClientProvider>
    </Provider>
  );
};

describe('ResultsList', () => {
  it('Отображает состояние загрузки', () => {
    renderWithProviders(
      <ResultsList
        loading={true}
        results={[]}
        error={null}
        onPokemonSelect={vi.fn()}
      />
    );
    expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument();
  });

  it('Отображает сообщение об ошибке', () => {
    renderWithProviders(
      <ResultsList
        loading={false}
        results={[]}
        error="API error"
        onPokemonSelect={vi.fn()}
      />
    );
    expect(screen.getByText('Error loading Pokémon')).toBeInTheDocument();
    expect(screen.getByText('API error')).toBeInTheDocument();
  });

  it('Отображает сообщение о пустых результатах', () => {
    renderWithProviders(
      <ResultsList
        loading={false}
        results={[]}
        error={null}
        onPokemonSelect={vi.fn()}
      />
    );
    expect(screen.getByText('No Pokémon found')).toBeInTheDocument();
    expect(
      screen.getByText('Try searching for a different Pokémon name.')
    ).toBeInTheDocument();
  });

  it('Отображает список покемонов', () => {
    renderWithProviders(
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
        onPokemonSelect={vi.fn()}
      />
    );

    expect(screen.getByText('Search Results')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Charizard')).toBeInTheDocument();
  });

  it('Отображает типы и способности', () => {
    renderWithProviders(
      <ResultsList
        loading={false}
        results={[mockPokemon]}
        error={null}
        onPokemonSelect={vi.fn()}
      />
    );

    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('Static')).toBeInTheDocument();
    expect(screen.getByText('Lightning-rod')).toBeInTheDocument();
  });

  it('Обрабатывает отсутствие данных', () => {
    renderWithProviders(
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
        onPokemonSelect={vi.fn()}
      />
    );

    expect(screen.queryByText('Electric')).not.toBeInTheDocument();
    expect(screen.queryByText('Static')).not.toBeInTheDocument();
    expect(screen.queryByText('Lightning-rod')).not.toBeInTheDocument();
  });
});
