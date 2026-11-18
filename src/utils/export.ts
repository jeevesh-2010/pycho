import type { Question, Submission } from '../types';
import { formatExactTimestamp } from './date';

export function formatSubmissionAsMarkdown(submission: Submission): string {
  const lines: string[] = [];
  lines.push(`## Daily Check-in — ${formatExactTimestamp(submission.timestamp)}`);
  lines.push('');

  submission.answers.forEach((ans) => {
    lines.push(`### ${ans.questionText}`);
    lines.push(ans.answer.trim() || '_No response provided._');
    lines.push('');
  });

  return lines.join('\n');
}

export function formatSubmissionAsPlainText(submission: Submission): string {
  const lines: string[] = [];
  lines.push(`[${formatExactTimestamp(submission.timestamp)}]`);
  lines.push('----------------------------------------');

  submission.answers.forEach((ans) => {
    lines.push(`Q: ${ans.questionText}`);
    lines.push(`A: ${ans.answer.trim() || '(No response)'}`);
    lines.push('');
  });

  return lines.join('\n');
}

export function exportAllToMarkdown(submissions: Submission[]): void {
  const content = submissions.map(formatSubmissionAsMarkdown).join('\n---\n\n');
  downloadFile(content, `zendaily-export-${new Date().toISOString().slice(0, 10)}.md`, 'text/markdown');
}

export function exportAllToJson(submissions: Submission[], questions: Question[]): void {
  const payload = {
    app: 'ZenDaily',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    totalSubmissions: submissions.length,
    questions,
    submissions,
  };
  const content = JSON.stringify(payload, null, 2);
  downloadFile(content, `zendaily-backup-${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
}

export function exportAllToCsv(submissions: Submission[]): void {
  const rows: string[][] = [
    ['Timestamp', 'Date', 'Question', 'Answer']
  ];

  submissions.forEach((sub) => {
    sub.answers.forEach((ans) => {
      rows.push([
        `"${sub.timestamp}"`,
        `"${sub.date}"`,
        `"${escapeCsv(ans.questionText)}"`,
        `"${escapeCsv(ans.answer)}"`,
      ]);
    });
  });

  const csvContent = rows.map((r) => r.join(',')).join('\n');
  downloadFile(csvContent, `zendaily-export-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
}

function escapeCsv(str: string): string {
  return str.replace(/"/g, '""').replace(/\n/g, ' ');
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
