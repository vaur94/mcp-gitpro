import { z } from 'zod';

import type { ToolDefinition } from '@vaur94/mcpbase';
import { createTextContent } from '@vaur94/mcpbase';

import { formatList } from '../../shared/formatting.js';
import type { GitProContext } from '../../context.js';
import type { GitProToolDefinition } from '../../core/tool-filtering.js';

export function createGitHubContextTool(): GitProToolDefinition {
  const inputSchema = z.object({});
  const outputSchema = z.object({
    authenticated: z.boolean(),
    defaultOwner: z.string().nullable(),
    defaultRepo: z.string().nullable(),
    readOnly: z.boolean(),
    toolsets: z.array(z.string()),
    tools: z.array(z.string()),
  });

  const tool: ToolDefinition<typeof inputSchema, typeof outputSchema, GitProContext> & {
    readonly toolset: 'context';
    readonly writeAccess: false;
    readonly name: 'github_context';
  } = {
    name: 'github_context',
    title: 'GitHub baglami',
    description: 'Kimlik, varsayilanlar ve etkin arac sinirlarini ozetler.',
    toolset: 'context',
    writeAccess: false,
    inputSchema,
    outputSchema,
    annotations: {
      title: 'GitHub baglami',
      readOnlyHint: true,
      idempotentHint: true,
    },
    async execute(_input, context) {
      const defaults = [context.config.defaults.owner, context.config.defaults.repo]
        .filter((value): value is string => Boolean(value))
        .join('/');

      const summary = [
        `GitHub token durumu: ${context.config.auth.githubToken ? 'hazir' : 'eksik'}.`,
        `Varsayilan depo: ${defaults || 'tanimli degil'}.`,
        `Salt-okunur kip: ${context.config.context.readOnly ? 'acik' : 'kapali'}.`,
        `Etkin arac setleri: ${formatList(context.config.context.toolsets)}.`,
        `Arac kisitlari: ${context.config.context.tools.length > 0 ? formatList(context.config.context.tools) : 'tum araclar'}.`,
      ].join(' ');

      return {
        content: [createTextContent(summary)],
        structuredContent: {
          authenticated: context.client.isAuthenticated(),
          defaultOwner: context.config.defaults.owner ?? null,
          defaultRepo: context.config.defaults.repo ?? null,
          readOnly: context.config.context.readOnly,
          toolsets: context.config.context.toolsets,
          tools: context.config.context.tools,
        },
      };
    },
  };

  return tool;
}
