import { act, renderHook } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';
import { vi } from 'vitest';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('должен инициализироваться начальным значением, если в localStorage ничего нет', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));

    expect(result.current[0]).toBe('default');
    expect(localStorage.getItem).toHaveBeenCalledWith('testKey');
    expect(localStorage.getItem('testKey')).toBeNull();
  });

  it('должен инициализироваться сохраненным значением из localStorage', () => {
    localStorage.setItem('testKey', JSON.stringify('storedValue'));

    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));

    expect(result.current[0]).toBe('storedValue');
    expect(localStorage.getItem).toHaveBeenCalledWith('testKey');
  });

  it('должен обновлять localStorage при изменении значения', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));

    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'testKey',
      JSON.stringify('newValue')
    );
  });

  it('должен обрабатывать функциональные обновления', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));

    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'counter',
      JSON.stringify(1)
    );
  });

  it('должен обрабатывать сложные объекты', () => {
    const complexObject = { a: 1, b: { c: 2 } };
    const { result } = renderHook(() =>
      useLocalStorage('testKey', complexObject)
    );

    act(() => {
      result.current[1]({ ...complexObject, b: { c: 3 } });
    });

    expect(result.current[0]).toEqual({ a: 1, b: { c: 3 } });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'testKey',
      JSON.stringify({ a: 1, b: { c: 3 } })
    );
  });

  it('должен логировать ошибки при невалидном значении для сохранения', () => {
    const circularObject: { a: unknown } = { a: null };
    circularObject.a = circularObject;

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));

    act(() => {
      result.current[1](() => JSON.stringify(circularObject));
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error setting localStorage key "testKey":',
      expect.any(Error)
    );
  });

  it('должен реагировать на события storage от других вкладок', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'testKey',
          newValue: JSON.stringify('updatedValue'),
        })
      );
    });

    expect(result.current[0]).toBe('updatedValue');
  });

  it('должен игнорировать события storage для других ключей', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'otherKey',
          newValue: JSON.stringify('shouldNotAffectUs'),
        })
      );
    });

    expect(result.current[0]).toBe('default');
  });

  it('должен удалять обработчик события storage при размонтировании', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useLocalStorage('testKey', 'default'));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('storage', expect.any(Function));
  });
});
