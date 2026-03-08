import { AppError, envBoolean, envList, envName, loadConfig } from '@vaur94/mcpbase';

import { gitProDefaultConfig } from './default-config.js';
import {
  gitProConfigSchema,
  gitProToolNameSchema,
  gitProToolsetNameSchema,
  type GitProConfig,
} from './schema.js';

function envNumber(name: string): number | undefined {
  const value = process.env[name];
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    throw new AppError('CONFIG_ERROR', `${name} tam sayi olmali.`);
  }

  return parsed;
}

function parseToolsets(values: string[] | undefined) {
  if (!values) {
    return undefined;
  }
  return values.map((value) => gitProToolsetNameSchema.parse(value));
}

function parseTools(values: string[] | undefined) {
  if (!values) {
    return undefined;
  }
  return values.map((value) => gitProToolNameSchema.parse(value));
}

export async function loadGitProConfig(
  argv: string[] = process.argv.slice(2),
): Promise<GitProConfig> {
  return loadConfig(gitProConfigSchema, {
    envPrefix: 'MCP_GITPRO_',
    defaultConfigFile: 'mcp-gitpro.config.json',
    defaults: gitProDefaultConfig,
    envMapper: (prefix) => ({
      auth: {
        githubToken: process.env[envName(prefix, 'GITHUB_TOKEN')],
      },
      defaults: {
        owner: process.env[envName(prefix, 'DEFAULT_OWNER')],
        repo: process.env[envName(prefix, 'DEFAULT_REPO')],
        apiBaseUrl: process.env[envName(prefix, 'API_BASE_URL')],
      },
      context: {
        readOnly: envBoolean(envName(prefix, 'READ_ONLY')),
        toolsets: parseToolsets(envList(envName(prefix, 'TOOLSETS'))),
        tools: parseTools(envList(envName(prefix, 'TOOLS'))),
      },
      output: {
        pageSize: envNumber(envName(prefix, 'PAGE_SIZE')),
        maxFileLines: envNumber(envName(prefix, 'MAX_FILE_LINES')),
        maxDiffLines: envNumber(envName(prefix, 'MAX_DIFF_LINES')),
        maxBodyChars: envNumber(envName(prefix, 'MAX_BODY_CHARS')),
      },
    }),
    argv,
  });
}
