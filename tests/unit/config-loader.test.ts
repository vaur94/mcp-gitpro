import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { loadGitProConfig } from '../../src/config/load-config.js';

const trackedEnv = [
  'MCP_GITPRO_GITHUB_TOKEN',
  'MCP_GITPRO_DEFAULT_OWNER',
  'MCP_GITPRO_DEFAULT_REPO',
  'MCP_GITPRO_API_BASE_URL',
  'MCP_GITPRO_READ_ONLY',
  'MCP_GITPRO_TOOLSETS',
  'MCP_GITPRO_TOOLS',
  'MCP_GITPRO_PAGE_SIZE',
  'MCP_GITPRO_MAX_FILE_LINES',
  'MCP_GITPRO_MAX_DIFF_LINES',
  'MCP_GITPRO_MAX_BODY_CHARS',
] as const;

const envSnapshot = Object.fromEntries(trackedEnv.map((key) => [key, process.env[key]]));
const originalCwd = process.cwd();

beforeEach(() => {
  process.chdir(originalCwd);
});

afterEach(() => {
  process.chdir(originalCwd);
  for (const key of trackedEnv) {
    const original = envSnapshot[key];
    if (original === undefined) {
      delete process.env[key];
      continue;
    }

    process.env[key] = original;
  }
});

describe('loadGitProConfig', () => {
  it('varsayilan config dosyasini yukler', async () => {
    const tempDir = await mkdtemp(path.join(tmpdir(), 'mcp-gitpro-config-'));
    const configPath = path.join(tempDir, 'mcp-gitpro.config.json');

    await writeFile(
      configPath,
      JSON.stringify({
        auth: { githubToken: 'dosya-tokeni' },
        defaults: { owner: 'vaur94', repo: 'mcp-gitpro', apiBaseUrl: 'https://api.github.com' },
        context: {
          readOnly: false,
          toolsets: ['context', 'repos', 'search', 'issues', 'pull_requests', 'actions'],
          tools: [],
        },
        output: {
          pageSize: 30,
          maxFileLines: 400,
          maxDiffLines: 400,
          maxBodyChars: 20000,
        },
      }),
      'utf8',
    );

    process.chdir(tempDir);

    const result = await loadGitProConfig([]);

    expect(result.auth.githubToken).toBe('dosya-tokeni');
    expect(result.defaults.owner).toBe('vaur94');
    expect(result.server.name).toBe('mcp-gitpro');
  });

  it('ortam degiskenleri ile config alanlarini ezer', async () => {
    process.env.MCP_GITPRO_GITHUB_TOKEN = 'ortam-tokeni';
    process.env.MCP_GITPRO_DEFAULT_OWNER = 'octocat';
    process.env.MCP_GITPRO_DEFAULT_REPO = 'hello-world';
    process.env.MCP_GITPRO_READ_ONLY = 'true';
    process.env.MCP_GITPRO_TOOLSETS = 'context,repos';
    process.env.MCP_GITPRO_TOOLS = 'github_context,repository_read';
    process.env.MCP_GITPRO_PAGE_SIZE = '50';

    const result = await loadGitProConfig([]);

    expect(result.auth.githubToken).toBe('ortam-tokeni');
    expect(result.defaults.owner).toBe('octocat');
    expect(result.defaults.repo).toBe('hello-world');
    expect(result.context.readOnly).toBe(true);
    expect(result.context.toolsets).toEqual(['context', 'repos']);
    expect(result.context.tools).toEqual(['github_context', 'repository_read']);
    expect(result.output.pageSize).toBe(50);
  });
});
