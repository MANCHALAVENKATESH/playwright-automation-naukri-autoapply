import fs from 'fs';
import path from 'path';
import { click, fill ,implicitWait } from "../helpers/actions.js";
import { BASE_URL } from "../utils/env.js";


const COOKIE_PATH = path.resolve("storage/naukriCookies.json");
export class LoginPage {
  constructor(page) {
    this.page = page;
  }
  loginLink = { role: 'link', name: 'Login', exact: true };
  emailTextbox = { role: 'textbox', name: 'Enter your active Email ID /' };
  passwordTextbox = { role: 'textbox', name: 'Enter your password' };
  loginButton = { role: 'button', name: 'Login', exact: true };

  async openNaukri() {
  await this.page.goto(BASE_URL, {
  waitUntil: 'domcontentloaded',
  timeout: 60000,
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
   async openLoginForm() {
    await click(this.page, this.loginLink);
  }
    async login(email, password) {
    await this.openLoginForm();
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.submit();
    await implicitWait(2000);
     await this.saveCookies(); 
  }
}
