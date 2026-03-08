import { describe, expect, it } from 'vitest';

import { formatRepositoryRef, resolveRepositoryRef } from '../../src/github/repository-ref.js';
import { createTestConfig } from '../fixtures/runtime-config.js';

describe('resolveRepositoryRef', () => {
  it('istek alanlari onceliklidir', () => {
    const config = createTestConfig({
      defaults: {
        owner: 'varsayilan-sahip',
        repo: 'varsayilan-depo',
      },
    });

    const result = resolveRepositoryRef({ owner: 'istek-sahip', repo: 'istek-depo' }, config);

    expect(result).toEqual({ owner: 'istek-sahip', repo: 'istek-depo' });
    expect(formatRepositoryRef(result)).toBe('istek-sahip/istek-depo');
  });

  it('istek eksiginde config varsayilanlarina duser', () => {
    const config = createTestConfig({
      defaults: {
        owner: 'varsayilan-sahip',
        repo: 'varsayilan-depo',
      },
    });

    expect(resolveRepositoryRef({}, config)).toEqual({
      owner: 'varsayilan-sahip',
      repo: 'varsayilan-depo',
    });
  });

  it('owner ve repo birlikte yoksa hata verir', () => {
    const config = createTestConfig();

    expect(() => resolveRepositoryRef({}, config)).toThrow(/Depo sahibi ve depo adi/u);
  });
});
