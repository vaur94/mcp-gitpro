import { describe, expect, it, vi } from 'vitest';

import type { GitProContext } from '../../src/context.js';
import { GitHubClient } from '../../src/github/client.js';
import { createActionsReadTool } from '../../src/tools/actions/actions-read.js';
import { createActionsWriteTool } from '../../src/tools/actions/actions-write.js';
import { createGitHubContextTool } from '../../src/tools/context/github-context.js';
import { createIssueReadTool } from '../../src/tools/issues/issue-read.js';
import { createIssueWriteTool } from '../../src/tools/issues/issue-write.js';
import { createPullRequestReadTool } from '../../src/tools/pull-requests/pull-request-read.js';
import { createPullRequestWriteTool } from '../../src/tools/pull-requests/pull-request-write.js';
import { createRepositoryCompareTool } from '../../src/tools/repos/repository-compare.js';
import { createRepositoryReadTool } from '../../src/tools/repos/repository-read.js';
import { createSearchGitHubTool } from '../../src/tools/search/search-github.js';
import { truncateText } from '../../src/shared/formatting.js';
import { createTestConfig } from '../fixtures/runtime-config.js';

function createContext(overrides?: Parameters<typeof createTestConfig>[0]): GitProContext {
  const config = createTestConfig(overrides);
  const client = new GitHubClient(config);

  client.getJson = vi.fn(async (path: string) => {
    if (path.includes('/search/')) {
      return { total_count: 1, items: [{ id: 1, body: 'aramada uzun govde' }] };
    }
    if (path.includes('/compare/')) {
      return {
        total_commits: 1,
        files: [{ filename: 'a.ts', patch: '@@\n-test\n+ok' }],
        commits: [],
      };
    }
    if (path.includes('/compare-no-patch/')) {
      return {
        total_commits: 1,
        files: [{ filename: 'b.ts' }],
        commits: [],
      };
    }
    if (path.includes('/check-runs')) {
      return { total_count: 1, check_runs: [{ name: 'ci', conclusion: 'success' }] };
    }
    if (path.includes('/jobs') && path.includes('/actions/runs/')) {
      return { jobs: [{ name: 'build', conclusion: 'failure' }] };
    }
    if (path.includes('/actions/workflows')) {
      return { workflows: [{ id: 1, name: 'CI' }] };
    }
    if (path.includes('/actions/runs')) {
      return { workflow_runs: [{ id: 11, status: 'completed' }] };
    }
    if (
      path.includes('/pulls/7') &&
      !path.includes('/files') &&
      !path.includes('/reviews') &&
      !path.includes('/comments')
    ) {
      return { number: 7, head: { sha: 'abc123' } };
    }
    if (path.includes('/pulls')) {
      return [{ number: 7, title: 'test-pr', body: 'pr govdesi' }];
    }
    if (path.includes('/issues/5/comments')) {
      return [{ id: 1, body: 'yorum govdesi' }];
    }
    if (path.includes('/issues/5/labels')) {
      return [{ id: 1, name: 'bug' }];
    }
    if (path.includes('/issues/5')) {
      return { number: 5, title: 'issue', body: 'issue govdesi' };
    }
    if (path.includes('/issues')) {
      return [{ number: 5, title: 'issue', body: 'liste govdesi' }];
    }
    if (path.includes('/contents/README.md')) {
      return { type: 'file', content: 'aGVsbG8=', size: 5, sha: 'sha1' };
    }
    if (path.includes('/contents/src')) {
      return [{ type: 'file', name: 'index.ts' }];
    }
    if (
      path.includes('/branches') ||
      path.includes('/commits') ||
      path.includes('/tags') ||
      path.includes('/releases') ||
      path.includes('/labels')
    ) {
      return [{ name: 'item', body: 'release govdesi' }];
    }
    return {
      default_branch: 'main',
      open_issues_count: 1,
      stargazers_count: 2,
      body: 'overview govdesi',
    };
  }) as typeof client.getJson;
  client.sendJson = vi.fn(async (_method: string, path: string) => {
    if (path.includes('/merge')) return { merged: true };
    if (path.includes('/update-branch')) return { message: 'ok' };
    if (path.includes('/comments')) return { id: 99, body: 'yorum yaniti govdesi' };
    return { id: 42, number: 5, body: 'yazma yaniti govdesi' };
  }) as typeof client.sendJson;
  client.getText = vi.fn(async () => '@@\n-old\n+new') as typeof client.getText;
  client.getDownloadUrl = vi.fn(
    async () => 'https://example.test/logs',
  ) as typeof client.getDownloadUrl;
  client.assertWritable = vi.fn() as typeof client.assertWritable;

  return {
    requestId: 'req-1',
    toolName: 'tool',
    config,
    client,
  };
}

describe('tool execution', () => {
  it('context araci yapilandirma ozetini dondurur', async () => {
    const tool = createGitHubContextTool();
    const result = await tool.execute({}, createContext());
    expect(result.structuredContent).toMatchObject({ authenticated: true, readOnly: false });
  });

  it('context araci token ve varsayilan yoksa bunu acikca soyler', async () => {
    const context = createContext({ defaults: { owner: undefined, repo: undefined } });
    context.config.auth.githubToken = undefined;
    const tool = createGitHubContextTool();
    const result = await tool.execute({}, context);

    expect(result.content[0]?.text).toMatch(/eksik/u);
    expect(result.structuredContent).toMatchObject({ authenticated: false });
  });

  it('repo ve arama araclari gercek yapi dondurur', async () => {
    const context = createContext({ defaults: { owner: 'vaur94', repo: 'mcp-gitpro' } });
    const overview = await createRepositoryReadTool().execute({ method: 'overview' }, context);
    const branches = await createRepositoryReadTool().execute({ method: 'branches' }, context);
    const commits = await createRepositoryReadTool().execute({ method: 'commits' }, context);
    const tags = await createRepositoryReadTool().execute({ method: 'tags' }, context);
    const releases = await createRepositoryReadTool().execute({ method: 'releases' }, context);
    const labels = await createRepositoryReadTool().execute({ method: 'labels' }, context);
    const file = await createRepositoryReadTool().execute(
      { method: 'file', path: 'README.md' },
      context,
    );
    const directory = await createRepositoryReadTool().execute(
      { method: 'directory', path: 'src' },
      context,
    );
    const compare = await createRepositoryCompareTool().execute(
      { base: 'main', head: 'feat', owner: 'vaur94', repo: 'mcp-gitpro' },
      context,
    );
    const search = await createSearchGitHubTool().execute(
      { scope: 'issues', query: 'bug', owner: 'vaur94', repo: 'mcp-gitpro' },
      context,
    );

    expect(overview.content[0]?.text).toMatch(/Varsayilan dal/u);
    expect(branches.structuredContent).toHaveProperty('items');
    expect(commits.structuredContent).toHaveProperty('items');
    expect(tags.structuredContent).toHaveProperty('items');
    expect(releases.structuredContent).toHaveProperty('items');
    expect(labels.structuredContent).toHaveProperty('items');
    expect(file.structuredContent).toMatchObject({ path: 'README.md', sha: 'sha1' });
    expect(directory.structuredContent).toHaveProperty('entries');
    expect(compare.structuredContent).toMatchObject({ totalCommits: 1 });
    expect(search.structuredContent).toMatchObject({ totalCount: 1 });
  });

  it('repo compare ve search farkli dallari da kapsar', async () => {
    const context = createContext({ defaults: { owner: 'vaur94', repo: 'mcp-gitpro' } });
    context.client.getJson = vi.fn(async (path: string) => {
      if (path.includes('/compare/')) {
        return { total_commits: 1, files: [{ filename: 'b.ts' }], commits: [] };
      }
      return { total_count: 1, items: [{ id: 1 }] };
    }) as typeof context.client.getJson;

    const compare = await createRepositoryCompareTool().execute(
      { base: 'compare-no-patch', head: 'head', owner: 'vaur94', repo: 'mcp-gitpro' },
      context,
    );
    const codeSearch = await createSearchGitHubTool().execute(
      { scope: 'code', query: 'foo' },
      context,
    );
    const prSearch = await createSearchGitHubTool().execute(
      { scope: 'pull_requests', query: 'bar' },
      context,
    );
    const repoSearch = await createSearchGitHubTool().execute(
      { scope: 'repositories', query: 'baz' },
      context,
    );
    const userSearch = await createSearchGitHubTool().execute(
      { scope: 'users', query: 'octocat' },
      context,
    );

    expect(compare.structuredContent).toHaveProperty('files');
    expect(codeSearch.structuredContent).toMatchObject({ scope: 'code' });
    expect(prSearch.structuredContent).toMatchObject({ scope: 'pull_requests' });
    expect(repoSearch.structuredContent).toMatchObject({ scope: 'repositories' });
    expect(userSearch.structuredContent).toMatchObject({ scope: 'users' });
  });

  it('issue ve PR araclari okuma ve yazma akislarini calistirir', async () => {
    const context = createContext({ defaults: { owner: 'vaur94', repo: 'mcp-gitpro' } });
    const issueRead = await createIssueReadTool().execute({ method: 'list' }, context);
    const issueGet = await createIssueReadTool().execute(
      { method: 'get', issueNumber: 5 },
      context,
    );
    const issueComments = await createIssueReadTool().execute(
      { method: 'comments', issueNumber: 5 },
      context,
    );
    const issueLabels = await createIssueReadTool().execute(
      { method: 'labels', issueNumber: 5 },
      context,
    );
    const issueWrite = await createIssueWriteTool().execute(
      { action: 'create', title: 'Yeni issue' },
      context,
    );
    const issueComment = await createIssueWriteTool().execute(
      { action: 'comment', issueNumber: 5, body: 'yorum' },
      context,
    );
    const issueUpdate = await createIssueWriteTool().execute(
      { action: 'update', issueNumber: 5, title: 'Guncel issue' },
      context,
    );
    const prList = await createPullRequestReadTool().execute({ method: 'list' }, context);
    const prGet = await createPullRequestReadTool().execute(
      { method: 'get', pullNumber: 7 },
      context,
    );
    const prDiff = await createPullRequestReadTool().execute(
      { method: 'diff', pullNumber: 7 },
      context,
    );
    const prFiles = await createPullRequestReadTool().execute(
      { method: 'files', pullNumber: 7 },
      context,
    );
    const prReviews = await createPullRequestReadTool().execute(
      { method: 'reviews', pullNumber: 7 },
      context,
    );
    const prComments = await createPullRequestReadTool().execute(
      { method: 'comments', pullNumber: 7 },
      context,
    );
    const prRead = await createPullRequestReadTool().execute(
      { method: 'checks', pullNumber: 7 },
      context,
    );
    const prCreate = await createPullRequestWriteTool().execute(
      { action: 'create', title: 'Yeni PR', head: 'feat', base: 'main' },
      context,
    );
    const prComment = await createPullRequestWriteTool().execute(
      { action: 'comment', pullNumber: 7, body: 'yorum' },
      context,
    );
    const prWrite = await createPullRequestWriteTool().execute(
      { action: 'merge', pullNumber: 7 },
      context,
    );
    const prUpdateBranch = await createPullRequestWriteTool().execute(
      { action: 'update_branch', pullNumber: 7 },
      context,
    );
    const prUpdate = await createPullRequestWriteTool().execute(
      { action: 'update', pullNumber: 7, title: 'Guncel PR' },
      context,
    );

    expect(issueRead.structuredContent).toHaveProperty('items');
    expect(issueGet.structuredContent).toHaveProperty('issue');
    expect(issueComments.structuredContent).toHaveProperty('items');
    expect(issueLabels.structuredContent).toHaveProperty('items');
    expect(issueWrite.structuredContent).toHaveProperty('issue');
    expect(issueComment.structuredContent).toHaveProperty('comment');
    expect(issueUpdate.structuredContent).toHaveProperty('issue');
    expect(prList.structuredContent).toHaveProperty('items');
    expect(prGet.structuredContent).toHaveProperty('pullRequest');
    expect(prDiff.structuredContent).toHaveProperty('truncated');
    expect(prFiles.structuredContent).toHaveProperty('items');
    expect(prReviews.structuredContent).toHaveProperty('items');
    expect(prComments.structuredContent).toHaveProperty('items');
    expect(prRead.structuredContent).toHaveProperty('checks');
    expect(prCreate.structuredContent).toHaveProperty('pullRequest');
    expect(prComment.structuredContent).toHaveProperty('comment');
    expect(prWrite.structuredContent).toHaveProperty('merge');
    expect(prUpdateBranch.structuredContent).toHaveProperty('result');
    expect(prUpdate.structuredContent).toHaveProperty('pullRequest');
  });

  it('actions araclari workflow okuma ve yazma akislarini calistirir', async () => {
    const context = createContext({ defaults: { owner: 'vaur94', repo: 'mcp-gitpro' } });
    const workflows = await createActionsReadTool().execute({ method: 'workflows' }, context);
    const runs = await createActionsReadTool().execute({ method: 'runs' }, context);
    const jobs = await createActionsReadTool().execute({ method: 'jobs', runId: 10 }, context);
    const artifacts = await createActionsReadTool().execute(
      { method: 'artifacts', runId: 10 },
      context,
    );
    const read = await createActionsReadTool().execute(
      { method: 'failed_summary', runId: 10 },
      context,
    );
    const logs = await createActionsReadTool().execute({ method: 'logs_url', jobId: 9 }, context);
    const write = await createActionsWriteTool().execute(
      { action: 'dispatch', workflowId: 'ci.yml', ref: 'main' },
      context,
    );
    const rerun = await createActionsWriteTool().execute({ action: 'rerun', runId: 10 }, context);
    const cancel = await createActionsWriteTool().execute({ action: 'cancel', runId: 10 }, context);

    expect(workflows.structuredContent).toHaveProperty('workflows');
    expect(runs.structuredContent).toHaveProperty('runs');
    expect(jobs.structuredContent).toHaveProperty('jobs');
    expect(artifacts.structuredContent).toHaveProperty('artifacts');
    expect(read.structuredContent).toHaveProperty('failedJobs');
    expect(logs.structuredContent).toHaveProperty('downloadUrl');
    expect(write.structuredContent).toMatchObject({ workflowId: 'ci.yml' });
    expect(rerun.structuredContent).toMatchObject({ action: 'rerun' });
    expect(cancel.structuredContent).toMatchObject({ action: 'cancel' });
  });

  it('eksik zorunlu alanlarda dogrulama hatasi verir', async () => {
    const context = createContext({ defaults: { owner: 'vaur94', repo: 'mcp-gitpro' } });

    await expect(createIssueReadTool().execute({ method: 'get' }, context)).rejects.toThrow(
      /issueNumber/u,
    );
    await expect(createIssueWriteTool().execute({ action: 'comment' }, context)).rejects.toThrow(
      /issueNumber/u,
    );
    await expect(createPullRequestReadTool().execute({ method: 'get' }, context)).rejects.toThrow(
      /pullNumber/u,
    );
    await expect(
      createPullRequestWriteTool().execute({ action: 'merge' }, context),
    ).rejects.toThrow(/pullNumber/u);
    await expect(createActionsReadTool().execute({ method: 'jobs' }, context)).rejects.toThrow(
      /runId/u,
    );
    await expect(createActionsWriteTool().execute({ action: 'dispatch' }, context)).rejects.toThrow(
      /workflowId/u,
    );
  });

  it('buyuk body alanlarini tum ana GitHub araclarinda kirpar', async () => {
    const longBody = 'A'.repeat(64);
    const context = createContext({
      defaults: { owner: 'vaur94', repo: 'mcp-gitpro' },
      output: { maxBodyChars: 24 },
    });

    context.client.getJson = vi.fn(async (path: string) => {
      if (path.includes('/search/')) {
        return { total_count: 1, items: [{ id: 1, body: longBody }] };
      }
      if (path.includes('/pulls/7/comments')) {
        return [{ id: 3, body: longBody }];
      }
      if (path.includes('/pulls/7') && !path.includes('/files') && !path.includes('/reviews')) {
        return { number: 7, head: { sha: 'abc123' }, body: longBody };
      }
      if (path.includes('/pulls')) {
        return [{ number: 7, body: longBody }];
      }
      if (path.includes('/issues/5/comments')) {
        return [{ id: 2, body: longBody }];
      }
      if (path.includes('/issues/5')) {
        return { number: 5, body: longBody };
      }
      if (path.includes('/issues')) {
        return [{ number: 5, body: longBody }];
      }
      if (path.includes('/releases')) {
        return [{ id: 1, body: longBody }];
      }
      return { default_branch: 'main', body: longBody };
    }) as typeof context.client.getJson;
    context.client.sendJson = vi.fn(async () => ({
      id: 42,
      body: longBody,
    })) as typeof context.client.sendJson;

    const expected = truncateText(longBody, 24);

    const issueGet = await createIssueReadTool().execute(
      { method: 'get', issueNumber: 5 },
      context,
    );
    const issueList = await createIssueReadTool().execute({ method: 'list' }, context);
    const issueComments = await createIssueReadTool().execute(
      { method: 'comments', issueNumber: 5 },
      context,
    );
    const issueCreate = await createIssueWriteTool().execute(
      { action: 'create', title: 'Yeni issue' },
      context,
    );
    const prGet = await createPullRequestReadTool().execute(
      { method: 'get', pullNumber: 7 },
      context,
    );
    const prList = await createPullRequestReadTool().execute({ method: 'list' }, context);
    const prComments = await createPullRequestReadTool().execute(
      { method: 'comments', pullNumber: 7 },
      context,
    );
    const prCreate = await createPullRequestWriteTool().execute(
      { action: 'create', title: 'Yeni PR', head: 'feat', base: 'main' },
      context,
    );
    const overview = await createRepositoryReadTool().execute({ method: 'overview' }, context);
    const releases = await createRepositoryReadTool().execute({ method: 'releases' }, context);
    const search = await createSearchGitHubTool().execute(
      { scope: 'issues', query: 'body' },
      context,
    );

    expect(issueGet.structuredContent).toMatchObject({ issue: { body: expected } });
    expect(issueList.structuredContent).toMatchObject({ items: [{ body: expected }] });
    expect(issueComments.structuredContent).toMatchObject({ items: [{ body: expected }] });
    expect(issueCreate.structuredContent).toMatchObject({ issue: { body: expected } });
    expect(prGet.structuredContent).toMatchObject({ pullRequest: { body: expected } });
    expect(prList.structuredContent).toMatchObject({ items: [{ body: expected }] });
    expect(prComments.structuredContent).toMatchObject({ items: [{ body: expected }] });
    expect(prCreate.structuredContent).toMatchObject({ pullRequest: { body: expected } });
    expect(overview.structuredContent).toMatchObject({ repository: { body: expected } });
    expect(releases.structuredContent).toMatchObject({ items: [{ body: expected }] });
    expect(search.structuredContent).toMatchObject({ items: [{ body: expected }] });
  });
});
