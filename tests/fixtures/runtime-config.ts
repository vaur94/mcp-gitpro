import type { GitProConfig, GitProToolName, GitProToolsetName } from '../../src/config/schema.js';

interface DeepPartial {
  [K: string]: unknown;
}

export function createTestConfig(overrides: DeepPartial = {}): GitProConfig {
  const baseToolsets: GitProToolsetName[] = [
    'context',
    'repos',
    'search',
    'issues',
    'pull_requests',
    'actions',
  ];
  const baseTools: GitProToolName[] = [];

  const serverOverrides = (overrides.server ?? {}) as Partial<GitProConfig['server']>;
  const loggingOverrides = (overrides.logging ?? {}) as Partial<GitProConfig['logging']>;
  const authOverrides = (overrides.auth ?? {}) as Partial<GitProConfig['auth']>;
  const defaultsOverrides = (overrides.defaults ?? {}) as Partial<GitProConfig['defaults']>;
  const contextOverrides = (overrides.context ?? {}) as Partial<GitProConfig['context']>;
  const outputOverrides = (overrides.output ?? {}) as Partial<GitProConfig['output']>;

  return {
    server: {
      name: serverOverrides.name ?? 'mcp-gitpro',
      version: serverOverrides.version ?? '0.1.0',
    },
    logging: {
      level: loggingOverrides.level ?? 'info',
      includeTimestamp: loggingOverrides.includeTimestamp ?? true,
    },
    auth: {
      githubToken: authOverrides.githubToken ?? 'test-token',
    },
    defaults: {
      owner: defaultsOverrides.owner,
      repo: defaultsOverrides.repo,
      apiBaseUrl: defaultsOverrides.apiBaseUrl ?? 'https://api.github.com',
    },
    context: {
      readOnly: contextOverrides.readOnly ?? false,
      toolsets: (contextOverrides.toolsets as GitProToolsetName[] | undefined) ?? baseToolsets,
      tools: (contextOverrides.tools as GitProToolName[] | undefined) ?? baseTools,
    },
    output: {
      pageSize: outputOverrides.pageSize ?? 30,
      maxFileLines: outputOverrides.maxFileLines ?? 400,
      maxDiffLines: outputOverrides.maxDiffLines ?? 400,
      maxBodyChars: outputOverrides.maxBodyChars ?? 20_000,
    },
  };
}
