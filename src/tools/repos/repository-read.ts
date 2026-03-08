import { z } from 'zod';

import { AppError, createTextContent } from '@vaur94/mcpbase';

import { formatRepositoryRef, resolveRepositoryRef } from '../../github/repository-ref.js';
import type { GitProContext } from '../../context.js';
import type { GitProToolDefinition } from '../../core/tool-filtering.js';
import { clampBodyFields } from '../../shared/body-window.js';
import { normalizePagination } from '../../shared/pagination.js';

export function createRepositoryReadTool(): GitProToolDefinition {
  const inputSchema = z.object({
    method: z.enum([
      'overview',
      'branches',
      'commits',
      'tags',
      'releases',
      'labels',
      'file',
      'directory',
    ]),
    owner: z.string().min(1).optional(),
    repo: z.string().min(1).optional(),
    path: z.string().min(1).optional(),
    ref: z.string().min(1).optional(),
    page: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).max(100).optional(),
  });

  return {
    name: 'repository_read',
    title: 'Depo okuma',
    description: 'Depo ozeti, refler, etiketler, release verisi ve icerik okur.',
    toolset: 'repos',
    writeAccess: false,
    inputSchema,
    annotations: {
      title: 'Depo okuma',
      readOnlyHint: true,
      idempotentHint: true,
    },
    async execute(input: z.infer<typeof inputSchema>, context: GitProContext) {
      const ref = resolveRepositoryRef(input, context.config);
      const pageState = normalizePagination(input, context.config.output.pageSize);

      if (input.method === 'overview') {
        const repository = clampBodyFields(
          await context.client.getJson<Record<string, unknown>>(`/repos/${ref.owner}/${ref.repo}`),
          (value) => context.client.clampBody(value),
        ) as Record<string, unknown>;
        return {
          content: [
            createTextContent(
              `${formatRepositoryRef(ref)} deposunun ozeti alindi. Varsayilan dal: ${String(repository.default_branch ?? 'bilinmiyor')}.`,
            ),
          ],
          structuredContent: { repository },
        };
      }

      if (
        input.method === 'branches' ||
        input.method === 'commits' ||
        input.method === 'tags' ||
        input.method === 'releases' ||
        input.method === 'labels'
      ) {
        const path =
          input.method === 'branches'
            ? `/repos/${ref.owner}/${ref.repo}/branches`
            : input.method === 'commits'
              ? `/repos/${ref.owner}/${ref.repo}/commits`
              : input.method === 'tags'
                ? `/repos/${ref.owner}/${ref.repo}/tags`
                : input.method === 'releases'
                  ? `/repos/${ref.owner}/${ref.repo}/releases`
                  : `/repos/${ref.owner}/${ref.repo}/labels`;
        const items = clampBodyFields(
          await context.client.getJson<Record<string, unknown>[]>(path, {
            query: {
              page: pageState.page,
              per_page: pageState.pageSize,
              ...(input.ref ? { sha: input.ref } : {}),
            },
          }),
          (value) => context.client.clampBody(value),
        ) as Record<string, unknown>[];
        return {
          content: [
            createTextContent(
              `${formatRepositoryRef(ref)} icin ${input.method} listesi alindi (${items.length} kayit).`,
            ),
          ],
          structuredContent: {
            method: input.method,
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

      if (input.method === 'file') {
        if (!input.path) {
          throw new AppError('VALIDATION_ERROR', 'path gerekli.');
        }
        const file = await context.client.getJson<Record<string, unknown>>(
          `/repos/${ref.owner}/${ref.repo}/contents/${input.path}`,
          {
            query: { ref: input.ref },
          },
        );
        const decoded =
          typeof file.content === 'string' ? context.client.decodeContent(file.content) : '';
        const window = context.client.clampFile(decoded);
        return {
          content: [createTextContent(window.text)],
          structuredContent: {
            repository: ref,
            path: input.path,
            ref: input.ref ?? null,
            type: file.type ?? 'file',
            size: file.size ?? null,
            sha: file.sha ?? null,
            truncated: window.truncated,
            totalLines: window.totalLines,
            returnedLines: window.returnedLines,
          },
        };
      }

      if (input.method === 'directory') {
        if (!input.path) {
          throw new AppError('VALIDATION_ERROR', 'path gerekli.');
        }
        const entries = clampBodyFields(
          await context.client.getJson<Record<string, unknown>[]>(
            `/repos/${ref.owner}/${ref.repo}/contents/${input.path}`,
            {
              query: { ref: input.ref },
            },
          ),
          (value) => context.client.clampBody(value),
        ) as Record<string, unknown>[];
        return {
          content: [
            createTextContent(
              `${formatRepositoryRef(ref)} icin ${input.path} klasorunde ${entries.length} oge bulundu.`,
            ),
          ],
          structuredContent: {
            repository: ref,
            path: input.path,
            ref: input.ref ?? null,
            entries,
          },
        };
      }

      throw new AppError('VALIDATION_ERROR', 'Desteklenmeyen repository_read metodu.');
    },
  };
}
