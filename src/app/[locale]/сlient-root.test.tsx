import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@/context/ThemeProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ClientRoot } from './сlient-root';

// Мокируем дочерние компоненты и провайдеры
vi.mock('react-redux', () => ({
  Provider: vi.fn(({ children }) => (
    <div data-testid="redux-provider">{children}</div>
  )),
}));

vi.mock('@/context/ThemeProvider', () => ({
  ThemeProvider: vi.fn(({ children }) => (
    <div data-testid="theme-provider">{children}</div>
  )),
}));

vi.mock('@/components/ErrorBoundary', () => ({
  ErrorBoundary: vi.fn(({ children }) => (
    <div data-testid="error-boundary">{children}</div>
  )),
}));

describe('ClientRoot', () => {
  // Тест 1: Проверяем корректное отображение компонента
  it('должен корректно отображаться', () => {
    const { getByTestId, getByText } = render(
      <ClientRoot>
        <div>Test Child</div>
      </ClientRoot>
    );

    expect(getByTestId('redux-provider')).toBeInTheDocument();
    expect(getByTestId('theme-provider')).toBeInTheDocument();
    expect(getByTestId('error-boundary')).toBeInTheDocument();
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  // Тест 2: Проверяем правильный порядок вложенности провайдеров
  it('должен оборачивать детей в правильном порядке: Redux -> Theme -> ErrorBoundary', () => {
    render(
      <ClientRoot>
        <div>Test Child</div>
      </ClientRoot>
    );

    // Проверяем порядок вызовов моков
    const providerCalls = (Provider as jest.Mock).mock.calls;

    // Redux Provider должен быть самым внешним
    expect(providerCalls[0][0].children).toEqual(
      expect.objectContaining({
        type: ThemeProvider,
        props: {
          children: expect.objectContaining({
            type: ErrorBoundary,
            props: {
              children: expect.anything(),
            },
          }),
        },
      })
    );
  });

  // Тест 3: Проверяем передачу children через все обертки
  it('должен корректно передавать children через все провайдеры', () => {
    const testChild = <div data-testid="test-child">Test Content</div>;
    const { getByTestId } = render(<ClientRoot>{testChild}</ClientRoot>);

    expect(getByTestId('test-child')).toBeInTheDocument();
    expect(getByTestId('test-child').textContent).toBe('Test Content');
  });
});
