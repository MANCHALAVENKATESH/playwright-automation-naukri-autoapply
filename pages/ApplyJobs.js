import { getText,click } from '../helpers/actions.js';
import { logJobResult } from '../utils/reports.js';

export class ApplyJob {
  constructor(page) {
    this.page = page;
  }

  NumberOfJobs = '//*[@id="jobs-list-header"]/div[1]/span';
  // Use single quotes outside or escape double quotes

  // Method to get number of jobs
  async getNumberOfJob() {
    const text = await getText(this.page, this.NumberOfJobs);
    const lastNumber = text.split('of')[1].trim();
    return lastNumber; // returns the text content of the element
  }

async jobApplyButtonText(href) {
  // Determine which button exists
  let applyButtonXpath = '(//*[@id="job_header"]/div[2]/div[2]/button)[2]'; // default for Apply/Interested/Company Site

  // Check if the single button exists (for "Applied" jobs)
  const singleButtonVisible = await this.page.locator('(//span[@id="already-applied"])[1]').isVisible().catch(() => false);
  if (singleButtonVisible) {
    applyButtonXpath = '(//span[@id="already-applied"])[1]';
  }

  const applyText = await getText(this.page, applyButtonXpath);

  if (!applyText) return; // skip if no text

  if (applyText === "Apply") {
    await click(this.page, applyButtonXpath);

    const isChipVisible = await this.page.locator("div.chipMsg").isVisible().catch(() => false);
    if (isChipVisible) {
      await logJobResult("FORM_NEED_TO_FILL", href);
    }

    console.log("Applied Jobs", href);
    await logJobResult('APPLIED_JOBS', href);

  } else if (applyText === "Applied") {
    await logJobResult('APPLIED', href);

  } else if (applyText.includes('Interested')) {
    console.log('💼 Interested:', href);
    await logJobResult('INTERESTED', href);

  } else if (applyText.includes('Company Site')) {
    console.log('🌐 Company Site:', href);
    await logJobResult('COMPANY_SITE', href);
  }
}


}
