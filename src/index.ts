import { pathToFileURL } from 'node:url';

import {
  ApplicationRuntime,
  StderrLogger,
  createMcpServer,
  ensureAppError,
  startStdioServer,
} from '@vaur94/mcpbase';

import { loadGitProConfig } from './config/load-config.js';
import type { GitProConfig } from './config/schema.js';
import type { GitProContext } from './context.js';
import { GitHubClient } from './github/client.js';
import { createGitProTools } from './tools/index.js';

export { loadGitProConfig } from './config/load-config.js';
export { gitProDefaultConfig } from './config/default-config.js';
export {
  gitProConfigSchema,
  gitProToolNameSchema,
  gitProToolsetNameSchema,
} from './config/schema.js';
export type { GitProConfig, GitProToolName, GitProToolsetName } from './config/schema.js';
export type { GitProContext } from './context.js';
export { createGitProTools } from './tools/index.js';
export { filterTools } from './core/tool-filtering.js';
export { resolveRepositoryRef, formatRepositoryRef } from './github/repository-ref.js';
export { normalizePagination } from './shared/pagination.js';
export { formatList, truncateText } from './shared/formatting.js';

export async function bootstrap(argv: string[] = process.argv.slice(2)): Promise<void> {
  const config = await loadGitProConfig(argv);
  const logger = new StderrLogger(config.logging);
  const runtime = new ApplicationRuntime<GitProConfig, GitProContext>({
    config,
    logger,
    tools: createGitProTools(config),
    contextFactory: (toolName, requestId, runtimeConfig) => ({
      requestId,
      toolName,
      config: runtimeConfig,
      client: new GitHubClient(runtimeConfig),
    }),
  });

  const server = createMcpServer(runtime);
  await startStdioServer(server);
}

async function main(): Promise<void> {
  try {
    await bootstrap();
  } catch (error) {
    const appError = ensureAppError(error);
    const logger = new StderrLogger({ level: 'error', includeTimestamp: true });
    logger.error(appError.message, { errorCode: appError.code, toolName: 'bootstrap' });
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main();
}
