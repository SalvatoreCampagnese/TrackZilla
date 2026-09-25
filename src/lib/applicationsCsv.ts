// CSV import/export for job applications.
//
// Pure module: no React, no Supabase, no runtime imports, so it can be unit-tested
// with plain `node --test` (see tests/applicationsCsv.test.ts).
//
// Format (the export format is also the import format):
// - UTF-8, with a BOM on export so Excel detects the encoding
// - RFC 4180: CRLF line endings, fields quoted when they contain the delimiter,
//   a double quote or a line break; quotes escaped by doubling them
// - header row with the database column names (see CSV_COLUMNS)
// - tags joined with ";"
// On import the delimiter is auto-detected (",", ";" as saved by Excel with an
// Italian locale, or tab), columns can be in any order, unknown columns are ignored.

import type { JobApplication, JobStatus } from '@/types/job';

export const CSV_COLUMNS = [
  'company_name',
  'role_description',
  'job_description',
  'application_date',
  'salary',
  'work_mode',
  'status',
  'tags',
] as const;

export type CsvColumn = (typeof CSV_COLUMNS)[number];

export const TAG_SEPARATOR = ';';

// Record<JobStatus, true> makes the compiler fail if a status is added to JobStatus and not here.
const STATUS_VALUES: Record<JobStatus, true> = {
  'in-corso': true,
  'ghosting': true,
  'primo-colloquio': true,
  'secondo-colloquio': true,
  'colloquio-tecnico': true,
  'colloquio-finale': true,
  'offerta-ricevuta': true,
  'rifiutato': true,
  'ritirato': true,
};

const WORK_MODE_VALUES: Record<JobApplication['workMode'], true> = {
  'remoto': true,
  'ibrido': true,
  'in-presenza': true,
  'ND': true,
};

export const DEFAULT_STATUS: JobStatus = 'in-corso';
export const DEFAULT_WORK_MODE: JobApplication['workMode'] = 'ND';
export const DEFAULT_SALARY = 'ND';

export type NewApplication = Omit<JobApplication, 'id' | 'createdAt'>;

/* ------------------------------------------------------------------ */
/* Low-level CSV                                                        */
/* ------------------------------------------------------------------ */

export const escapeCsvField = (value: string, delimiter = ','): string => {
  const needsQuotes =
    value.includes(delimiter) || value.includes('"') || value.includes('\n') || value.includes('\r');
  return needsQuotes ? `"${value.replace(/"/g, '""')}"` : value;
};

export const serializeCsv = (rows: string[][], delimiter = ','): string =>
  rows.map((row) => row.map((field) => escapeCsvField(field, delimiter)).join(delimiter)).join('\r\n') + '\r\n';

/** Picks the delimiter that appears most often in the first line, ignoring quoted text. */
export const detectDelimiter = (text: string): string => {
  const counts: Record<string, number> = { ',': 0, ';': 0, '\t': 0 };
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') inQuotes = !inQuotes;
    else if (!inQuotes && (ch === '\n' || ch === '\r')) break;
    else if (!inQuotes && ch in counts) counts[ch]++;
  }
  let best = ',';
  for (const d of [';', '\t']) if (counts[d] > counts[best]) best = d;
  return best;
};

export interface ParsedCsv {
  rows: string[][];
  /** 1-based physical line on which each row starts (quoted fields may span lines). */
  lineNumbers: number[];
  /** True if the file ended inside a quoted field. */
  unterminatedQuote: boolean;
}

/** RFC 4180 parser. Accepts CRLF, LF or CR line endings and strips a leading BOM. */
export const parseCsv = (input: string, delimiter?: string): ParsedCsv => {
  const text = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;
  const delim = delimiter ?? detectDelimiter(text);
  const rows: string[][] = [];
  const lineNumbers: number[] = [];

  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let line = 1;
  let rowStartLine = 1;
  let rowHasContent = false;

  const endField = () => {
    row.push(field);
    field = '';
  };
  const endRow = () => {
    endField();
    // Skip completely empty lines.
    if (rowHasContent || row.length > 1 || row[0] !== '') {
      rows.push(row);
      lineNumbers.push(rowStartLine);
    }
    row = [];
    rowHasContent = false;
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        if (ch === '\n' || (ch === '\r' && text[i + 1] !== '\n')) line++;
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      rowHasContent = true;
    } else if (ch === delim) {
      endField();
    } else if (ch === '\r' || ch === '\n') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      endRow();
      line++;
      rowStartLine = line;
    } else {
      field += ch;
    }
  }
  if (field !== '' || row.length > 0 || rowHasContent) endRow();

  return { rows, lineNumbers, unterminatedQuote: inQuotes };
};

/* ------------------------------------------------------------------ */
/* Export                                                               */
/* ------------------------------------------------------------------ */

export const applicationsToCsv = (applications: NewApplication[]): string => {
  const rows: string[][] = [
    [...CSV_COLUMNS],
    ...applications.map((app) => [
      app.companyName ?? '',
      app.roleDescription ?? '',
      app.jobDescription ?? '',
      app.applicationDate ?? '',
      app.salary ?? '',
      app.workMode ?? '',
      app.status ?? '',
      (app.tags ?? []).join(TAG_SEPARATOR),
    ]),
  ];
  return '﻿' + serializeCsv(rows);
};

export const exportFileName = (today: string): string => `trackzilla-applications-${today}.csv`;

/* ------------------------------------------------------------------ */
/* Import                                                               */
/* ------------------------------------------------------------------ */

export type CsvIssueCode =
  | 'missingCompany'
  | 'missingRole'
  | 'invalidDate'
  | 'missingDate'
  | 'invalidStatus'
  | 'invalidWorkMode'
  | 'duplicateExisting'
  | 'duplicateInFile';

export interface CsvIssue {
  code: CsvIssueCode;
  value?: string;
}

export interface CsvImportRow {
  /** 1-based line number in the file. */
  line: number;
  /** Normalised application, ready to insert (only meaningful when `errors` is empty). */
  application: NewApplication;
  /** Row will not be imported. */
  errors: CsvIssue[];
  /** Row will be imported with a default value. */
  warnings: CsvIssue[];
}

export type CsvFileErrorCode = 'empty' | 'missingColumns' | 'unterminatedQuote';

export interface CsvImportResult {
  fileError?: { code: CsvFileErrorCode; columns?: string[] };
  rows: CsvImportRow[];
}

export const isValidIsoDate = (value: string): boolean => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
};

/** Splits the tags cell. Accepts "a;b", and also the Postgres array literal "{a,b}". */
export const parseTags = (value: string): string[] => {
  const trimmed = value.trim();
  if (!trimmed) return [];
  const pgArray = /^\{(.*)\}$/s.exec(trimmed);
  const parts = pgArray
    ? pgArray[1].split(',').map((t) => t.replace(/^"(.*)"$/s, '$1'))
    : trimmed.split(TAG_SEPARATOR);
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const part of parts) {
    const tag = part.trim();
    if (tag && !seen.has(tag)) {
      seen.add(tag);
      tags.push(tag);
    }
  }
  return tags;
};

const norm = (value: string | undefined | null): string => (value ?? '').trim().toLowerCase();

/** Key used to detect duplicates: company + role + application date, case-insensitive. */
export const duplicateKey = (app: Pick<NewApplication, 'companyName' | 'roleDescription' | 'applicationDate'>): string =>
  [norm(app.companyName), norm(app.roleDescription), norm(app.applicationDate)].join('\u0000');

export const REQUIRED_COLUMNS: CsvColumn[] = ['company_name', 'role_description'];

/**
 * Parses and validates an applications CSV.
 * @param text     file contents
 * @param existing the user's current (non-deleted) applications, for duplicate detection
 * @param today    YYYY-MM-DD used when application_date is empty
 */
export const parseApplicationsCsv = (
  text: string,
  existing: Pick<NewApplication, 'companyName' | 'roleDescription' | 'applicationDate'>[],
  today: string,
): CsvImportResult => {
  const parsed = parseCsv(text);
  if (parsed.unterminatedQuote) return { fileError: { code: 'unterminatedQuote' }, rows: [] };
  if (parsed.rows.length === 0) return { fileError: { code: 'empty' }, rows: [] };

  const header = parsed.rows[0].map((h) => h.trim().toLowerCase());
  const index: Partial<Record<CsvColumn, number>> = {};
  CSV_COLUMNS.forEach((col) => {
    const i = header.indexOf(col);
    if (i !== -1) index[col] = i;
  });
  const missing = REQUIRED_COLUMNS.filter((col) => index[col] === undefined);
  if (missing.length > 0) return { fileError: { code: 'missingColumns', columns: missing }, rows: [] };

  const existingKeys = new Set(existing.map(duplicateKey));
  const fileKeys = new Set<string>();
  const rows: CsvImportRow[] = [];

  for (let r = 1; r < parsed.rows.length; r++) {
    const cells = parsed.rows[r];
    const get = (col: CsvColumn): string => {
      const i = index[col];
      return i === undefined ? '' : (cells[i] ?? '').trim();
    };
    if (cells.every((c) => c.trim() === '')) continue;

    const errors: CsvIssue[] = [];
    const warnings: CsvIssue[] = [];

    const companyName = get('company_name');
    const roleDescription = get('role_description');
    if (!companyName) errors.push({ code: 'missingCompany' });
    if (!roleDescription) errors.push({ code: 'missingRole' });

    let applicationDate = get('application_date');
    if (!applicationDate) {
      applicationDate = today;
      warnings.push({ code: 'missingDate', value: today });
    } else if (!isValidIsoDate(applicationDate)) {
      errors.push({ code: 'invalidDate', value: applicationDate });
    }

    const rawStatus = get('status');
    let status: JobStatus = DEFAULT_STATUS;
    if (rawStatus) {
      const candidate = rawStatus.toLowerCase();
      if (candidate in STATUS_VALUES) status = candidate as JobStatus;
      else warnings.push({ code: 'invalidStatus', value: rawStatus });
    }

    const rawWorkMode = get('work_mode');
    let workMode: JobApplication['workMode'] = DEFAULT_WORK_MODE;
    if (rawWorkMode) {
      const candidate = rawWorkMode.toLowerCase() === 'nd' ? 'ND' : rawWorkMode.toLowerCase();
      if (candidate in WORK_MODE_VALUES) workMode = candidate as JobApplication['workMode'];
      else warnings.push({ code: 'invalidWorkMode', value: rawWorkMode });
    }

    const application: NewApplication = {
      companyName,
      roleDescription,
      // Cell value is not trimmed for the long description, to keep its formatting.
      jobDescription: index.job_description === undefined ? '' : (cells[index.job_description] ?? ''),
      applicationDate,
      salary: get('salary') || DEFAULT_SALARY,
      workMode,
      status,
      tags: parseTags(get('tags')),
    };

    if (errors.length === 0) {
      const key = duplicateKey(application);
      if (existingKeys.has(key)) errors.push({ code: 'duplicateExisting' });
      else if (fileKeys.has(key)) errors.push({ code: 'duplicateInFile' });
      else fileKeys.add(key);
    }

    rows.push({ line: parsed.lineNumbers[r], application, errors, warnings });
  }

  return { rows };
};

export interface ImportPlan {
  toInsert: NewApplication[];
  /** Valid rows left out because of the plan limit. */
  skippedByLimit: number;
  /** Rows with errors (including duplicates). */
  invalid: number;
}

/**
 * @param remaining how many applications the user can still add, or null for no limit
 */
export const planImport = (rows: CsvImportRow[], remaining: number | null): ImportPlan => {
  const valid = rows.filter((r) => r.errors.length === 0).map((r) => r.application);
  const cap = remaining === null ? valid.length : Math.max(0, remaining);
  return {
    toInsert: valid.slice(0, cap),
    skippedByLimit: Math.max(0, valid.length - cap),
    invalid: rows.length - valid.length,
  };
};
