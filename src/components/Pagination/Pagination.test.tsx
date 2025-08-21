import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';
import type { PaginationProps } from './types/pagination.types';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

describe('Pagination', () => {
  const mockOnPageChange = vi.fn();
  const defaultProps: PaginationProps = {
    currentPage: 3,
    totalPages: 10,
    onPageChange: mockOnPageChange,
  };

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  const renderPagination = (props: Partial<PaginationProps> = {}) => {
    return render(<Pagination {...defaultProps} {...props} />);
  };

  it('отображает элементы управления пагинацией', () => {
    renderPagination();

    const navigationButtons = [
      { name: 'First page', symbol: '«' },
      { name: 'Previous page', symbol: '‹' },
      { name: 'Next page', symbol: '›' },
      { name: 'Last page', symbol: '»' },
    ];

    navigationButtons.forEach(({ name, symbol }) => {
      const button = screen.getByRole('button', { name });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent(symbol);
    });
  });

  it('отображает правильный диапазон номеров страниц', () => {
    renderPagination();

    const pageButtons = screen.getAllByRole('button', { name: /^Page \d+$/ });
    expect(pageButtons).toHaveLength(5);

    for (let i = 1; i <= 5; i++) {
      expect(
        screen.getByRole('button', { name: `Page ${i}` })
      ).toBeInTheDocument();
    }
  });

  it('отмечает текущую страницу как активную', () => {
    renderPagination();

    const pageButtons = screen.getAllByRole('button', { name: /^Page \d+$/ });

    const activeButtons = pageButtons.filter(
      (button) => button.getAttribute('aria-current') === 'page'
    );

    expect(activeButtons).toHaveLength(1);

    const activeButton = activeButtons[0];
    expect(activeButton).toHaveClass('active');
    expect(activeButton).toHaveTextContent('3');
    expect(activeButton).toHaveAttribute('aria-label', 'Page 3');
  });

  it('вызывает onPageChange с правильным номером страницы при клике', () => {
    renderPagination();

    fireEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByRole('button', { name: 'First page' }));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);

    fireEvent.click(screen.getByRole('button', { name: 'Last page' }));
    expect(mockOnPageChange).toHaveBeenCalledWith(10);
  });

  it('отключает кнопки навигации на граничных страницах', () => {
    const { rerender } = renderPagination({ currentPage: 1 });
    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Previous page' })
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Last page' })).toBeEnabled();

    rerender(<Pagination {...defaultProps} currentPage={10} />);
    expect(screen.getByRole('button', { name: 'First page' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled();
  });

  describe('корректно отображает диапазон страниц при разных условиях', () => {
    it('близко к началу', () => {
      const { unmount } = renderPagination({ currentPage: 2, totalPages: 5 });

      const buttons = screen.getAllByRole('button', { name: /^Page/ });
      const pageNumbers = buttons.map((btn) => btn.textContent);

      expect(pageNumbers).toEqual(['1', '2', '3', '4', '5']);
      unmount();
    });

    it('близко к концу', () => {
      const { unmount } = renderPagination({ currentPage: 8, totalPages: 10 });

      const buttons = screen.getAllByRole('button', { name: /^Page/ });
      const pageNumbers = buttons.map((btn) => btn.textContent);

      expect(pageNumbers).toEqual(['6', '7', '8', '9', '10']);
      unmount();
    });

    it('меньше 5 страниц', () => {
      const { unmount } = renderPagination({ currentPage: 1, totalPages: 3 });

      const buttons = screen.getAllByRole('button', { name: /^Page/ });
      const pageNumbers = buttons.map((btn) => btn.textContent);

      expect(pageNumbers).toEqual(['1', '2', '3']);
      unmount();
    });
  });

  it('добавляет правильные aria-атрибуты', () => {
    renderPagination();
    expect(screen.getByRole('navigation')).toHaveAttribute(
      'aria-label',
      'Pagination'
    );
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });
});
