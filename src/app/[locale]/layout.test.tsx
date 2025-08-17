import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import RootLayout from './layout';
import { ReactNode } from 'react';

vi.mock('next-intl/server', () => ({
  getMessages: vi.fn(() => Promise.resolve({ welcome: 'Welcome' })),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('Not found');
  }),
}));

vi.mock('./client-root', () => ({
  ClientRoot: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('next-intl', () => ({
  NextIntlClientProvider: ({
    children,
    locale,
  }: {
    children: ReactNode;
    locale: string;
    messages: Record<string, string>;
  }) => (
    <div data-testid="intl-provider" data-locale={locale}>
      {children}
    </div>
  ),
}));

describe('RootLayout', () => {
  it('должен корректно рендерить layout для поддерживаемой локали', async () => {
    const params = Promise.resolve({ locale: 'en' });
    const { getByTestId } = render(
      await RootLayout({
        children: <div data-testid="test-child">Test Child</div>,
        params,
      })
    );

    expect(getByTestId('test-child')).toBeInTheDocument();

    const intlProvider = getByTestId('intl-provider');
    expect(intlProvider).toBeInTheDocument();
    expect(intlProvider).toHaveAttribute('data-locale', 'en');
  });

  it('должен вызывать notFound для неподдерживаемой локали', async () => {
    const params = Promise.resolve({ locale: 'unsupported' });

    await expect(
      RootLayout({
        children: <div>Test Child</div>,
        params,
      })
    ).rejects.toThrow('Not found');
  });

  it('должен корректно передавать children через все провайдеры', async () => {
    const params = Promise.resolve({ locale: 'en' });
    const testChild = <div data-testid="test-child">Test Content</div>;

    const { getByTestId } = render(
      await RootLayout({
        children: testChild,
        params,
      })
    );

    expect(getByTestId('test-child')).toBeInTheDocument();
    expect(getByTestId('test-child').textContent).toBe('Test Content');
  });
});
