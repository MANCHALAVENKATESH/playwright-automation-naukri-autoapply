import fs from 'fs';
import path from 'path';
import { LinkedinConfig } from "../../utils/env.js";
import { click, fill ,implicitWait, navigateTo } from "../..//helpers/actions.js";
import { JobsApply } from './JobsApply.js';


const COOKIE_PATH = path.resolve("storage/linkedinCookies.json");
export class LinkedinLogin {
  constructor(page) {
    this.page = page;
  }
  
  emailTextbox = "input#username";
  passwordTextbox = "input#password";
  loginButton = "//button[@type='submit']";
  

  async openLInkedin() {
  await this.page.goto(LinkedinConfig.LOGIN_URL,  {
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
  
  // ✅ Save cookies to file
  async saveCookies() {
    const cookies = await this.page.context().cookies();
    fs.writeFileSync(COOKIE_PATH, JSON.stringify(cookies, null, 2));
    console.log('🍪 Cookies saved to', COOKIE_PATH);
  }
  async jobsApplyIcon(){
    await navigateTo(this.page,LinkedinConfig.LINKEDIN_JOB_FILTER)
    return new JobsApply(this.page)
  }
  // ✅ Load cookies from file
 async loadCookies() {
  if (fs.existsSync(COOKIE_PATH)) {
    try {
      const fileContent = fs.readFileSync(COOKIE_PATH, 'utf-8');
      if (!fileContent) {
        console.log('⚠️ Cookie file is empty');
        return false;
      }

      const cookies = JSON.parse(fileContent);
      await this.page.context().addCookies(cookies);
      console.log('🍪 Cookies loaded from', COOKIE_PATH);
      return true;
    } catch (err) {
      console.log('⚠️ Failed to parse cookie file:', err.message);
      return false;
    }
  }
  console.log('⚠️ No cookie file found. Performing full login...');
  return false;
}


  async submit() {
    await click(this.page, this.loginButton);
  }

    async login(email, password) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.submit();
    await implicitWait(2000);
     await this.saveCookies(); 
  }
}
