import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { afterEach, describe, expect, it } from 'vitest';

const clients: Client[] = [];

function createClient(): Client {
  const client = new Client({ name: 'mcp-gitpro-test-client', version: '1.0.0' });
  clients.push(client);
  return client;
}

function createTransport(args: string[] = []): StdioClientTransport {
  return new StdioClientTransport({
    command: process.execPath,
    args: [path.resolve(process.cwd(), 'dist/index.js'), ...args],
  });
}

async function createConfigFile(config: Record<string, unknown>): Promise<string> {
  const tempDir = await mkdtemp(path.join(tmpdir(), 'mcp-gitpro-protocol-'));
  const configPath = path.join(tempDir, 'mcp-gitpro.config.json');
  await writeFile(configPath, JSON.stringify(config), 'utf8');
  return configPath;
}

afterEach(async () => {
  await Promise.all(clients.splice(0).map(async (client) => client.close()));
});

describe('stdio protocol', () => {
  it('tools/list kayitli araclari dondurur', async () => {
    const client = createClient();
    const transport = createTransport();

    await client.connect(transport);

    const result = await client.listTools();
    const toolNames = result.tools.map((tool) => tool.name);

    expect(toolNames).toContain('github_context');
    expect(toolNames).toContain('repository_read');
  });

  it('read araclarindan en az biri cagirilabilir', async () => {
    const client = createClient();
    const transport = createTransport();

    await client.connect(transport);

    const result = await client.callTool({
      name: 'github_context',
      arguments: {},
    });

    expect(result.isError).not.toBe(true);
    const content = result.content as Array<{ type: string; text: string }>;
    expect(content[0]?.type).toBe('text');
    expect(content[0]?.text).toMatch(/GitHub token durumu/u);
  });

  it('auth gerektiren arac token yoksa protokol seviyesinde hata doner', async () => {
    const configPath = await createConfigFile({
      defaults: { owner: 'vaur94', repo: 'mcp-gitpro', apiBaseUrl: 'https://api.github.com' },
      context: {
        readOnly: false,
        toolsets: ['context', 'repos', 'search', 'issues', 'pull_requests', 'actions'],
        tools: [],
      },
      output: {
        pageSize: 20,
        maxFileLines: 200,
        maxDiffLines: 200,
        maxBodyChars: 6000,
      },
    });
    const client = createClient();
    const transport = createTransport(['--config', configPath]);

    await client.connect(transport);

    const result = await client.callTool({
      name: 'repository_read',
      arguments: { method: 'overview' },
    });

    expect(result.isError).toBe(true);
    const content = result.content as Array<{ type: string; text: string }>;
    expect(content[0]?.text).toMatch(/GitHub token tanimli degil/u);
  });

  it('salt-okunur modda yazma araci kayittan dusurulur ve cagrilamaz', async () => {
    const configPath = await createConfigFile({
      auth: { githubToken: 'test-token' },
      defaults: { owner: 'vaur94', repo: 'mcp-gitpro', apiBaseUrl: 'https://api.github.com' },
      context: {
        readOnly: true,
        toolsets: ['context', 'repos', 'search', 'issues', 'pull_requests', 'actions'],
        tools: [],
      },
      output: {
        pageSize: 20,
        maxFileLines: 200,
        maxDiffLines: 200,
        maxBodyChars: 6000,
      },
    });
    const client = createClient();
    const transport = createTransport(['--config', configPath]);

    await client.connect(transport);

    const listedTools = await client.listTools();
    expect(listedTools.tools.map((tool) => tool.name)).not.toContain('issue_write');

    const result = await client.callTool({
      name: 'issue_write',
      arguments: { action: 'create', title: 'Blocked write' },
    });

    expect(result.isError).toBe(true);
    const content = result.content as Array<{ type: string; text: string }>;
    expect(content[0]?.text).toMatch(/issue_write/u);
  });
});
