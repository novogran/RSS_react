import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import PokemonDetails from './PokemonDetails';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { mockPokemon } from '../../test-utils/mocks/pokemonapi';

type MockImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: MockImageProps) => {
    return <img {...props} />;
  },
}));

vi.mock('next-intl', async () => ({
  ...(await vi.importActual('next-intl')),
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'PokemonDetails.loadingAriaLabel': 'Loading',
      'PokemonDetails.loadingText': 'Loading details...',
      'PokemonDetails.closeButtonLabel': 'Close',
      'PokemonDetails.imageAlt': '{name} image',
      'PokemonDetails.physicalTitle': 'Physical',
      'PokemonDetails.heightLabel': 'Height',
      'PokemonDetails.metersAbbr': 'm',
      'PokemonDetails.weightLabel': 'Weight',
      'PokemonDetails.kilogramsAbbr': 'kg',
      'PokemonDetails.typesTitle': 'Types',
      'PokemonDetails.typeBadge': '{type} type',
      'PokemonDetails.abilitiesTitle': 'Abilities',
      'PokemonDetails.abilityBadge': '{ability} ability',
      'PokemonDetails.statsTitle': 'Stats',
      'stats.hp': 'Hp',
      'stats.attack': 'Attack',
      'stats.defense': 'Defense',
      'stats.special-attack': 'Special Attack',
      'stats.special-defense': 'Special Defense',
      'stats.speed': 'Speed',
    };
    return translations[key] || key;
  },
}));

describe('PokemonDetails', () => {
  const mockOnClose = vi.fn();
  const messages = {
    PokemonDetails: {
      loadingAriaLabel: 'Loading',
      loadingText: 'Loading details...',
      closeButtonLabel: 'Close',
      imageAlt: '{name} image',
      physicalTitle: 'Physical',
      heightLabel: 'Height',
      metersAbbr: 'm',
      weightLabel: 'Weight',
      kilogramsAbbr: 'kg',
      typesTitle: 'Types',
      typeBadge: '{type} type',
      abilitiesTitle: 'Abilities',
      abilityBadge: '{ability} ability',
      statsTitle: 'Stats',
      stats: {
        hp: 'Hp',
        attack: 'Attack',
        defense: 'Defense',
        'special-attack': 'Special Attack',
        'special-defense': 'Special Defense',
        speed: 'Speed',
      },
    },
  };

  const renderPokemonDetails = (props = {}) => {
    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <PokemonDetails
          pokemon={mockPokemon}
          loading={false}
          onClose={mockOnClose}
          {...props}
        />
      </NextIntlClientProvider>
    );
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('отображает индикатор загрузки при loading=true', () => {
    renderPokemonDetails({ loading: true });

    expect(screen.getByText('loadingText')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toHaveAttribute(
      'aria-label',
      'loadingAriaLabel'
    );
  });

  it('корректно отображает основную информацию о покемоне', () => {
    renderPokemonDetails();

    expect(screen.getByText('#025')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'closeButtonLabel' })
    ).toBeInTheDocument();
  });

  it('корректно отображает физические характеристики', () => {
    renderPokemonDetails();

    const physicalDetails =
      screen.getByText('physicalTitle').nextElementSibling;

    const heightSection = physicalDetails?.firstElementChild;
    expect(heightSection).toHaveTextContent('heightLabel');
    expect(heightSection).toHaveTextContent('0.4');
    expect(heightSection).toHaveTextContent('metersAbbr');

    const weightSection = physicalDetails?.lastElementChild;
    expect(weightSection).toHaveTextContent('weightLabel');
    expect(weightSection).toHaveTextContent('6');
    expect(weightSection).toHaveTextContent('kilogramsAbbr');
  });

  it('корректно отображает типы покемона', () => {
    renderPokemonDetails();

    expect(screen.getByText('typesTitle')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toHaveClass('type-badge');
    expect(screen.getByText('Electric')).toHaveClass('type-electric');
  });

  it('корректно отображает способности покемона', () => {
    renderPokemonDetails();

    expect(screen.getByText('abilitiesTitle')).toBeInTheDocument();
    expect(screen.getByText('Static')).toBeInTheDocument();
    expect(screen.getByText('Lightning-rod')).toBeInTheDocument();
  });

  it('корректно отображает статистику покемона', () => {
    renderPokemonDetails();

    expect(screen.getByText('statsTitle')).toBeInTheDocument();
    expect(screen.getByText('Hp')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('Attack')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();

    const hpStat = screen.getByText('35').closest('.stat-value');
    expect(hpStat).toHaveStyle('width: 35%');
  });

  it('вызывает onClose при клике на кнопку закрытия', () => {
    renderPokemonDetails();

    const closeButton = screen.getByRole('button', {
      name: 'closeButtonLabel',
    });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('использует fallback изображение если основное недоступно', () => {
    const pokemonWithoutArtwork = {
      ...mockPokemon,
      sprites: {
        front_default: '/fallback.png',
        other: { 'official-artwork': { front_default: null } },
      },
    };

    renderPokemonDetails({ pokemon: pokemonWithoutArtwork });

    const image = screen.getByAltText('imageAlt');
    expect(image).toHaveAttribute('src', '/fallback.png');
  });
});
