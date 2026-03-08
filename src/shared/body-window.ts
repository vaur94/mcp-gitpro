const bodyFieldKeys = new Set(['body', 'body_text', 'body_html']);

export function clampBodyFields(value: unknown, clampBody: (text: string) => string): unknown {
  return visit(value, clampBody, new WeakSet<object>());
}

function visit(
  value: unknown,
  clampBody: (text: string) => string,
  seen: WeakSet<object>,
): unknown {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => visit(item, clampBody, seen));
  }

  if (typeof value !== 'object') {
    return value;
  }

  if (seen.has(value)) {
    return value;
  }
  seen.add(value);

  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => {
      if (typeof entryValue === 'string' && bodyFieldKeys.has(key)) {
        return [key, clampBody(entryValue)];
      }

      return [key, visit(entryValue, clampBody, seen)];
    }),
  );
}
