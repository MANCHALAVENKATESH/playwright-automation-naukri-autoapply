import { getText, click,fill,implicitWait } from '../helpers/actions.js';
import { utils } from '../utils/constants.js';
import { EnvInstaHyre } from '../utils/env.js';
import { logJobResult } from '../utils/reports.js';
import path from 'path';

const COOKIE_PATH = path.resolve("storage/instahyreCookies.json");

export class Instahyre {
    constructor(page) {
        this.page = page
    }

    async openInstaHyreLogin() {
        await this.page.goto(EnvInstaHyre.LOGIN, {
            waitUntil: 'domcontentloaded',
            timeout: 60000,
        });
    }
    emailTextbox = `//*[@id="email"]`
    passwordTextbox = `//*[@id="password"]`
    loginButton = `//*[@id="login-form"]/button`;

    async enterEmail(email) {
        await click(this.page, this.emailTextbox);
        await fill(this.page, this.emailTextbox, email);
    }
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
    async enterPassword(password) {
        await click(this.page, this.passwordTextbox);
        await fill(this.page, this.passwordTextbox, password);
    }
    async submit() {
        await click(this.page, this.loginButton);
    }
  
    async login(email, password) {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.submit();
        await implicitWait(3000);
        await utils.saveCookies(this.page);
    }

}
