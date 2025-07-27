import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';
import type { PaginationProps } from '../../types/pagination.types';
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

  const renderPagination = (props = defaultProps) => {
    return render(<Pagination {...props} />);
  };

  it('отображает элементы управления пагинацией', () => {
    renderPagination();
    expect(screen.getByRole('button', { name: '«' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '‹' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '›' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '»' })).toBeInTheDocument();
  });

  it('отображает правильные номера страниц', () => {
    renderPagination();
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
  });

  it('отмечает текущую страницу как активную', () => {
    renderPagination();
    const activeButton = screen.getByRole('button', { name: '3' });
    expect(activeButton).toHaveClass('active');
  });

  it('вызывает onPageChange с правильным номером страницы при нажатии кнопок', () => {
    renderPagination();

    fireEvent.click(screen.getByRole('button', { name: '1' }));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: '5' }));
    expect(mockOnPageChange).toHaveBeenCalledWith(5);

    fireEvent.click(screen.getByRole('button', { name: '‹' }));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByRole('button', { name: '›' }));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);

    fireEvent.click(screen.getByRole('button', { name: '«' }));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: '»' }));
    expect(mockOnPageChange).toHaveBeenCalledWith(10);
  });

  it('отключает кнопки навигации на первой/последней странице', () => {
    const { unmount } = renderPagination({ ...defaultProps, currentPage: 1 });
    expect(screen.getByRole('button', { name: '«' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '‹' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '›' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '»' })).toBeEnabled();

    unmount();

    renderPagination({ ...defaultProps, currentPage: 10 });
    expect(screen.getByRole('button', { name: '«' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '‹' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '›' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '»' })).toBeDisabled();
  });

  it('показывает правильный диапазон страниц, когда он близок к началу/концу', () => {
    renderPagination({ ...defaultProps, currentPage: 2, totalPages: 5 });
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();

    renderPagination({ ...defaultProps, currentPage: 8, totalPages: 10 });
    expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '8' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '9' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
  });
});
