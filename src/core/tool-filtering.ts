import type { ToolDefinition, ToolInputSchema, ToolOutputSchema } from '@vaur94/mcpbase';

import type { GitProConfig, GitProToolName, GitProToolsetName } from '../config/schema.js';
import type { GitProContext } from '../context.js';

export interface GitProToolDefinition extends ToolDefinition<
  ToolInputSchema,
  ToolOutputSchema | undefined,
  GitProContext
> {
  readonly name: GitProToolName;
  readonly toolset: GitProToolsetName;
  readonly writeAccess: boolean;
}

export function filterTools(
  tools: readonly GitProToolDefinition[],
  config: GitProConfig,
): GitProToolDefinition[] {
  const allowedToolsets = new Set(config.context.toolsets);
  const allowedTools = new Set(config.context.tools);

  return tools.filter((tool) => {
    if (!allowedToolsets.has(tool.toolset)) {
      return false;
    }

    if (config.context.readOnly && tool.writeAccess) {
      return false;
    }

    if (allowedTools.size > 0 && !allowedTools.has(tool.name)) {
      return false;
    }

    return true;
  });
}
