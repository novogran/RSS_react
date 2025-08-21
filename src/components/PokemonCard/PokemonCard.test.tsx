import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { NextIntlClientProvider } from 'next-intl';
import { store } from '../../store/store';
import PokemonCard from './PokemonCard';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { mockPokemon } from '../../test-utils/mocks/pokemonapi';

vi.mock('next-intl', async () => ({
  ...(await vi.importActual('next-intl')),
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'PokemonCard.selectPokemon': 'Select {name}',
      'PokemonCard.typeLabel': 'Type',
      'PokemonCard.typeBadge': '{type} type',
      'PokemonCard.abilitiesLabel': 'Abilities',
      'PokemonCard.abilityBadge': '{ability} ability',
    };
    return translations[key] || key;
  },
}));

describe('PokemonCard', () => {
  const mockOnSelect = vi.fn();
  const messages = {
    PokemonCard: {
      selectPokemon: 'Select {name}',
      typeLabel: 'Type',
      typeBadge: '{type} type',
      abilitiesLabel: 'Abilities',
      abilityBadge: '{ability} ability',
    },
  };

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  const renderPokemonCard = (props = {}) => {
    return render(
      <Provider store={store}>
        <NextIntlClientProvider locale="en" messages={messages}>
          <PokemonCard
            pokemon={mockPokemon}
            isSelected={false}
            onSelect={mockOnSelect}
            {...props}
          />
        </NextIntlClientProvider>
      </Provider>
    );
  };

  it('корректно отображает информацию о покемоне', () => {
    renderPokemonCard();

    expect(screen.getByText('#025')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('Static')).toBeInTheDocument();
    expect(screen.getByText('Lightning-rod')).toBeInTheDocument();
  });

  it('добавляет класс selected при выделении', () => {
    renderPokemonCard({ isSelected: true });

    const card = screen.getByRole('listitem');
    expect(card).toHaveClass('selected');
  });

  it('вызывает onSelect с правильным покемоном при клике', () => {
    renderPokemonCard();

    const card = screen.getByRole('listitem');
    fireEvent.click(card);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(mockPokemon);
  });

  it('корректно форматирует ID покемона', () => {
    const pokemonWithSingleDigitId = { ...mockPokemon, id: 5 };
    renderPokemonCard({ pokemon: pokemonWithSingleDigitId });

    expect(screen.getByText('#005')).toBeInTheDocument();
  });

  it('корректно отображает несколько типов', () => {
    const multiTypePokemon = {
      ...mockPokemon,
      types: ['electric', 'flying'],
    };

    renderPokemonCard({ pokemon: multiTypePokemon });

    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('Flying')).toBeInTheDocument();
  });

  it('отображает не более 3 способностей', () => {
    const pokemonWithManyAbilities = {
      ...mockPokemon,
      abilities: ['ability1', 'ability2', 'ability3', 'ability4'],
    };

    renderPokemonCard({ pokemon: pokemonWithManyAbilities });

    expect(screen.getByText('Ability1')).toBeInTheDocument();
    expect(screen.getByText('Ability2')).toBeInTheDocument();
    expect(screen.getByText('Ability3')).toBeInTheDocument();
    expect(screen.queryByText('Ability4')).not.toBeInTheDocument();
  });
});
