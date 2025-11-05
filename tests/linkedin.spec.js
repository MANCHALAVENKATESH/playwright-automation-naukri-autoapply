import { test } from '@playwright/test';
import { LinkedinLogin } from '../pages/linkedin/linkedinLoginApply.js';
import {LinkedinConfig } from '../utils/env.js';
import { navigateTo } from '../helpers/actions.js';

test('Linkedin Login', async ({ page, context }) => {
  const loginPage = new LinkedinLogin(page);

  // ✅ Load cookies if available
  await loginPage.loadCookies();

  // ✅ Open LinkedIn login page
  await loginPage.openLInkedin();

  // ✅ Login if not already logged in
  if (!page.url().includes('feed')) {
    await loginPage.login(LinkedinConfig.EMAIL, LinkedinConfig.PASSWORD);
  } else {
    console.log("✅ Login not required, cookies are valid");
  }
  console.log("✅ Navigation to Jobs page complete");
  await navigateTo(page,LinkedinConfig.JOB_FILTER_URL())
  // ✅ Optional: wait for page to stabilize or debug view
  await page.waitForTimeout(5000);
  const startPage = 0
  const jobIds = await page.$$eval('li[data-occludable-job-id]', elements =>
  elements
    .map(el => el.getAttribute('data-occludable-job-id'))
    .filter(Boolean) // removes nulls
);
console.log("Total Jobs Found:", jobIds.length);
console.log("Job IDs:", jobIds);
  

});
