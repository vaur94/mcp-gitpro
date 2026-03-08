import { z } from 'zod';

import { AppError, createTextContent } from '@vaur94/mcpbase';

import type { GitProContext } from '../../context.js';
import type { GitProToolDefinition } from '../../core/tool-filtering.js';
import { formatRepositoryRef, resolveRepositoryRef } from '../../github/repository-ref.js';

export function createActionsWriteTool(): GitProToolDefinition {
  const inputSchema = z.object({
    owner: z.string().min(1).optional(),
    repo: z.string().min(1).optional(),
    action: z.enum(['dispatch', 'rerun', 'cancel']),
    workflowId: z.string().min(1).optional(),
    ref: z.string().min(1).optional(),
    inputs: z.record(z.string(), z.string()).optional(),
    runId: z.number().int().positive().optional(),
  });

  return {
    name: 'actions_write',
    title: 'Actions yazma',
    description: 'Workflow tetikler veya workflow run istekleri gonderir.',
    toolset: 'actions',
    writeAccess: true,
    inputSchema,
    annotations: {
      title: 'Actions yazma',
      readOnlyHint: false,
      destructiveHint: true,
    },
    async execute(input: z.infer<typeof inputSchema>, context: GitProContext) {
      context.client.assertWritable();
      const ref = resolveRepositoryRef(input, context.config);

      if (input.action === 'dispatch') {
        if (!input.workflowId || !input.ref) {
          throw new AppError('VALIDATION_ERROR', 'workflowId ve ref gerekli.');
        }
        await context.client.sendJson<Record<string, unknown>>(
          'POST',
          `/repos/${ref.owner}/${ref.repo}/actions/workflows/${input.workflowId}/dispatches`,
          {
            body: {
              ref: input.ref,
              inputs: input.inputs,
            },
          },
        );
        return {
          content: [createTextContent(`${formatRepositoryRef(ref)} icin workflow tetiklendi.`)],
          structuredContent: { repository: ref, workflowId: input.workflowId, refName: input.ref },
        };
      }

      if (!input.runId) {
        throw new AppError('VALIDATION_ERROR', 'runId gerekli.');
      }

      const path =
        input.action === 'rerun'
          ? `/repos/${ref.owner}/${ref.repo}/actions/runs/${input.runId}/rerun`
          : `/repos/${ref.owner}/${ref.repo}/actions/runs/${input.runId}/cancel`;
      await context.client.sendJson<Record<string, unknown>>('POST', path);
      return {
        content: [
          createTextContent(
            `${formatRepositoryRef(ref)} run #${input.runId} icin ${input.action === 'rerun' ? 'yeniden calistirma' : 'iptal'} istegi gonderildi.`,
          ),
        ],
        structuredContent: { repository: ref, runId: input.runId, action: input.action },
      };
    },
  };
}
