import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GitHubClient } from '../../src/github/client.js';
import { createTestConfig } from '../fixtures/runtime-config.js';

describe('GitHubClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('kimlik durumunu ve salt-okunur korumasini bildirir', () => {
    const config = createTestConfig({
      auth: { githubToken: 'token' },
      context: { readOnly: true },
    });
    const client = new GitHubClient(config);

    expect(client.isAuthenticated()).toBe(true);
    expect(() => client.assertWritable()).toThrow(/salt-okunur/u);
  });

  it('dosya icerigini decode eder ve sinirlar', () => {
    const client = new GitHubClient(createTestConfig({ output: { maxBodyChars: 100 } }));

    expect(client.decodeContent('aGVsbG8=')).toBe('hello');
    expect(client.clampBody('x'.repeat(7000))).toContain('[truncated]');
    expect(client.clampFile('a\nb\nc').returnedLines).toBe(3);
  });

  it('isteklerde auth basligi gonderir', async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const client = new GitHubClient(createTestConfig({ auth: { githubToken: 'secret-token' } }));
    await client.getJson('/user');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const firstCall = fetchMock.mock.calls[0] as unknown[] | undefined;
    if (!firstCall) {
      throw new Error('fetch cagrisi bekleniyordu.');
    }
    const init = firstCall[1] as RequestInit | undefined;
    expect(init?.headers).toMatchObject({ Authorization: 'Bearer secret-token' });
  });

  it('json olmayan hata govdesini de yuzeye cikarir', async () => {
    const fetchMock = vi.fn(async () => new Response('plain failure', { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);

    const client = new GitHubClient(createTestConfig());
    await expect(client.getJson('/broken')).rejects.toThrow(/plain failure/u);
  });

  it('token yoksa istek reddedilir, metin ve log adresi okunabilir', async () => {
    const tokenlessConfig = createTestConfig();
    tokenlessConfig.auth.githubToken = undefined;
    const tokenlessClient = new GitHubClient(tokenlessConfig);
    await expect(tokenlessClient.getJson('/user')).rejects.toThrow(/token/u);

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('body-text', { status: 200 }))
      .mockResolvedValueOnce(
        new Response(null, {
          status: 302,
          headers: { location: 'https://example.test/logs.zip' },
        }),
      );
    vi.stubGlobal('fetch', fetchMock);

    const client = new GitHubClient(createTestConfig());
    await expect(client.getText('/readme')).resolves.toBe('body-text');
    await expect(client.getDownloadUrl('/logs')).resolves.toBe('https://example.test/logs.zip');
  });
});
