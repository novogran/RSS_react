import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorDisplay from './ErrorDisplay';

vi.mock('next-intl', () => ({
  useTranslations: () => {
    return (key: string) => {
      const translations = {
        title: 'Error occurred',
        defaultErrorMessage: 'Something went wrong',
        recoverButtonLabel: 'Reset application',
        recoverButtonText: 'Try again',
      };
      return translations[key as keyof typeof translations];
    };
  },
}));

describe('ErrorDisplay', () => {
  it('должен отображать заголовок ошибки и стандартное сообщение, если error не передан', () => {
    const mockReset = vi.fn();
    render(<ErrorDisplay error={null} onReset={mockReset} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Reset application' })
    ).toHaveTextContent('Try again');
  });

  it('должен отображать сообщение об ошибке из пропса error', () => {
    const mockReset = vi.fn();
    const testError = new Error('Test error message');
    render(<ErrorDisplay error={testError} onReset={mockReset} />);

    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('должен вызывать onReset при клике на кнопку', () => {
    const mockReset = vi.fn();
    render(<ErrorDisplay error={null} onReset={mockReset} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('должен иметь правильные классы CSS', () => {
    const mockReset = vi.fn();
    render(<ErrorDisplay error={null} onReset={mockReset} />);

    const container = screen.getByRole('alert');
    expect(container).toHaveClass('error-boundary');
    expect(container.querySelector('.error-content')).toBeInTheDocument();
    expect(container.querySelector('.error-button')).toBeInTheDocument();
  });
});
