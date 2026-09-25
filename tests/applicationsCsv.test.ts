// Run with: npm test   (Node >= 22.18 / 23.6, which run TypeScript natively via type stripping)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applicationsToCsv,
  CSV_COLUMNS,
  detectDelimiter,
  escapeCsvField,
  isValidIsoDate,
  parseApplicationsCsv,
  parseCsv,
  parseTags,
  planImport,
  type NewApplication,
} from '../src/lib/applicationsCsv.ts';

const TODAY = '2026-09-25';

const app = (overrides: Partial<NewApplication> = {}): NewApplication => ({
  companyName: 'Acme',
  roleDescription: 'Backend Engineer',
  jobDescription: 'Build APIs',
  applicationDate: '2026-09-10',
  salary: '50k-60k',
  workMode: 'ibrido',
  status: 'colloquio-tecnico',
  tags: ['backend', 'go'],
  ...overrides,
});

const header = CSV_COLUMNS.join(',');

test('escapeCsvField quotes only when needed (RFC 4180)', () => {
  assert.equal(escapeCsvField('plain'), 'plain');
  assert.equal(escapeCsvField('a,b'), '"a,b"');
  assert.equal(escapeCsvField('say "hi"'), '"say ""hi"""');
  assert.equal(escapeCsvField('line1\nline2'), '"line1\nline2"');
  assert.equal(escapeCsvField('a;b'), 'a;b');
  assert.equal(escapeCsvField('a;b', ';'), '"a;b"');
});

test('export: BOM, header, CRLF, tags joined with ;', () => {
  const csv = applicationsToCsv([app({ jobDescription: 'Multi\nline, with "quotes"' })]);
  assert.ok(csv.startsWith('﻿'));
  const lines = csv.slice(1).split('\r\n');
  assert.equal(lines[0], header);
  assert.equal(
    csv.slice(1),
    `${header}\r\nAcme,Backend Engineer,"Multi\nline, with ""quotes""",2026-09-10,50k-60k,ibrido,colloquio-tecnico,backend;go\r\n`,
  );
});

test('export then import round-trips', () => {
  const original = [
    app(),
    app({ companyName: 'Beta, Inc.', roleDescription: 'PM', tags: [], salary: 'ND', workMode: 'ND', status: 'in-corso' }),
    app({ companyName: 'Gamma', jobDescription: '  keeps\r\n  whitespace  ' }),
  ];
  const result = parseApplicationsCsv(applicationsToCsv(original), [], TODAY);
  assert.equal(result.fileError, undefined);
  assert.deepEqual(
    result.rows.map((r) => r.application),
    original,
  );
  assert.ok(result.rows.every((r) => r.errors.length === 0 && r.warnings.length === 0));
});

test('parseCsv handles LF, CRLF, quoted newlines, empty lines and reports line numbers', () => {
  const { rows, lineNumbers, unterminatedQuote } = parseCsv('a,b\n\n"x\ny",z\r\n1,2');
  assert.deepEqual(rows, [['a', 'b'], ['x\ny', 'z'], ['1', '2']]);
  assert.deepEqual(lineNumbers, [1, 3, 5]);
  assert.equal(unterminatedQuote, false);
  assert.equal(parseCsv('a,"b').unterminatedQuote, true);
});

test('detectDelimiter recognises semicolon files saved by Excel (Italian locale)', () => {
  assert.equal(detectDelimiter('company_name;role_description;tags\nA;B;"x;y"'), ';');
  assert.equal(detectDelimiter('company_name,role_description\n'), ',');
  assert.equal(detectDelimiter('company_name\trole_description\n'), '\t');
  const result = parseApplicationsCsv('company_name;role_description;tags\nAcme;Dev;"a;b"\n', [], TODAY);
  assert.deepEqual(result.rows[0].application.tags, ['a', 'b']);
});

test('import: column order is free, unknown columns ignored, header case-insensitive', () => {
  const csv = 'Status,user_id,ROLE_DESCRIPTION,company_name\nprimo-colloquio,xyz,Dev,Acme\n';
  const [row] = parseApplicationsCsv(csv, [], TODAY).rows;
  assert.equal(row.application.companyName, 'Acme');
  assert.equal(row.application.roleDescription, 'Dev');
  assert.equal(row.application.status, 'primo-colloquio');
  assert.equal(row.application.salary, 'ND');
  assert.equal(row.application.workMode, 'ND');
  assert.equal(row.application.applicationDate, TODAY);
  assert.deepEqual(row.warnings, [{ code: 'missingDate', value: TODAY }]);
});

test('import: file-level errors', () => {
  assert.equal(parseApplicationsCsv('', [], TODAY).fileError?.code, 'empty');
  assert.deepEqual(parseApplicationsCsv('company_name,salary\nA,1\n', [], TODAY).fileError, {
    code: 'missingColumns',
    columns: ['role_description'],
  });
  assert.equal(parseApplicationsCsv('company_name,role_description\n"A,B\n', [], TODAY).fileError?.code, 'unterminatedQuote');
});

test('import: row validation (required fields, date, enums)', () => {
  const csv = [
    header,
    ',Dev,,2026-01-01,,,,',
    'Acme,,,2026-01-01,,,,',
    'Acme,Dev,,01/02/2026,,,,',
    'Acme,Dev2,,2026-02-30,,,,',
    'Acme,Dev3,,2026-02-01,,smart,interview,',
    'Acme,Dev4,,2026-02-01,,Remoto,GHOSTING,',
  ].join('\n');
  const rows = parseApplicationsCsv(csv, [], TODAY).rows;
  assert.deepEqual(rows[0].errors, [{ code: 'missingCompany' }]);
  assert.deepEqual(rows[1].errors, [{ code: 'missingRole' }]);
  assert.deepEqual(rows[2].errors, [{ code: 'invalidDate', value: '01/02/2026' }]);
  assert.deepEqual(rows[3].errors, [{ code: 'invalidDate', value: '2026-02-30' }]);
  assert.deepEqual(rows[4].errors, []);
  assert.deepEqual(rows[4].warnings, [
    { code: 'invalidStatus', value: 'interview' },
    { code: 'invalidWorkMode', value: 'smart' },
  ]);
  assert.equal(rows[4].application.status, 'in-corso');
  assert.equal(rows[4].application.workMode, 'ND');
  assert.equal(rows[5].application.status, 'ghosting');
  assert.equal(rows[5].application.workMode, 'remoto');
  assert.deepEqual(rows.map((r) => r.line), [2, 3, 4, 5, 6, 7]);
});

test('import: duplicates against existing applications and within the file', () => {
  const existing = [{ companyName: 'Acme', roleDescription: 'Dev', applicationDate: '2026-01-01' }];
  const csv = [
    'company_name,role_description,application_date',
    ' acme , DEV ,2026-01-01',
    'Acme,Dev,2026-01-02',
    'Acme,Dev,2026-01-02',
  ].join('\n');
  const rows = parseApplicationsCsv(csv, existing, TODAY).rows;
  assert.deepEqual(rows[0].errors, [{ code: 'duplicateExisting' }]);
  assert.deepEqual(rows[1].errors, []);
  assert.deepEqual(rows[2].errors, [{ code: 'duplicateInFile' }]);
});

test('parseTags: ; separated, Postgres array literal, dedup, trims', () => {
  assert.deepEqual(parseTags(' a ; b ;; a '), ['a', 'b']);
  assert.deepEqual(parseTags('{backend,go,"remote first"}'), ['backend', 'go', 'remote first']);
  assert.deepEqual(parseTags(''), []);
});

test('isValidIsoDate', () => {
  assert.equal(isValidIsoDate('2024-02-29'), true);
  assert.equal(isValidIsoDate('2025-02-29'), false);
  assert.equal(isValidIsoDate('2025-13-01'), false);
  assert.equal(isValidIsoDate('2025-1-01'), false);
});

test('planImport respects the plan limit', () => {
  const csv = [header, 'A,1,,2026-01-01,,,,', 'B,2,,2026-01-01,,,,', 'C,3,,2026-01-01,,,,', ',x,,,,,,'].join('\n');
  const { rows } = parseApplicationsCsv(csv, [], TODAY);
  assert.deepEqual(
    { ...planImport(rows, 2), toInsert: planImport(rows, 2).toInsert.map((a) => a.companyName) },
    { toInsert: ['A', 'B'], skippedByLimit: 1, invalid: 1 },
  );
  assert.equal(planImport(rows, 0).toInsert.length, 0);
  assert.equal(planImport(rows, -3).skippedByLimit, 3);
  assert.equal(planImport(rows, null).toInsert.length, 3);
});
