import { describe, expect, it } from 'vitest';

import { createGitProTools } from '../../src/tools/index.js';
import { createTestConfig } from '../fixtures/runtime-config.js';

describe('createGitProTools', () => {
  it('salt-okunur kipte yazma araclarini disarida birakir', () => {
    const tools = createGitProTools(
      createTestConfig({
        context: {
          readOnly: true,
        },
      }),
    );

    const names = tools.map((tool) => tool.name);
    expect(names).not.toContain('issue_write');
    expect(names).not.toContain('pull_request_write');
    expect(names).not.toContain('actions_write');
  });

  it('toolset allowlist ile filtre uygular', () => {
    const tools = createGitProTools(
      createTestConfig({
        context: {
          toolsets: ['context', 'repos'],
        },
      }),
    );

    const names = tools.map((tool) => tool.name);
    expect(names).toEqual(['github_context', 'repository_read', 'repository_compare']);
  });

  it('tam arac allowlist ile filtre uygular', () => {
    const tools = createGitProTools(
      createTestConfig({
        context: {
          tools: ['github_context', 'search_github'],
        },
      }),
    );

    const names = tools.map((tool) => tool.name);
    expect(names).toEqual(['github_context', 'search_github']);
  });
});
