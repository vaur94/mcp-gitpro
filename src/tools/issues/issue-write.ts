import { z } from 'zod';

import { AppError, createTextContent } from '@vaur94/mcpbase';

import type { GitProContext } from '../../context.js';
import type { GitProToolDefinition } from '../../core/tool-filtering.js';
import { formatRepositoryRef, resolveRepositoryRef } from '../../github/repository-ref.js';
import { clampBodyFields } from '../../shared/body-window.js';

export function createIssueWriteTool(): GitProToolDefinition {
  const inputSchema = z.object({
    owner: z.string().min(1).optional(),
    repo: z.string().min(1).optional(),
    action: z.enum(['create', 'update', 'comment']),
    issueNumber: z.number().int().positive().optional(),
    title: z.string().min(1).optional(),
    body: z.string().min(1).optional(),
    state: z.enum(['open', 'closed']).optional(),
    labels: z.array(z.string().min(1)).optional(),
    assignees: z.array(z.string().min(1)).optional(),
  });

  return {
    name: 'issue_write',
    title: 'Issue yazma',
    description: 'Issue olusturur, gunceller veya yorum ekler.',
    toolset: 'issues',
    writeAccess: true,
    inputSchema,
    annotations: {
      title: 'Issue yazma',
      readOnlyHint: false,
      destructiveHint: true,
    },
    async execute(input: z.infer<typeof inputSchema>, context: GitProContext) {
      context.client.assertWritable();
      const ref = resolveRepositoryRef(input, context.config);

      if (input.action === 'create') {
        const issue = clampBodyFields(
          await context.client.sendJson<Record<string, unknown>>(
            'POST',
            `/repos/${ref.owner}/${ref.repo}/issues`,
            {
              body: {
                title: input.title,
                body: input.body,
                labels: input.labels,
                assignees: input.assignees,
              },
            },
          ),
          (value) => context.client.clampBody(value),
        ) as Record<string, unknown>;
        return {
          content: [
            createTextContent(`${formatRepositoryRef(ref)} deposunda yeni issue olusturuldu.`),
          ],
          structuredContent: { repository: ref, issue },
        };
      }

      if (!input.issueNumber) {
        throw new AppError('VALIDATION_ERROR', 'issueNumber gerekli.');
      }

      if (input.action === 'comment') {
        const comment = clampBodyFields(
          await context.client.sendJson<Record<string, unknown>>(
            'POST',
            `/repos/${ref.owner}/${ref.repo}/issues/${input.issueNumber}/comments`,
            {
              body: { body: input.body },
            },
          ),
          (value) => context.client.clampBody(value),
        ) as Record<string, unknown>;
        return {
          content: [
            createTextContent(
              `${formatRepositoryRef(ref)} #${input.issueNumber} issue yorumlandi.`,
            ),
          ],
          structuredContent: { repository: ref, comment },
        };
      }

      const issue = clampBodyFields(
        await context.client.sendJson<Record<string, unknown>>(
          'PATCH',
          `/repos/${ref.owner}/${ref.repo}/issues/${input.issueNumber}`,
          {
            body: {
              title: input.title,
              body: input.body,
              state: input.state,
              labels: input.labels,
              assignees: input.assignees,
            },
          },
        ),
        (value) => context.client.clampBody(value),
      ) as Record<string, unknown>;
      return {
        content: [
          createTextContent(`${formatRepositoryRef(ref)} #${input.issueNumber} issue guncellendi.`),
        ],
        structuredContent: { repository: ref, issue },
      };
    },
  };
}
