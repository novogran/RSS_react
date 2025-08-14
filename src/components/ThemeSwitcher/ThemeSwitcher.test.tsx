import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { useTheme } from '../../hooks/useTheme';
import ThemeSwitcher from './ThemeSwitcher';

vi.mock('../../hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

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

  it('отображает лейблы Light/Dark и переключатель', () => {
    render(<ThemeSwitcher />);

    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('правильно отображает состояние для dark темы', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeSwitcher />);

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('вызывает toggleTheme при клике', () => {
    render(<ThemeSwitcher />);

    const switchElement = screen.getByRole('checkbox');
    fireEvent.click(switchElement);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
