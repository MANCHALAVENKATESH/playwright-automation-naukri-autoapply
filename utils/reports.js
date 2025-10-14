import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';

const filePath = './job_report.csv';

const csvWriter = createObjectCsvWriter({
  path: filePath,
  header: [
    { id: 'type', title: 'TYPE' },
    { id: 'jobLink', title: 'JOB_LINK' },
  ],
  append: false, // overwrite each run
});

let records = [];

/**
 * Add a job result entry
 */
export async function logJobResult(type, jobLink) {
  records.push({ type, jobLink });
}

/**
 * Save all records to CSV and print in table format
 */
export async function saveCSVReport() {
  if (records.length === 0) {
    console.log('⚠️ No job data to save.');
    return;
  }

  await csvWriter.writeRecords(records);
  console.log(`\n📄 CSV report generated: ${filePath}\n`);

  // 🟢 Display as table in console
  console.table(records);
}
