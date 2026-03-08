import { z } from 'zod';

import { AppError, createTextContent } from '@vaur94/mcpbase';

import type { GitProContext } from '../../context.js';
import type { GitProToolDefinition } from '../../core/tool-filtering.js';
import { formatRepositoryRef, resolveRepositoryRef } from '../../github/repository-ref.js';
import { clampBodyFields } from '../../shared/body-window.js';
import { normalizePagination } from '../../shared/pagination.js';

export function createPullRequestReadTool(): GitProToolDefinition {
  const inputSchema = z.object({
    owner: z.string().min(1).optional(),
    repo: z.string().min(1).optional(),
    pullNumber: z.number().int().positive().optional(),
    method: z.enum(['get', 'list', 'files', 'diff', 'checks', 'reviews', 'comments']),
    state: z.enum(['open', 'closed', 'all']).optional(),
    base: z.string().min(1).optional(),
    head: z.string().min(1).optional(),
    sort: z.enum(['created', 'updated', 'popularity', 'long-running']).optional(),
    direction: z.enum(['asc', 'desc']).optional(),
    page: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).max(100).optional(),
  });

  return {
    name: 'pull_request_read',
    title: 'Pull request okuma',
    description: 'PR, diff, dosya, review ve yorum verisi alir.',
    toolset: 'pull_requests',
    writeAccess: false,
    inputSchema,
    annotations: {
      title: 'Pull request okuma',
      readOnlyHint: true,
      idempotentHint: true,
    },
    async execute(input: z.infer<typeof inputSchema>, context: GitProContext) {
      const ref = resolveRepositoryRef(input, context.config);
      const pageState = normalizePagination(input, context.config.output.pageSize);

      if (input.method === 'list') {
        const items = clampBodyFields(
          await context.client.getJson<Record<string, unknown>[]>(
            `/repos/${ref.owner}/${ref.repo}/pulls`,
            {
              query: {
                state: input.state,
                base: input.base,
                head: input.head,
                sort: input.sort,
                direction: input.direction,
                page: pageState.page,
                per_page: pageState.pageSize,
              },
            },
          ),
          (value) => context.client.clampBody(value),
        ) as Record<string, unknown>[];
        return {
          content: [
            createTextContent(`${formatRepositoryRef(ref)} icin ${items.length} PR listelendi.`),
          ],
          structuredContent: { repository: ref, items },
        };
      }

      if (!input.pullNumber) {
        throw new AppError('VALIDATION_ERROR', 'pullNumber gerekli.');
      }

      if (input.method === 'get') {
        const pullRequest = clampBodyFields(
          await context.client.getJson<Record<string, unknown>>(
            `/repos/${ref.owner}/${ref.repo}/pulls/${input.pullNumber}`,
          ),
          (value) => context.client.clampBody(value),
        ) as Record<string, unknown>;
        return {
          content: [
            createTextContent(`${formatRepositoryRef(ref)} #${input.pullNumber} PR verisi alindi.`),
          ],
          structuredContent: { repository: ref, pullRequest },
        };
      }

      if (input.method === 'diff') {
        const diff = await context.client.getText(
          `/repos/${ref.owner}/${ref.repo}/pulls/${input.pullNumber}`,
          {
            accept: 'application/vnd.github.v3.diff',
          },
        );
        const window = context.client.clampDiff(diff);
        return {
          content: [createTextContent(window.text)],
          structuredContent: {
            repository: ref,
            pullNumber: input.pullNumber,
            truncated: window.truncated,
            totalLines: window.totalLines,
            returnedLines: window.returnedLines,
          },
        };
      }

      if (input.method === 'checks') {
        const pullRequest = await context.client.getJson<{ head?: { sha?: string } }>(
          `/repos/${ref.owner}/${ref.repo}/pulls/${input.pullNumber}`,
        );
        const sha = pullRequest.head?.sha;
        if (!sha) {
          throw new AppError('TOOL_EXECUTION_ERROR', 'PR head SHA bulunamadi.');
        }
        const checks = clampBodyFields(
          await context.client.getJson<Record<string, unknown>>(
            `/repos/${ref.owner}/${ref.repo}/commits/${sha}/check-runs`,
          ),
          (value) => context.client.clampBody(value),
        ) as Record<string, unknown>;
        return {
          content: [
            createTextContent(
              `${formatRepositoryRef(ref)} #${input.pullNumber} check run verisi alindi.`,
            ),
          ],
          structuredContent: { repository: ref, pullNumber: input.pullNumber, checks },
        };
      }

      const path =
        input.method === 'files'
          ? `/repos/${ref.owner}/${ref.repo}/pulls/${input.pullNumber}/files`
          : input.method === 'reviews'
            ? `/repos/${ref.owner}/${ref.repo}/pulls/${input.pullNumber}/reviews`
            : `/repos/${ref.owner}/${ref.repo}/pulls/${input.pullNumber}/comments`;
      const items = clampBodyFields(
        await context.client.getJson<Record<string, unknown>[]>(path, {
          query: {
            page: pageState.page,
            per_page: pageState.pageSize,
          },
        }),
        (value) => context.client.clampBody(value),
      ) as Record<string, unknown>[];
      return {
        content: [
          createTextContent(
            `${formatRepositoryRef(ref)} #${input.pullNumber} icin ${input.method} verisi alindi.`,
          ),
        ],
        structuredContent: { repository: ref, pullNumber: input.pullNumber, items },
      };
    },
  };
}
