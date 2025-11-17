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

// async jobApplyButtonText(href) {
//   // Determine which button exists
//   let applyButtonXpath = '(//*[@id="job_header"]/div[2]/div[2]/button)[2]'; // default for Apply/Interested/Company Site

//   // Check if the single button exists (for "Applied" jobs)
//   const singleButtonVisible = await this.page.locator('(//span[@id="already-applied"])[1]').isVisible().catch(() => false);
//   if (singleButtonVisible) {
//     applyButtonXpath = '(//span[@id="already-applied"])[1]';
//   }

//   const applyText = await getText(this.page, applyButtonXpath);

//   if (!applyText) return; // skip if no text

//   if (applyText === "Apply") {
//     await click(this.page, applyButtonXpath);

//       const isChipVisible = await this.page.locator("div.chipMsg").isVisible().catch(() => false);
//       if (isChipVisible) {
//         await logJobResult("FORM_NEED_TO_FILL", href);
//       }

//       console.log("Applied Jobs", href);
//       await logJobResult('APPLIED_JOBS', href);

//     } else if (applyText === "Applied") {
//       await logJobResult('APPLIED', href);

//   } else if (applyText.includes('Interested')) {
//     console.log('💼 Interested:', href);
//     await logJobResult('INTERESTED', href);

//   } else if (applyText.includes('Company Site')) {
//     console.log('🌐 Company Site:', href);
//     await logJobResult('COMPANY_SITE', href);
//   }
// }

 async fillChatbotFormDynamic(page) {
  while (true) {
    const botQuestion = page.locator("li.botItem:last-child span");
    const isVisible = await botQuestion.isVisible().catch(() => false);

    if (!isVisible) break;

    const question = (await botQuestion.innerText()).toLowerCase();
    let answer = "";

    // AUTO-ANSWER BASED ON QUESTION
    if (question.includes("current") && (question.includes("salary") || (question.includes("ctc")))) {
      answer = "8";
    } else if (question.includes("experience")) {
      answer = "3";
    } else if (question.includes("expected") && (question.includes("salary") || (question.includes("ctc")))) {
      answer = "14";
    } else if (question.includes("notice")) {
      answer = "2 month";  // matches radio text
    } else {
      answer = "Yes";
    }

    // 🔥 CHECK IF RADIO BUTTONS APPEARED
    const radioContainer = page.locator("//div[contains(@class,'singleselect-radiobutton')]");
    const radiosVisible = await radioContainer.isVisible().catch(() => false);

    if (radiosVisible) {
      console.log("🔘 Radio buttons detected... selecting:", answer);

      const option = page.locator(`//label[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'${answer.toLowerCase()}')]`);

      if (await option.isVisible()) {
        await option.click();
        console.log("✔ Selected radio:", answer);
      } else {
        console.log("⚠ Radio option not found, selecting first option");
        await page.locator("//label[@class='ssrc__label']").first().click();
      }

      await page.waitForTimeout(1000);
      continue; // move to next question
    }

    // 🔤 OTHERWISE — USE INPUT BOX
    const chatInput = page.locator("//div[starts-with(@id,'userInput__') and contains(@id,'InputBox')]");
    const inputVisible = await chatInput.isVisible().catch(() => false);

    if (inputVisible) {
      console.log("⌨ Filling text input:", answer);

      await chatInput.fill(answer);
      await page.keyboard.press("Enter");

      await page.waitForTimeout(1200);
      continue;
    }

    // NONE FOUND → EXIT
    console.log("❌ No input or radio detected — exiting chatbot");
    break;
  }
}


  // ----------------------------------------
  // MAIN APPLY BUTTON LOGIC
  // ----------------------------------------
  async jobApplyButtonText(page, href) {
    let applyButtonXpath = '(//*[@id="job_header"]/div[2]/div[2]/button)[2]';

    const singleButtonVisible = await page
      .locator('(//span[@id="already-applied"])[1]')
      .isVisible()
      .catch(() => false);

    if (singleButtonVisible) {
      applyButtonXpath = '(//span[@id="already-applied"])[1]';
    }

    const applyText = await getText(page, applyButtonXpath);
    if (!applyText) return;

    // ---------------- APPLY ----------------
    if (applyText === "Apply") {
      await click(page, applyButtonXpath);

      const isChipVisible = await page
        .locator("div.chipMsg")
        .isVisible()
        .catch(() => false);

      if (isChipVisible) {
        await logJobResult("FORM_NEED_TO_FILL", href);

        // 🔥 Call the dynamic chatbot filling method
        await this.fillChatbotFormDynamic(page);
      }

      console.log("Applied Jobs", href);
      await logJobResult("APPLIED_JOBS", href);

    // ---------------- APPLIED ----------------
    } else if (applyText === "Applied") {
      await logJobResult("APPLIED", href);

    // ---------------- INTERESTED ----------------
    } else if (applyText.includes("Interested")) {
      await logJobResult("INTERESTED", href);

    // ---------------- COMPANY SITE ----------------
    } else if (applyText.includes("Company Site")) {
      await logJobResult("COMPANY_SITE", href);
    }
  }



}
