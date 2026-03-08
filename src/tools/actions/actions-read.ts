import { z } from 'zod';

import { AppError, createTextContent } from '@vaur94/mcpbase';

import type { GitProContext } from '../../context.js';
import type { GitProToolDefinition } from '../../core/tool-filtering.js';
import { formatRepositoryRef, resolveRepositoryRef } from '../../github/repository-ref.js';
import { normalizePagination } from '../../shared/pagination.js';

export function createActionsReadTool(): GitProToolDefinition {
  const inputSchema = z.object({
    owner: z.string().min(1).optional(),
    repo: z.string().min(1).optional(),
    method: z.enum(['workflows', 'runs', 'jobs', 'artifacts', 'logs_url', 'failed_summary']),
    workflowId: z.string().min(1).optional(),
    runId: z.number().int().positive().optional(),
    jobId: z.number().int().positive().optional(),
    branch: z.string().min(1).optional(),
    status: z.string().min(1).optional(),
    page: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).max(100).optional(),
  });

  return {
    name: 'actions_read',
    title: 'Actions okuma',
    description: 'Workflow, run, job, artifact ve log adresi verisi alir.',
    toolset: 'actions',
    writeAccess: false,
    inputSchema,
    annotations: {
      title: 'Actions okuma',
      readOnlyHint: true,
      idempotentHint: true,
    },
    async execute(input: z.infer<typeof inputSchema>, context: GitProContext) {
      const ref = resolveRepositoryRef(input, context.config);
      const pageState = normalizePagination(input, context.config.output.pageSize);

      if (input.method === 'workflows') {
        const workflows = await context.client.getJson<Record<string, unknown>>(
          `/repos/${ref.owner}/${ref.repo}/actions/workflows`,
          {
            query: {
              page: pageState.page,
              per_page: pageState.pageSize,
            },
          },
        );
        return {
          content: [createTextContent(`${formatRepositoryRef(ref)} workflow listesi alindi.`)],
          structuredContent: { repository: ref, workflows },
        };
      }

      if (input.method === 'runs') {
        const path = input.workflowId
          ? `/repos/${ref.owner}/${ref.repo}/actions/workflows/${input.workflowId}/runs`
          : `/repos/${ref.owner}/${ref.repo}/actions/runs`;
        const runs = await context.client.getJson<Record<string, unknown>>(path, {
          query: {
            branch: input.branch,
            status: input.status,
            page: pageState.page,
            per_page: pageState.pageSize,
          },
        });
        return {
          content: [createTextContent(`${formatRepositoryRef(ref)} workflow run verisi alindi.`)],
          structuredContent: { repository: ref, runs },
        };
      }

      if (!input.runId && input.method !== 'logs_url') {
        throw new AppError('VALIDATION_ERROR', 'runId gerekli.');
      }

      if (input.method === 'jobs') {
        const jobs = await context.client.getJson<Record<string, unknown>>(
          `/repos/${ref.owner}/${ref.repo}/actions/runs/${input.runId}/jobs`,
          {
            query: {
              page: pageState.page,
              per_page: pageState.pageSize,
            },
          },
        );
        return {
          content: [
            createTextContent(`${formatRepositoryRef(ref)} run #${input.runId} job verisi alindi.`),
          ],
          structuredContent: { repository: ref, jobs },
        };
      }

      if (input.method === 'artifacts') {
        const artifacts = await context.client.getJson<Record<string, unknown>>(
          `/repos/${ref.owner}/${ref.repo}/actions/runs/${input.runId}/artifacts`,
          {
            query: {
              page: pageState.page,
              per_page: pageState.pageSize,
            },
          },
        );
        return {
          content: [
            createTextContent(
              `${formatRepositoryRef(ref)} run #${input.runId} artifact verisi alindi.`,
            ),
          ],
          structuredContent: { repository: ref, artifacts },
        };
      }

      if (input.method === 'failed_summary') {
        const jobs = await context.client.getJson<{ jobs?: Array<Record<string, unknown>> }>(
          `/repos/${ref.owner}/${ref.repo}/actions/runs/${input.runId}/jobs`,
        );
        const failedJobs = (jobs.jobs ?? []).filter(
          (job: Record<string, unknown>) => job.conclusion === 'failure',
        );
        return {
          content: [
            createTextContent(
              `${formatRepositoryRef(ref)} run #${input.runId} icin ${failedJobs.length} basarisiz job bulundu.`,
            ),
          ],
          structuredContent: { repository: ref, runId: input.runId, failedJobs },
        };
      }

      if (!input.jobId) {
        throw new AppError('VALIDATION_ERROR', 'jobId gerekli.');
      }
      const downloadUrl = await context.client.getDownloadUrl(
        `/repos/${ref.owner}/${ref.repo}/actions/jobs/${input.jobId}/logs`,
      );
      return {
        content: [
          createTextContent(
            `${formatRepositoryRef(ref)} job #${input.jobId} log indirme adresi alindi.`,
          ),
        ],
        structuredContent: { repository: ref, jobId: input.jobId, downloadUrl },
      };
    },
  };
}
