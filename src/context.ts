import type { BaseToolExecutionContext } from '@vaur94/mcpbase';

import type { GitProConfig } from './config/schema.js';
import type { GitHubClient } from './github/client.js';

export interface GitProContext extends BaseToolExecutionContext<GitProConfig> {
  readonly client: GitHubClient;
}
