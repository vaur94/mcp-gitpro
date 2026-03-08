import { AppError } from '@vaur94/mcpbase';

import type { GitProConfig } from '../config/schema.js';

export interface RepositoryRefInput {
  readonly owner?: string;
  readonly repo?: string;
}

export interface RepositoryRef {
  readonly owner: string;
  readonly repo: string;
}

export function resolveRepositoryRef(
  input: RepositoryRefInput,
  config: GitProConfig,
): RepositoryRef {
  const owner = input.owner ?? config.defaults.owner;
  const repo = input.repo ?? config.defaults.repo;

  if (!owner || !repo) {
    throw new AppError('CONFIG_ERROR', 'Depo sahibi ve depo adi birlikte gerekli.');
  }

  return { owner, repo };
}

export function formatRepositoryRef(ref: RepositoryRef): string {
  return `${ref.owner}/${ref.repo}`;
}
