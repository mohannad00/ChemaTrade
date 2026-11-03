export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

export function uniqueSlug(base: string, taken: ReadonlySet<string>): string {
  const root = slugify(base) || 'item';
  if (!taken.has(root)) return root;
  let n = 2;
  while (taken.has(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}

export function randomId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Demo reference such as DEMO-QT-20261103-A7K2. Clearly not a real tracking number. */
export function generateReference(kind: 'QT' | 'MT', existing: ReadonlySet<string>, now = new Date()): string {
  const date = now.toISOString().slice(0, 10).replaceAll('-', '');
  for (;;) {
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, 'X');
    const ref = `DEMO-${kind}-${date}-${suffix}`;
    if (!existing.has(ref)) return ref;
  }
}
