import { getText,click } from '../helpers/actions.js';
import { logJobResult } from '../utils/reports.js';

export class ApplyJob {
  constructor(page) {
    this.page = page;
  }

  NumberOfJobs = '//*[@id="jobs-list-header"]/div[1]/span';
  applyButtonText = '(//*[@id="job_header"]/div[2]/div[2]/button)[2]'
  // Use single quotes outside or escape double quotes

  // Method to get number of jobs
  async getNumberOfJob() {
    const text = await getText(this.page, this.NumberOfJobs);
    const lastNumber = text.split('of')[1].trim();
    return lastNumber; // returns the text content of the element
  }

  async jobApplyButtonText(href){
    const applyText = await getText(this.page,this.applyButtonText)
    if(applyText == "Apply"){
        await click(this.page,this.applyButtonText)
        const isChipVisible = await this.page.locator("div.chipMsg").isVisible().catch(() =>false)
        if(isChipVisible){
          await logJobResult("FORM_NEED_TO_FILL",href)
        }
        console.log("Applied Jobs ",href);
      await logJobResult('APPLIED_JOBS', href);
    }
    else if (applyText.includes('Interested')) {
      console.log('💼 Interested:', href);
      await logJobResult('INTERESTED', href);

    } else if (applyText.includes('Company Site')) {
      console.log('🌐 Company Site:', href);
      await logJobResult('COMPANY_SITE', href);
    } else {
      console.log('🔸 Other:', href);
      await logJobResult('OTHER', href);
    }
  }

}
