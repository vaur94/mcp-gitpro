import { z } from 'zod';

import { AppError, createTextContent } from '@vaur94/mcpbase';

import type { GitProContext } from '../../context.js';
import type { GitProToolDefinition } from '../../core/tool-filtering.js';
import { formatRepositoryRef, resolveRepositoryRef } from '../../github/repository-ref.js';
import { clampBodyFields } from '../../shared/body-window.js';

export function createPullRequestWriteTool(): GitProToolDefinition {
  const inputSchema = z.object({
    owner: z.string().min(1).optional(),
    repo: z.string().min(1).optional(),
    action: z.enum(['create', 'update', 'comment', 'merge', 'update_branch']),
    pullNumber: z.number().int().positive().optional(),
    title: z.string().min(1).optional(),
    body: z.string().min(1).optional(),
    head: z.string().min(1).optional(),
    base: z.string().min(1).optional(),
    state: z.enum(['open', 'closed']).optional(),
    draft: z.boolean().optional(),
    maintainerCanModify: z.boolean().optional(),
    mergeMethod: z.enum(['merge', 'squash', 'rebase']).optional(),
  });

  return {
    name: 'pull_request_write',
    title: 'Pull request yazma',
    description: 'PR olusturur, gunceller, yorumlar, merge eder veya dali gunceller.',
    toolset: 'pull_requests',
    writeAccess: true,
    inputSchema,
    annotations: {
      title: 'Pull request yazma',
      readOnlyHint: false,
      destructiveHint: true,
    },
    async execute(input: z.infer<typeof inputSchema>, context: GitProContext) {
      context.client.assertWritable();
      const ref = resolveRepositoryRef(input, context.config);

      if (input.action === 'create') {
        const pullRequest = clampBodyFields(
          await context.client.sendJson<Record<string, unknown>>(
            'POST',
            `/repos/${ref.owner}/${ref.repo}/pulls`,
            {
              body: {
                title: input.title,
                body: input.body,
                head: input.head,
                base: input.base,
                draft: input.draft,
                maintainer_can_modify: input.maintainerCanModify,
              },
            },
          ),
          (value) => context.client.clampBody(value),
        ) as Record<string, unknown>;
        return {
          content: [
            createTextContent(`${formatRepositoryRef(ref)} deposunda yeni PR olusturuldu.`),
          ],
          structuredContent: { repository: ref, pullRequest },
        };
      }

      if (!input.pullNumber) {
        throw new AppError('VALIDATION_ERROR', 'pullNumber gerekli.');
      }

      if (input.action === 'comment') {
        const comment = clampBodyFields(
          await context.client.sendJson<Record<string, unknown>>(
            'POST',
            `/repos/${ref.owner}/${ref.repo}/issues/${input.pullNumber}/comments`,
            {
              body: { body: input.body },
            },
          ),
          (value) => context.client.clampBody(value),
        ) as Record<string, unknown>;
        return {
          content: [
            createTextContent(`${formatRepositoryRef(ref)} #${input.pullNumber} PR yorumlandi.`),
          ],
          structuredContent: { repository: ref, comment },
        };
      }

      if (input.action === 'merge') {
        const merge = await context.client.sendJson<Record<string, unknown>>(
          'PUT',
          `/repos/${ref.owner}/${ref.repo}/pulls/${input.pullNumber}/merge`,
          {
            body: {
              commit_title: input.title,
              commit_message: input.body,
              merge_method: input.mergeMethod,
            },
          },
        );
        return {
          content: [
            createTextContent(`${formatRepositoryRef(ref)} #${input.pullNumber} PR merge edildi.`),
          ],
          structuredContent: { repository: ref, merge },
        };
      }

      if (input.action === 'update_branch') {
        const result = await context.client.sendJson<Record<string, unknown>>(
          'PUT',
          `/repos/${ref.owner}/${ref.repo}/pulls/${input.pullNumber}/update-branch`,
        );
        return {
          content: [
            createTextContent(
              `${formatRepositoryRef(ref)} #${input.pullNumber} PR dali guncellendi.`,
            ),
          ],
          structuredContent: { repository: ref, result },
        };
      }

      const pullRequest = clampBodyFields(
        await context.client.sendJson<Record<string, unknown>>(
          'PATCH',
          `/repos/${ref.owner}/${ref.repo}/pulls/${input.pullNumber}`,
          {
            body: {
              title: input.title,
              body: input.body,
              state: input.state,
              base: input.base,
              maintainer_can_modify: input.maintainerCanModify,
            },
          },
        ),
        (value) => context.client.clampBody(value),
      ) as Record<string, unknown>;
      return {
        content: [
          createTextContent(`${formatRepositoryRef(ref)} #${input.pullNumber} PR guncellendi.`),
        ],
        structuredContent: { repository: ref, pullRequest },
      };
    },
  };
}
