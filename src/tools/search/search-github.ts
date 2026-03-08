import { z } from 'zod';

import { createTextContent } from '@vaur94/mcpbase';

import type { GitProContext } from '../../context.js';
import type { GitProToolDefinition } from '../../core/tool-filtering.js';
import { clampBodyFields } from '../../shared/body-window.js';
import { normalizePagination } from '../../shared/pagination.js';

export function createSearchGitHubTool(): GitProToolDefinition {
  const inputSchema = z.object({
    query: z.string().min(1),
    scope: z.enum(['code', 'issues', 'pull_requests', 'repositories', 'users']),
    owner: z.string().min(1).optional(),
    repo: z.string().min(1).optional(),
    page: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).max(100).optional(),
  });

  return {
    name: 'search_github',
    title: 'GitHub arama',
    description: 'Kod, issue, PR, depo veya kullanici aramasi yapar.',
    toolset: 'search',
    writeAccess: false,
    inputSchema,
    annotations: {
      title: 'GitHub arama',
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
    async execute(input: z.infer<typeof inputSchema>, context: GitProContext) {
      const pageState = normalizePagination(input, context.config.output.pageSize);
      const path =
        input.scope === 'code'
          ? '/search/code'
          : input.scope === 'issues' || input.scope === 'pull_requests'
            ? '/search/issues'
            : input.scope === 'repositories'
              ? '/search/repositories'
              : '/search/users';
      const scopedQuery =
        input.owner && input.repo && input.scope !== 'repositories' && input.scope !== 'users'
          ? `${input.query} repo:${input.owner}/${input.repo}`
          : input.query;
      const finalQuery =
        input.scope === 'pull_requests'
          ? `${scopedQuery} type:pr`
          : input.scope === 'issues'
            ? `${scopedQuery} type:issue`
            : scopedQuery;
      const result = await context.client.getJson<{
        total_count: number;
        incomplete_results?: boolean;
        items: Array<Record<string, unknown>>;
      }>(path, {
        query: {
          q: finalQuery,
          page: pageState.page,
          per_page: pageState.pageSize,
        },
      });
      const items = clampBodyFields(result.items, (value) =>
        context.client.clampBody(value),
      ) as Array<Record<string, unknown>>;

      return {
        content: [
          createTextContent(
            `${input.scope} aramasinda ${items.length} sonuc donduruldu. Toplam eslesme: ${result.total_count}.`,
          ),
        ],
        structuredContent: {
          scope: input.scope,
          query: finalQuery,
          totalCount: result.total_count,
          incompleteResults: result.incomplete_results ?? false,
          items,
          pagination: {
            page: pageState.page,
            pageSize: pageState.pageSize,
            hasMore: items.length >= pageState.pageSize,
            nextPage: items.length >= pageState.pageSize ? pageState.page + 1 : null,
          },
        },
      };
    },
  };
}
