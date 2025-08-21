import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'NotFound.title': '404 - Page Not Found',
      'NotFound.message': 'The Pokémon you are looking for has fled!',
      'NotFound.returnLink': 'Return to Pokémon Search',
      'NotFound.sadPikachuAlt': 'Sad Pikachu',
    };
    return translations[key] || key;
  },
}));

vi.mock('next-intl/navigation', async () => {
  const actual = await vi.importActual<typeof import('next-intl/navigation')>(
    'next-intl/navigation'
  );
  return {
    ...actual,
    createNavigation: vi.fn(() => ({
      Link: ({
        children,
        href,
      }: {
        children: React.ReactNode;
        href: string;
      }) => <a href={href}>{children}</a>,
      redirect: vi.fn(),
      usePathname: vi.fn(() => '/'),
      useRouter: vi.fn(() => ({
        replace: vi.fn(),
      })),
      getPathname: vi.fn(),
    })),
  };
});

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  redirect: vi.fn(),
  usePathname: vi.fn(() => '/'),
  useRouter: vi.fn(() => ({
    replace: vi.fn(),
  })),
  getPathname: vi.fn(),
}));

describe('NotFound', () => {
  beforeEach(() => {
    render(<NotFound />);
  });

  it('отображает сообщение 404', () => {
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'title'
    );
  });

  it('отображает грустный смайлик с правильным aria-label', () => {
    const emoji = screen.getByText('😢');
    expect(emoji).toBeInTheDocument();
    expect(emoji).toHaveClass('sad-pikachu');
    expect(emoji).toHaveAttribute('aria-label', 'sadPikachuAlt');
  });

  it('показывает описательное сообщение', () => {
    expect(screen.getByText('message')).toBeInTheDocument();
  });

  it('содержит рабочую домашнюю ссылку', () => {
    const homeLink = screen.getByRole('link', {
      name: 'returnLink',
    });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('имеет правильные классы CSS', () => {
    expect(screen.getByTestId('not-found-container')).toHaveClass('not-found');
    expect(screen.getByTestId('not-found-content')).toHaveClass(
      'not-found-content'
    );
  });
});
