import { createRuntimeConfigSchema } from '@vaur94/mcpbase';
import { z } from 'zod';

export const gitProToolsetNameSchema = z.enum([
  'context',
  'repos',
  'search',
  'issues',
  'pull_requests',
  'actions',
]);

export const gitProToolNameSchema = z.enum([
  'github_context',
  'repository_read',
  'repository_compare',
  'search_github',
  'issue_read',
  'issue_write',
  'pull_request_read',
  'pull_request_write',
  'actions_read',
  'actions_write',
]);

const authSchema = z.object({
  githubToken: z.string().min(1).optional(),
});

const defaultsSchema = z.object({
  owner: z.string().min(1).optional(),
  repo: z.string().min(1).optional(),
  apiBaseUrl: z.string().url(),
});

const contextSchema = z.object({
  readOnly: z.boolean(),
  toolsets: z.array(gitProToolsetNameSchema),
  tools: z.array(gitProToolNameSchema),
});

const outputSchema = z.object({
  pageSize: z.number().int().min(1).max(100),
  maxFileLines: z.number().int().min(1),
  maxDiffLines: z.number().int().min(1),
  maxBodyChars: z.number().int().min(1),
});

export const gitProConfigSchema = createRuntimeConfigSchema(
  z.object({
    auth: authSchema,
    defaults: defaultsSchema,
    context: contextSchema,
    output: outputSchema,
  }),
);

export type GitProConfig = z.infer<typeof gitProConfigSchema>;
export type GitProToolsetName = z.infer<typeof gitProToolsetNameSchema>;
export type GitProToolName = z.infer<typeof gitProToolNameSchema>;
