import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle2, FileUp, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useTranslatedLabels } from '@/hooks/useTranslatedLabels';
import { FREE_PLAN_APPLICATION_LIMIT, JobApplication } from '@/types/job';
import {
  CSV_COLUMNS,
  CsvImportResult,
  CsvIssue,
  NewApplication,
  parseApplicationsCsv,
  planImport,
} from '@/lib/applicationsCsv';

interface CsvImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingApplications: JobApplication[];
  /** How many applications the user can still add, or null when there is no limit (Pro). */
  remaining: number | null;
  onImport: (applications: NewApplication[]) => Promise<{ inserted: number; failed: number }>;
  onUpgrade?: () => void;
}

export const CsvImportDialog: React.FC<CsvImportDialogProps> = ({
  open,
  onOpenChange,
  existingApplications,
  remaining,
  onImport,
  onUpgrade,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { getJobStatusLabel } = useTranslatedLabels();
  const [fileName, setFileName] = useState<string>('');
  const [result, setResult] = useState<CsvImportResult | null>(null);
  const [importing, setImporting] = useState(false);

  const reset = () => {
    setFileName('');
    setResult(null);
    setImporting(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (importing) return;
    if (!next) reset();
    onOpenChange(next);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    try {
      const text = await file.text();
      setResult(parseApplicationsCsv(text, existingApplications, format(new Date(), 'yyyy-MM-dd')));
    } catch (error) {
      console.error('Error reading CSV file:', error);
      setResult(null);
      toast({ title: t('common.error'), description: t('csv.readError'), variant: 'destructive' });
    }
  };

  const plan = useMemo(() => (result ? planImport(result.rows, remaining) : null), [result, remaining]);

  // Indexes of valid rows that fall beyond the plan limit, to flag them in the preview.
  const overLimit = useMemo(() => {
    const set = new Set<number>();
    if (!result || !plan) return set;
    let validSeen = 0;
    result.rows.forEach((row, i) => {
      if (row.errors.length > 0) return;
      validSeen++;
      if (validSeen > plan.toInsert.length) set.add(i);
    });
    return set;
  }, [result, plan]);

  const warningRows = result ? result.rows.filter((r) => r.errors.length === 0 && r.warnings.length > 0).length : 0;

  const issueText = (issue: CsvIssue) => t(`csv.issues.${issue.code}`, { value: issue.value });

  const handleImport = async () => {
    if (!plan || plan.toInsert.length === 0) return;
    setImporting(true);
    try {
      const { inserted, failed } = await onImport(plan.toInsert);
      const skipped = plan.invalid + plan.skippedByLimit;
      if (failed > 0) {
        toast({
          title: t('csv.importFailed'),
          description: t('csv.importFailedDescription', { inserted, failed }),
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('csv.importDone'),
          description:
            t('csv.importDoneDescription', { inserted, skipped }) +
            (plan.skippedByLimit > 0
              ? ' ' +
                t('csv.summary.skippedByLimit', { count: plan.skippedByLimit, limit: FREE_PLAN_APPLICATION_LIMIT })
              : ''),
        });
      }
      setImporting(false);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error importing CSV:', error);
      setImporting(false);
      toast({
        title: t('csv.importFailed'),
        description: t('csv.importFailedDescription', { inserted: 0, failed: plan.toInsert.length }),
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('csv.importTitle')}</DialogTitle>
          <DialogDescription>{t('csv.importDescription')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border p-3 text-xs space-y-2">
            <code className="block break-all">{CSV_COLUMNS.join(',')}</code>
            <p className="text-muted-foreground">{t('csv.requiredColumns')}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="csv-file">{t('csv.chooseFile')}</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv,text/csv"
              onChange={handleFile}
              disabled={importing}
            />
            {fileName && <p className="text-xs text-muted-foreground">{fileName}</p>}
          </div>

          {result?.fileError && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/50 p-3 text-sm text-destructive">
              <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                {t(`csv.fileErrors.${result.fileError.code}`, { columns: result.fileError.columns?.join(', ') })}
              </span>
            </div>
          )}

          {result && !result.fileError && plan && (
            <>
              <ul className="text-sm space-y-1">
                <li>{t('csv.summary.rows', { count: result.rows.length })}</li>
                <li className="text-green-600 font-medium">{t('csv.summary.ready', { count: plan.toInsert.length })}</li>
                {warningRows > 0 && (
                  <li className="text-amber-600">{t('csv.summary.warnings', { count: warningRows })}</li>
                )}
                {plan.invalid > 0 && (
                  <li className="text-destructive">{t('csv.summary.invalid', { count: plan.invalid })}</li>
                )}
                {plan.skippedByLimit > 0 && (
                  <li className="text-destructive">
                    {t('csv.summary.skippedByLimit', { count: plan.skippedByLimit, limit: FREE_PLAN_APPLICATION_LIMIT })}{' '}
                    {onUpgrade && (
                      <button
                        type="button"
                        className="underline"
                        onClick={() => {
                          handleOpenChange(false);
                          onUpgrade();
                        }}
                      >
                        {t('csv.limitUpgrade')}
                      </button>
                    )}
                  </li>
                )}
              </ul>

              {result.rows.length > 0 && (
                <div className="max-h-80 overflow-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-14">{t('csv.table.line')}</TableHead>
                        <TableHead>{t('csv.table.company')}</TableHead>
                        <TableHead>{t('csv.table.role')}</TableHead>
                        <TableHead>{t('csv.table.date')}</TableHead>
                        <TableHead>{t('csv.table.status')}</TableHead>
                        <TableHead>{t('csv.table.result')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.rows.map((row, i) => {
                        const hasErrors = row.errors.length > 0;
                        const isOverLimit = overLimit.has(i);
                        return (
                          <TableRow key={row.line} className={hasErrors || isOverLimit ? 'opacity-70' : undefined}>
                            <TableCell className="text-xs">{row.line}</TableCell>
                            <TableCell className="text-xs">{row.application.companyName}</TableCell>
                            <TableCell className="text-xs">{row.application.roleDescription}</TableCell>
                            <TableCell className="text-xs whitespace-nowrap">{row.application.applicationDate}</TableCell>
                            <TableCell className="text-xs">{getJobStatusLabel(row.application.status)}</TableCell>
                            <TableCell className="text-xs">
                              {hasErrors ? (
                                <span className="flex items-start gap-1 text-destructive">
                                  <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                  {row.errors.map(issueText).join('; ')}
                                </span>
                              ) : isOverLimit ? (
                                <span className="flex items-start gap-1 text-destructive">
                                  <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                  {t('csv.summary.skippedByLimit', { count: 1, limit: FREE_PLAN_APPLICATION_LIMIT })}
                                </span>
                              ) : row.warnings.length > 0 ? (
                                <span className="flex items-start gap-1 text-amber-600">
                                  <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                  {row.warnings.map(issueText).join('; ')}
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-green-600">
                                  <CheckCircle2 className="w-3 h-3" />
                                  {t('csv.table.ok')}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={importing}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleImport} disabled={importing || !plan || plan.toInsert.length === 0}>
            <FileUp className="w-4 h-4 mr-2" />
            {importing ? t('csv.importing') : t('csv.confirm', { count: plan?.toInsert.length ?? 0 })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
