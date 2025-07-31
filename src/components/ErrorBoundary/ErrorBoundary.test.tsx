import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

const ErrorComponent: React.FC<{ shouldThrow?: boolean }> = ({
  shouldThrow = true,
}) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>Normal content</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Рендерит дочерние компоненты при отсутствии ошибок', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child-content">Safe content</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('Отображает fallback UI при возникновении ошибки в дочернем компоненте', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Try to recover' })
    ).toBeInTheDocument();
  });

  it('Вызывает componentDidCatch и логирует ошибку', () => {
    const errorSpy = vi.spyOn(console, 'error');
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(errorSpy).toHaveBeenCalled();
    expect(
      errorSpy.mock.calls.some((call) =>
        call.some(
          (arg) =>
            typeof arg === 'string' &&
            (arg.includes('Uncaught error:') ||
              arg.includes('Test error message'))
        )
      )
    ).toBe(true);
  });

  it('Восстанавливает нормальный рендеринг после нажатия кнопки восстановления', async () => {
    const user = userEvent.setup();
    let shouldThrow = true;
    const RecoverableErrorComponent = () => {
      if (shouldThrow) {
        throw new Error('Test error message');
      }
      return <div>Normal content</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <RecoverableErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    shouldThrow = false;
    await user.click(screen.getByRole('button', { name: 'Try to recover' }));

    rerender(
      <ErrorBoundary>
        <RecoverableErrorComponent />
      </ErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.getByText('Normal content')).toBeInTheDocument();
    });

    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });
});
