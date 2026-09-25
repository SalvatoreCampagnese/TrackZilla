// Run with: npm test   (Node >= 22.18 / 23.6, which run TypeScript natively via type stripping)
// Every translation key used in the source must exist in every locale, and the
// locales must define the same set of keys.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = join(import.meta.dirname, '..');
const localesDir = join(root, 'src/i18n/locales');
const locales = Object.fromEntries(
  readdirSync(localesDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => [f.replace('.json', ''), JSON.parse(readFileSync(join(localesDir, f), 'utf8'))])
);

const lookup = (obj: unknown, key: string) =>
  key.split('.').reduce<unknown>((acc, part) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined), obj);

const flattenKeys = (obj: Record<string, unknown>, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v) ? flattenKeys(v as Record<string, unknown>, `${prefix}${k}.`) : [`${prefix}${k}`]
  );

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return sourceFiles(p);
    return /\.tsx?$/.test(f) ? [p] : [];
  });

test('every static t() key exists in all locales', () => {
  const missing: string[] = [];
  for (const file of sourceFiles(join(root, 'src'))) {
    const source = readFileSync(file, 'utf8');
    for (const [, key] of source.matchAll(/\bt\(\s*['"]([\w.-]+)['"]/g)) {
      for (const [lang, messages] of Object.entries(locales)) {
        if (lookup(messages, key) === undefined) missing.push(`${relative(root, file)}: ${key} (${lang})`);
      }
    }
  }
  assert.deepEqual(missing, []);
});

test('all locales define the same keys', () => {
  const [base, ...others] = Object.entries(locales);
  const baseKeys = flattenKeys(base[1]).sort();
  for (const [lang, messages] of others) {
    assert.deepEqual(flattenKeys(messages).sort(), baseKeys, `${lang} keys differ from ${base[0]}`);
  }
});
