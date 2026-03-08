import { z } from 'zod';

import { createTextContent } from '@vaur94/mcpbase';

import type { GitProContext } from '../../context.js';
import type { GitProToolDefinition } from '../../core/tool-filtering.js';
import { formatRepositoryRef, resolveRepositoryRef } from '../../github/repository-ref.js';

export function createRepositoryCompareTool(): GitProToolDefinition {
  const inputSchema = z.object({
    owner: z.string().min(1).optional(),
    repo: z.string().min(1).optional(),
    base: z.string().min(1),
    head: z.string().min(1),
  });

  return {
    name: 'repository_compare',
    title: 'Depo karsilastirma',
    description: 'Iki ref arasindaki commit ve dosya farkini dondurur.',
    toolset: 'repos',
    writeAccess: false,
    inputSchema,
    annotations: {
      title: 'Depo karsilastirma',
      readOnlyHint: true,
      idempotentHint: true,
    },
    async execute(input: z.infer<typeof inputSchema>, context: GitProContext) {
      const ref = resolveRepositoryRef(input, context.config);
      const result = await context.client.getJson<{
        total_commits: number;
        files?: Array<Record<string, unknown>>;
        commits?: Array<Record<string, unknown>>;
        status?: string;
        html_url?: string;
      }>(`/repos/${ref.owner}/${ref.repo}/compare/${input.base}...${input.head}`);
      const files = (result.files ?? []).map((file: Record<string, unknown>) => ({
        filename: file.filename ?? null,
        status: file.status ?? null,
        additions: file.additions ?? null,
        deletions: file.deletions ?? null,
        changes: file.changes ?? null,
        patchPreview:
          typeof file.patch === 'string' ? context.client.clampDiff(file.patch).text : null,
      }));

      return {
        content: [
          createTextContent(
            `${formatRepositoryRef(ref)} deposunda ${input.base}...${input.head} araligi karsilastirildi. ${result.total_commits} commit ve ${files.length} dosya farki bulundu.`,
          ),
        ],
        structuredContent: {
          repository: ref,
          base: input.base,
          head: input.head,
          status: result.status ?? null,
          compareUrl: result.html_url ?? null,
          totalCommits: result.total_commits,
          commits: result.commits ?? [],
          files,
        },
      };
    },
  };
}
