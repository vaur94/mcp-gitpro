export function formatList(values: readonly string[]): string {
  if (values.length === 0) {
    return 'bos';
  }

  return values.join(', ');
}

export function truncateText(value: string, maxChars: number): string {
  const safe = sanitizeText(value);
  if (safe.length <= maxChars) {
    return safe;
  }

  if (maxChars <= 16) {
    return safe.slice(0, maxChars);
  }

  return `${safe.slice(0, maxChars - 16)}\n...[truncated]`;
}

export function truncateLines(
  value: string,
  maxLines: number,
): {
  readonly text: string;
  readonly truncated: boolean;
  readonly totalLines: number;
  readonly returnedLines: number;
} {
  const safe = sanitizeText(value);
  const lines = safe.split('\n');
  if (lines.length <= maxLines) {
    return {
      text: safe,
      truncated: false,
      totalLines: lines.length,
      returnedLines: lines.length,
    };
  }

  return {
    text: `${lines.slice(0, maxLines).join('\n')}\n...[truncated]`,
    truncated: true,
    totalLines: lines.length,
    returnedLines: maxLines,
  };
}

export function sanitizeText(value: string): string {
  const withoutControls = [...value]
    .filter((character) => {
      const code = character.charCodeAt(0);
      return code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127);
    })
    .join('');

  return withoutControls
    .replace(/<\/?(?:system|assistant|user)>/giu, '[filtered]')
    .replace(/(^|\n)\s*(?:system|assistant|developer)\s*:/giu, '$1[filtered]:')
    .replace(/ignore\s+previous\s+instructions/giu, '[filtered]');
}
