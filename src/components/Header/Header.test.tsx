import { render, screen } from '@testing-library/react';
import Header from './Header';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '../../context/ThemeProvider';
import { vi } from 'vitest';
import { usePathname } from '@/i18n/navigation';

vi.mock('next-intl', async () => {
  const actual = await vi.importActual('next-intl');
  return {
    ...actual,
    useLocale: () => 'en',
    useTranslations: () => (key: string) => {
      const translations: Record<string, string> = {
        'Header.title': 'title',
        'Header.home': 'home',
        'Header.about': 'about',
      };
      return translations[key] || key;
    },
  };
});

vi.mock('@/i18n/navigation', () => ({
  usePathname: vi.fn(() => '/'),
  useRouter: () => ({
    replace: vi.fn(),
  }),
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} className={href === usePathname() ? 'active' : ''}>
      {children}
    </a>
  ),
}));

vi.mock('../ThemeSwitcher', () => ({
  ThemeSwitcher: () => <div>ThemeSwitcher</div>,
}));

describe('Header', () => {
  const renderWithProviders = (path = '/') => {
    vi.mocked(usePathname).mockReturnValue(path);
    return render(
      <NextIntlClientProvider locale="en" messages={{}}>
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      </NextIntlClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders app title with link to home', () => {
    renderWithProviders();
    const titleLink = screen.getByRole('link', { name: 'title' });
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute('href', '/');
  });

  it('renders navigation links', () => {
    renderWithProviders();
    expect(screen.getByRole('link', { name: 'home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'about' })).toBeInTheDocument();
  });

  it('marks home link as active when on home page', () => {
    renderWithProviders('/');

    const homeLink = screen.getByRole('link', { name: 'home' });
    const aboutLink = screen.getByRole('link', { name: 'about' });

    expect(homeLink).toHaveClass('active');
    expect(aboutLink).not.toHaveClass('active');
  });

  it('marks about link as active when on about page', () => {
    renderWithProviders('/about');

    const homeLink = screen.getByRole('link', { name: 'home' });
    const aboutLink = screen.getByRole('link', { name: 'about' });

    expect(aboutLink).toHaveClass('active');
    expect(homeLink).not.toHaveClass('active');
  });

  it('renders language switcher', () => {
    renderWithProviders();
    expect(screen.getByText('Рус')).toBeInTheDocument();
  });

  it('renders theme switcher', () => {
    renderWithProviders();
    expect(screen.getByText('ThemeSwitcher')).toBeInTheDocument();
  });
});
