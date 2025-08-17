import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { useTheme } from '../../hooks/useTheme';
import ThemeSwitcher from './ThemeSwitcher';
import { NextIntlClientProvider } from 'next-intl';

// Mock the useTheme hook
vi.mock('../../hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

// Mock translations
const messages = {
  ThemeSwitcher: {
    light: 'Light',
    dark: 'Dark',
    toggleTheme: 'Toggle theme',
  },
};

describe('ThemeSwitcher - переключатель темы', () => {
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        {ui}
      </NextIntlClientProvider>
    );
  };

  it('отображает лейблы Light/Dark и переключатель', () => {
    renderWithProviders(<ThemeSwitcher />);

    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('правильно отображает состояние для dark темы', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });

    renderWithProviders(<ThemeSwitcher />);

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('вызывает toggleTheme при клике', () => {
    renderWithProviders(<ThemeSwitcher />);

    const switchElement = screen.getByRole('checkbox');
    fireEvent.click(switchElement);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
