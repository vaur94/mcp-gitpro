import { Buffer } from 'node:buffer';

import { AppError } from '@vaur94/mcpbase';

import type { GitProConfig } from '../config/schema.js';
import { truncateLines, truncateText } from '../shared/formatting.js';

interface RequestOptions {
  readonly query?: Record<string, string | number | boolean | undefined>;
  readonly body?: unknown;
  readonly accept?: string;
}

export class GitHubClient {
  readonly #config: GitProConfig;

  public constructor(config: GitProConfig) {
    this.#config = config;
  }

  public isAuthenticated(): boolean {
    return Boolean(this.#config.auth.githubToken);
  }

  public assertAuthenticated(): void {
    if (!this.#config.auth.githubToken) {
      throw new AppError('CONFIG_ERROR', 'GitHub token tanimli degil.');
    }
  }

  public assertWritable(): void {
    if (this.#config.context.readOnly) {
      throw new AppError('PERMISSION_DENIED', 'Sunucu salt-okunur modda calisiyor.');
    }
  }

  public async getJson<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.requestJson<T>('GET', path, options);
  }

  public async sendJson<T>(method: string, path: string, options?: RequestOptions): Promise<T> {
    return this.requestJson<T>(method, path, options);
  }

  public async getText(path: string, options?: RequestOptions): Promise<string> {
    const response = await this.fetchWithErrors('GET', path, options);
    return response.text();
  }

  public async getDownloadUrl(path: string): Promise<string> {
    this.assertAuthenticated();
    const url = new URL(path, ensureApiBaseUrl(this.#config.defaults.apiBaseUrl));
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.#config.auth.githubToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'mcp-gitpro/0.1.0',
      },
    });
    const location = response.headers.get('location');
    if (!location || response.status < 300 || response.status >= 400) {
      throw new AppError('TOOL_EXECUTION_ERROR', 'Indirme adresi alinamadi.');
    }
    return location;
  }

  public decodeContent(encoded: string): string {
    return Buffer.from(encoded.replace(/\n/gu, ''), 'base64').toString('utf8');
  }

  public clampBody(text: string): string {
    return truncateText(text, this.#config.output.maxBodyChars);
  }

  public clampFile(text: string) {
    return truncateLines(text, this.#config.output.maxFileLines);
  }

  public clampDiff(text: string) {
    return truncateLines(text, this.#config.output.maxDiffLines);
  }

  private async requestJson<T>(method: string, path: string, options?: RequestOptions): Promise<T> {
    const response = await this.fetchWithErrors(method, path, options);
    return response.json() as Promise<T>;
  }

  private async fetchWithErrors(
    method: string,
    path: string,
    options?: RequestOptions,
    redirect: RequestRedirect = 'follow',
  ): Promise<Response> {
    this.assertAuthenticated();
    const url = new URL(path, ensureApiBaseUrl(this.#config.defaults.apiBaseUrl));
    for (const [key, value] of Object.entries(options?.query ?? {})) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }

    const response = await fetch(url, {
      method,
      redirect,
      headers: {
        Accept: options?.accept ?? 'application/vnd.github+json',
        Authorization: `Bearer ${this.#config.auth.githubToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'mcp-gitpro/0.1.0',
        ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (response.ok) {
      return response;
    }

    let detail = `${response.status} ${response.statusText}`;
    const rawBody = await response.text();
    if (rawBody) {
      try {
        const parsed = JSON.parse(rawBody) as { message?: string };
        if (parsed.message) {
          detail = parsed.message;
        }
      } catch (parseError) {
        if (parseError instanceof Error) {
          detail = rawBody.trim().slice(0, 200);
        }
      }
    }

    throw new AppError('TOOL_EXECUTION_ERROR', `GitHub istegi basarisiz oldu: ${detail}`);
  }
}

function ensureApiBaseUrl(value: string): string {
  return value.endsWith('/') ? value : `${value}/`;
}
