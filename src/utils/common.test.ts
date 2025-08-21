import { handleDownloadCSV, prepareData } from './common';
import { vi, Mock } from 'vitest';
import {
  mockPikachuDetailApi,
  mockPokemon,
} from '@/test-utils/mocks/pokemonapi';

describe('Утилиты для работы с покемонами', () => {
  describe('prepareData', () => {
    it('должна корректно преобразовывать ответ API в упрощенный формат покемона', () => {
      const result = prepareData(mockPikachuDetailApi);

      expect(result).toEqual({
        name: 'pikachu',
        url: 'https://pokeapi.co/api/v2/pokemon/25/',
        id: 25,
        types: ['electric'],
        abilities: ['static', 'lightning-rod'],
        sprites: mockPikachuDetailApi.sprites,
        height: 4,
        weight: 60,
        stats: mockPikachuDetailApi.stats,
      });
    });
  });

  describe('handleDownloadCSV', () => {
    let mockBlobConstructor: Mock;

    beforeEach(() => {
      global.URL.createObjectURL = vi.fn(() => 'mock-url');

      mockBlobConstructor = vi.fn(function (
        content: unknown[],
        options?: { type?: string }
      ) {
        return {
          content,
          options,
          size: 0,
          type: options?.type || '',
          arrayBuffer: vi.fn(),
          slice: vi.fn(),
          stream: vi.fn(),
          text: vi.fn(),
        };
      }) as Mock;

      global.Blob = mockBlobConstructor as unknown as typeof Blob;

      vi.stubGlobal('document', {
        createElement: vi.fn(() => ({
          href: '',
          download: '',
          click: vi.fn(),
        })),
        body: {
          appendChild: vi.fn(),
          removeChild: vi.fn(),
        },
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('не должна пытаться скачать CSV в серверном окружении (когда window не определен)', () => {
      const originalWindow = global.window;
      // @ts-expect-error - intentionally testing undefined window
      global.window = undefined;

      const consoleWarnSpy = vi.spyOn(console, 'warn');
      handleDownloadCSV([mockPokemon], 1);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'CSV download is only available in browser environment'
      );

      global.window = originalWindow;
    });

    it('должна создавать и запускать загрузку CSV файла с корректными данными', async () => {
      await handleDownloadCSV([mockPokemon], 1);

      expect(mockBlobConstructor).toHaveBeenCalledWith(expect.any(Array), {
        type: 'text/csv',
      });
      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });

    it('должна задавать имя файла в формате "{количество}_pokemons.csv"', async () => {
      await handleDownloadCSV([mockPokemon], 3);

      const link = (document.createElement as Mock).mock.results[0].value;
      expect(link.download).toBe('3_pokemons.csv');
    });

    it('должна обрабатывать ошибки при создании CSV и логировать их в консоль', async () => {
      const error = new Error('Test error');
      vi.spyOn(console, 'error');

      mockBlobConstructor.mockImplementationOnce(() => {
        throw error;
      });

      await handleDownloadCSV([mockPokemon], 1);

      expect(console.error).toHaveBeenCalledWith('Download failed:', error);
    });
  });
});
