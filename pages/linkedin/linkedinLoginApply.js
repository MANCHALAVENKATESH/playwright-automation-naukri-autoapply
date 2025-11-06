import fs from 'fs';
import path from 'path';
import { LinkedinConfig } from '../../utils/env.js';
import { click, fill, implicitWait } from '../../helpers/actions.js';

const COOKIE_PATH = path.resolve('storage/linkedinCookies.json');

export class LinkedinLogin {
  constructor(page) {
    this.page = page;
  }

  emailTextbox = 'input#username';
  passwordTextbox = 'input#password';
  loginButton = '//button[@type="submit"]';

  async openLinkedin() {
    await this.page.goto(LinkedinConfig.LOGIN_URL, {
      timeout: 60000,
      waitUntil: 'load',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
  }

  async enterEmail(email) {
    await click(this.page, this.emailTextbox);
    await fill(this.page, this.emailTextbox, email);
  }

  async enterPassword(password) {
    await click(this.page, this.passwordTextbox);
    await fill(this.page, this.passwordTextbox, password);
  }

  async submit() {
    await click(this.page, this.loginButton);
  }

  async saveCookies() {
    const cookies = await this.page.context().cookies();
    fs.writeFileSync(COOKIE_PATH, JSON.stringify(cookies, null, 2));
    console.log('🍪 Cookies saved to', COOKIE_PATH);
  }

  async loadCookies() {
    if (fs.existsSync(COOKIE_PATH)) {
      try {
        const data = fs.readFileSync(COOKIE_PATH, 'utf-8');
        if (!data) return console.log('⚠️ Cookie file empty');

        const cookies = JSON.parse(data);
        await this.page.context().addCookies(cookies);
        console.log('🍪 Cookies loaded successfully');
        return true;
      } catch (err) {
        console.log('⚠️ Failed to load cookies:', err.message);
      }
    } else {
      console.log('⚠️ No cookie file found — fresh login needed');
    }
    return false;
  }

  async login(email, password) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.submit();
    await implicitWait(3000);
    await this.saveCookies();
  }

// async applyToJob(currentJobId) {
//   console.log(`🚀 Applying to Job ID: ${currentJobId}`);

//   const easyApplyButton = this.page.locator('(//*[@id="jobs-apply-button-id"])[1]');
//   await easyApplyButton.click();

//   const nextButton = this.page.locator("//button[@aria-label='Continue to next step']");
//   const reviewButton = this.page.locator("//button[@aria-label='Review your application']");
//   const submitButton = this.page.locator("//button[@aria-label='Submit application']");

//   // 🔁 Loop until Review/Submit phase
//   while (
//     await nextButton.isVisible().catch(() => false) ||
//     (await reviewButton.isVisible().catch(() => false))
//   ) {
//     console.log('➡️ Checking and filling fields in current step...');
//     await this.fillFormFields();

//     if (await reviewButton.isVisible().catch(() => false)) {
//       console.log('📝 Clicking Review...');
//       await reviewButton.click();
//       await this.page.waitForTimeout(1500);

//       // 🔍 Keep checking for required fields in Review modal until all are filled
//       console.log('🔍 Checking required fields in Review step...');
//       await this.handleReviewStep();

//       break; // exit loop after review phase handled
//     } else if (await nextButton.isVisible().catch(() => false)) {
//       console.log('➡️ Clicking Next...');
//       await nextButton.click();
//       await this.page.waitForTimeout(2000);
//     } else {
//       console.log('⚠️ No Next or Review button found. Exiting loop.');
//       break;
//     }
//   }

//   // 🚀 Submit final application
//   if (await submitButton.isVisible().catch(() => false)) {
//     console.log('🚀 Submitting application...');
//     await submitButton.click();
//   } else {
//     console.log('⚠️ No Submit button visible!');
//   }
// }

// /**
//  * ✅ Helper: Fill text fields and dropdowns if required or empty
//  */
// async fillFormFields() {
//   const fields = await this.page.$$(
//     "//div[contains(@class, 'artdeco-text-input--container') or contains(@class, 'jobs-easy-apply-form-element')]"
//   );

//   for (const field of fields) {
//     const label = await field.$('label');
//     if (!label) continue;

//     const labelText = (await label.innerText()).toLowerCase().trim();
//     const isRequired = labelText.includes('*');

//     // 🔹 Input Fields
//     const input = await field.$('input');
//     if (input) {
//       const value = await input.inputValue().catch(() => '');
//       if (!value && isRequired) {
//         console.log(`⚠️ Required input: ${labelText}`);
//         if (labelText.includes('work experience')) {
//           await input.fill('3');
//         } else if (labelText.includes('current salary') || labelText.includes('current ctc')) {
//           await input.fill('800000');
//         } else if (labelText.includes('expected salary') || labelText.includes('expected ctc')) {
//           await input.fill('1400000');
//         } else if (labelText.includes('notice period')) {
//           await input.fill('30');
//         } else {
//           await input.fill('Yes');
//         }
//       }
//     }

//     // 🔹 Dropdowns
//     const dropdown = await field.$('select');
//     if (dropdown) {
//       const options = await dropdown.$$('option');
//       const selected = await dropdown.inputValue().catch(() => '');
//       if (options.length > 0 && (!selected || isRequired)) {
//         console.log(`📋 Required dropdown: ${labelText} — selecting "Yes"`);
//         try {
//           await dropdown.selectOption({ label: 'Yes' });
//         } catch {
//           await dropdown.selectOption({ index: 1 });
//         }
//       }
//     }
//   }
// }

// /**
//  * ✅ Helper: Specifically for handling the Review Modal required fields
//  */
// async handleReviewStep() {
//   let missingFields = true;

//   while (missingFields) {
//     missingFields = false;

//     const fields = await this.page.$$(
//       "//div[contains(@class, 'artdeco-text-input--container') or contains(@class, 'jobs-easy-apply-form-element')]"
//     );

//     for (const field of fields) {
//       const label = await field.$('label');
//       if (!label) continue;

//       const labelText = (await label.innerText()).toLowerCase().trim();
//       const isRequired = labelText.includes('*');

//       const input = await field.$('input');
//       const dropdown = await field.$('select');

//       if (isRequired) {
//         if (input) {
//           const value = await input.inputValue().catch(() => '');
//           if (!value) {
//             missingFields = true;
//             console.log(`⚠️ Filling required input in Review: ${labelText}`);
//             await input.fill('Yes');
//           }
//         }

//         if (dropdown) {
//           const options = await dropdown.$$('option');
//           const selected = await dropdown.inputValue().catch(() => '');
//           if (options.length > 0 && (!selected || isRequired)) {
//             missingFields = true;
//             console.log(`📋 Selecting dropdown in Review: ${labelText}`);
//             try {
//               await dropdown.selectOption({ label: 'Yes' });
//             } catch {
//               await dropdown.selectOption({ index: 1 });
//             }
//           }
//         }
//       }
//     }

//     if (missingFields) {
//       console.log('🔁 Found unfilled required fields — rechecking...');
//       await this.page.waitForTimeout(1000);
//     }
//   }

//   console.log('✅ All required fields in Review step are filled!');
// }

async applyToJob(currentJobId) {
  console.log(`🚀 Applying to Job ID: ${currentJobId}`);

  const easyApplyButton = this.page.locator('(//*[@id="jobs-apply-button-id"])[1]');
  await easyApplyButton.click();

  const nextButton = this.page.locator("//button[@aria-label='Continue to next step']");
  const reviewButton = this.page.locator("//button[@aria-label='Review your application']");
  const submitButton = this.page.locator("//button[@aria-label='Submit application']");

  // 🔁 Loop until Review/Submit phase
  while (
    await nextButton.isVisible().catch(() => false) ||
    (await reviewButton.isVisible().catch(() => false))
  ) {
    console.log("➡️ Checking and filling fields in current step...");
    await this.fillFormFields();

    if (await reviewButton.isVisible().catch(() => false)) {
      console.log("📝 Clicking Review...");
      await reviewButton.click();
      await this.page.waitForTimeout(1500);

      // 🔍 Recheck required fields inside Review modal
      console.log("🔍 Checking required fields in Review step...");
      await this.handleReviewStep();

      break; // exit after review
    } else if (await nextButton.isVisible().catch(() => false)) {
      console.log("➡️ Clicking Next...");
      await nextButton.click();
      await this.page.waitForTimeout(2000);
    } else {
      console.log("⚠️ No Next or Review button found. Exiting loop.");
      break;
    }
  }

  // 🚀 Submit final application
  if (await submitButton.isVisible().catch(() => false)) {
    console.log("🚀 Submitting application...");
    await submitButton.click();
  } else {
    console.log("⚠️ No Submit button visible!");
  }
}

/**
 * ✅ Fills required text fields and dropdowns on current form
 */
async fillFormFields() {
  const fields = await this.page.$$(
    "//div[contains(@class, 'artdeco-text-input--container') or contains(@class, 'jobs-easy-apply-form-element')]"
  );

  for (const field of fields) {
    const label = await field.$("label");
    if (!label) continue;

    const labelText = (await label.innerText()).toLowerCase().trim();
    const isRequired = labelText.includes("*");

    // 🔹 Handle input fields
    const input = await field.$("input");
    if (input) {
      const value = await input.inputValue().catch(() => "");
      if (!value && isRequired) {
        console.log(`⚠️ Required input: ${labelText}`);
        if (labelText.includes("work experience")) {
          await input.fill("3");
        } else if (labelText.includes("current salary") || labelText.includes("current ctc")) {
          await input.fill("800000");
        } else if (labelText.includes("expected salary") || labelText.includes("expected ctc")) {
          await input.fill("1400000");
        } else if (labelText.includes("notice period")) {
          await input.fill("30");
        } else {
          await input.fill("Yes");
        }
      }
    }

    // 🔹 Native <select> dropdowns
    const dropdown = await field.$("select");
    if (dropdown) {
      const options = await dropdown.$$("option");
      const selected = await dropdown.inputValue().catch(() => "");
      if (options.length > 0 && (!selected || isRequired)) {
        console.log(`📋 Selecting native dropdown: ${labelText}`);
        try {
          await dropdown.selectOption({ label: "Yes" });
        } catch {
          await dropdown.selectOption({ index: 1 });
        }
      }
    }

    // 🔹 Custom LinkedIn dropdowns
    const customDropdown = await field.$("button[aria-haspopup='listbox'], button[aria-expanded]");
    if (customDropdown) {
      console.log(`📋 Found custom dropdown for: ${labelText}`);
      await customDropdown.click();
      await this.page.waitForTimeout(500);

      const yesOption = this.page.locator("//span[normalize-space()='Yes']");
      if (await yesOption.isVisible().catch(() => false)) {
        await yesOption.click();
        console.log(`✅ Selected 'Yes' for ${labelText}`);
      } else {
        const firstOption = this.page.locator(
          "(//div[@role='option' or @role='menuitem'])[1]"
        );
        if (await firstOption.isVisible().catch(() => false)) {
          await firstOption.click();
          console.log(`⚙️ Selected first available option for ${labelText}`);
        }
      }
      await this.page.waitForTimeout(500);
    }
  }
}

/**
 * ✅ Handle required fields appearing in Review modal
 */
async handleReviewStep() {
  let missingFields = true;

  while (missingFields) {
    missingFields = false;

    const fields = await this.page.$$(
      "//div[contains(@class, 'artdeco-text-input--container') or contains(@class, 'jobs-easy-apply-form-element')]"
    );

    for (const field of fields) {
      const label = await field.$("label");
      if (!label) continue;

      const labelText = (await label.innerText()).toLowerCase().trim();
      const isRequired = labelText.includes("*");

      const input = await field.$("input");
      const dropdown = await field.$("select");
      const customDropdown = await field.$("button[aria-haspopup='listbox'], button[aria-expanded]");

      if (!isRequired) continue;

      // 🧩 Fill missing input
      if (input) {
        const value = await input.inputValue().catch(() => "");
        if (!value) {
          console.log(`⚠️ Filling missing input in Review: ${labelText}`);
          await input.fill("Yes");
          missingFields = true;
        }
      }

      // 🧩 Fill native dropdown
      if (dropdown) {
        const options = await dropdown.$$("option");
        const selected = await dropdown.inputValue().catch(() => "");
        if (options.length > 0 && (!selected || isRequired)) {
          console.log(`📋 Selecting dropdown in Review: ${labelText}`);
          try {
            await dropdown.selectOption({ label: "Yes" });
          } catch {
            await dropdown.selectOption({ index: 1 });
          }
          missingFields = true;
        }
      }

      // 🧩 Handle custom dropdowns in review modal
      if (customDropdown) {
        console.log(`📋 Handling custom dropdown in Review: ${labelText}`);
        await customDropdown.click();
        await this.page.waitForTimeout(500);

        const yesOption = this.page.locator("//span[normalize-space()='Yes']");
        if (await yesOption.isVisible().catch(() => false)) {
          await yesOption.click();
          console.log(`✅ Selected 'Yes' for ${labelText}`);
        } else {
          const firstOption = this.page.locator(
            "(//div[@role='option' or @role='menuitem'])[1]"
          );
          if (await firstOption.isVisible().catch(() => false)) {
            await firstOption.click();
            console.log(`⚙️ Selected first option for ${labelText}`);
          }
        }
        await this.page.waitForTimeout(500);
        missingFields = true;
      }
    }

    if (missingFields) {
      console.log("🔁 Some required fields were filled — rechecking...");
      await this.page.waitForTimeout(1000);
    }
  }

  console.log("✅ All required fields in Review step are filled!");
}



}