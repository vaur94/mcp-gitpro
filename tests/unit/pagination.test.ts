import { describe, expect, it } from 'vitest';

import { normalizePagination } from '../../src/shared/pagination.js';

describe('normalizePagination', () => {
  it('varsayilan sayfa degerlerini uygular', () => {
    expect(normalizePagination({}, 30)).toEqual({
      page: 1,
      pageSize: 30,
      offset: 0,
    });
  });

  it('ust siniri pageSize icin uygular', () => {
    expect(normalizePagination({ page: 2, pageSize: 250 }, 30, 100)).toEqual({
      page: 2,
      pageSize: 100,
      offset: 100,
    });
  });

  it('gecersiz page degerinde hata firlatir', () => {
    expect(() => normalizePagination({ page: 0 }, 30)).toThrow(/page alani/u);
  });
});
