import { z } from 'zod';

import { AppError, createTextContent } from '@vaur94/mcpbase';

import type { GitProContext } from '../../context.js';
import type { GitProToolDefinition } from '../../core/tool-filtering.js';
import { formatRepositoryRef, resolveRepositoryRef } from '../../github/repository-ref.js';
import { clampBodyFields } from '../../shared/body-window.js';
import { normalizePagination } from '../../shared/pagination.js';

export function createIssueReadTool(): GitProToolDefinition {
  const inputSchema = z.object({
    owner: z.string().min(1).optional(),
    repo: z.string().min(1).optional(),
    issueNumber: z.number().int().positive().optional(),
    method: z.enum(['get', 'list', 'comments', 'labels']),
    state: z.enum(['open', 'closed', 'all']).optional(),
    labels: z.array(z.string().min(1)).optional(),
    sort: z.enum(['created', 'updated', 'comments']).optional(),
    direction: z.enum(['asc', 'desc']).optional(),
    page: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).max(100).optional(),
  });

  return {
    name: 'issue_read',
    title: 'Issue okuma',
    description: 'Issue, issue yorum ve issue etiket verisi alir.',
    toolset: 'issues',
    writeAccess: false,
    inputSchema,
    annotations: {
      title: 'Issue okuma',
      readOnlyHint: true,
      idempotentHint: true,
    },
    async execute(input: z.infer<typeof inputSchema>, context: GitProContext) {
      const ref = resolveRepositoryRef(input, context.config);
      const pageState = normalizePagination(input, context.config.output.pageSize);

      if (input.method === 'get') {
        if (!input.issueNumber) {
          throw new AppError('VALIDATION_ERROR', 'issueNumber gerekli.');
        }
        const issue = clampBodyFields(
          await context.client.getJson<Record<string, unknown>>(
            `/repos/${ref.owner}/${ref.repo}/issues/${input.issueNumber}`,
          ),
          (value) => context.client.clampBody(value),
        ) as Record<string, unknown>;
        return {
          content: [
            createTextContent(
              `${formatRepositoryRef(ref)} #${input.issueNumber} issue verisi alindi.`,
            ),
          ],
          structuredContent: { repository: ref, issue },
        };
      }

      if (input.method === 'list') {
        const items = clampBodyFields(
          await context.client.getJson<Record<string, unknown>[]>(
            `/repos/${ref.owner}/${ref.repo}/issues`,
            {
              query: {
                state: input.state,
                labels: input.labels?.join(','),
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
            createTextContent(`${formatRepositoryRef(ref)} icin ${items.length} issue listelendi.`),
          ],
          structuredContent: {
            repository: ref,
            items,
            pagination: {
              page: pageState.page,
              pageSize: pageState.pageSize,
              hasMore: items.length >= pageState.pageSize,
              nextPage: items.length >= pageState.pageSize ? pageState.page + 1 : null,
            },
          },
        };
      }

      if (!input.issueNumber) {
        throw new AppError('VALIDATION_ERROR', 'issueNumber gerekli.');
      }

      const path =
        input.method === 'comments'
          ? `/repos/${ref.owner}/${ref.repo}/issues/${input.issueNumber}/comments`
          : `/repos/${ref.owner}/${ref.repo}/issues/${input.issueNumber}/labels`;
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
            `${formatRepositoryRef(ref)} #${input.issueNumber} icin ${input.method} verisi alindi.`,
          ),
        ],
        structuredContent: {
          repository: ref,
          issueNumber: input.issueNumber,
          method: input.method,
          items,
        },
      };
    },
  };
}
