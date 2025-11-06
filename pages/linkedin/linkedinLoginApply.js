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

  async applyToJob(currentJobId) {
    console.log(`🚀 Applying to Job ID: ${currentJobId}`);

    // Click Easy Apply
    const easyApplyButton = this.page.locator('(//*[@id="jobs-apply-button-id"])[1]');
    await easyApplyButton.click();

    // Loop until Review step
    while (true) {
      const reviewButton = this.page.locator("//button[@aria-label='Review your application']");
      if (await reviewButton.isVisible()) {
        console.log("✅ Review step reached!");
        await reviewButton.click();
        break;
      }

      // Fill “Work Experience” fields
      const fields = await this.page.$$("//div[contains(@class, 'artdeco-text-input--container')]");
      for (const field of fields) {
        const label = await field.$('label');
        const input = await field.$('input');

        if (label && input) {
          const labelText = (await label.innerText()).toLowerCase().trim();
          if (labelText.includes('work experience')) {
            console.log(`🧠 Found field: ${labelText}`);
            await input.fill('3');
          }
          if(labelText.includes('current salary') || labelText.includes('current ctc')){
            await input.fill('800000');
        }
        if(labelText.includes('expected salary') || labelText.includes('expected ctc')){
            await input.fill('1400000');
        }
        if(labelText.includes('notice period')){
            await input.fill('30');
        }


      }

      // Click “Next”
      const nextButton = this.page.locator("//button[@aria-label='Continue to next step']");
      if (await nextButton.isVisible()) {
        console.log('➡️ Clicking Next...');
        await nextButton.click();
        await this.page.waitForTimeout(2000);
      } else {
        console.log('⚠️ No Next button found — stopping loop.');
        break;
      }
    }

    // Submit Application
    const submitButton = this.page.locator("//button[@aria-label='Submit application']");
    await submitButton.waitFor({ state: 'visible', timeout: 10000 });
    console.log('🚀 Submitting application...');
    await submitButton.click();

    console.log('🎉 Application submitted successfully!');
  }
}
}
