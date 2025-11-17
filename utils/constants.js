import fs from 'fs';
import path from 'path';
const COOKIE_PATH = path.resolve("storage/instahyreCookies.json");

export class utils{
      // ✅ Save cookies to file
   static async saveCookies(page) {
    const cookies = await page.context().cookies();
    fs.writeFileSync(COOKIE_PATH, JSON.stringify(cookies, null, 2));
    console.log('🍪 Cookies saved to', COOKIE_PATH);
  }

  // ✅ Load cookies from file
 static async loadCookies(COOKIE_PATH) {
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
}