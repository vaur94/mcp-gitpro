import type { GitProConfig } from './schema.js';

export const gitProDefaultConfig: GitProConfig = {
  server: {
    name: 'mcp-gitpro',
    version: '0.1.0',
  },
  logging: {
    level: 'info',
    includeTimestamp: true,
  },
  auth: {},
  defaults: {
    apiBaseUrl: 'https://api.github.com',
  },
  context: {
    readOnly: false,
    toolsets: ['context', 'repos', 'search', 'issues', 'pull_requests', 'actions'],
    tools: [],
  },
  output: {
    pageSize: 20,
    maxFileLines: 200,
    maxDiffLines: 200,
    maxBodyChars: 6_000,
  },
};
