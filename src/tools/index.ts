import type { GitProConfig } from '../config/schema.js';
import { filterTools } from '../core/tool-filtering.js';
import { createActionsReadTool } from './actions/actions-read.js';
import { createActionsWriteTool } from './actions/actions-write.js';
import { createGitHubContextTool } from './context/github-context.js';
import { createIssueReadTool } from './issues/issue-read.js';
import { createIssueWriteTool } from './issues/issue-write.js';
import { createPullRequestReadTool } from './pull-requests/pull-request-read.js';
import { createPullRequestWriteTool } from './pull-requests/pull-request-write.js';
import { createRepositoryCompareTool } from './repos/repository-compare.js';
import { createRepositoryReadTool } from './repos/repository-read.js';
import { createSearchGitHubTool } from './search/search-github.js';

export function createGitProTools(config: GitProConfig) {
  const tools = [
    createGitHubContextTool(),
    createRepositoryReadTool(),
    createRepositoryCompareTool(),
    createSearchGitHubTool(),
    createIssueReadTool(),
    createIssueWriteTool(),
    createPullRequestReadTool(),
    createPullRequestWriteTool(),
    createActionsReadTool(),
    createActionsWriteTool(),
  ] as const;

  return filterTools(tools, config);
}
