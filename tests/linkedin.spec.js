import { test } from '@playwright/test';
import { LinkedinLogin } from '../pages/linkedin/linkedinLoginApply.js';
import { LinkedinConfig, pagination } from '../utils/env.js';
import { navigateTo } from '../helpers/actions.js';

test('LinkedIn Easy Apply Automation', async ({ page, context }) => {
  const loginPage = new LinkedinLogin(page);

  // ✅ Load cookies if available
  await loginPage.loadCookies();

  // ✅ Open LinkedIn
  await loginPage.openLinkedin();

  // ✅ Login if not already logged in
  if (!page.url().includes('feed')) {
    await loginPage.login(LinkedinConfig.EMAIL, LinkedinConfig.PASSWORD);
  } else {
    console.log("✅ Login not required — valid cookies detected");
  }

  // ✅ Navigate to Jobs page
  await navigateTo(page, LinkedinConfig.JOBS_URL);

  // ✅ Get first job link
  const href = await page
    .locator('//div[contains(@class,"job-card-list__entity-lockup")]//a[contains(@class,"job-card-container__link")]')
    .first()
    .getAttribute('href');

  const jobId = href?.match(/currentJobId=(\d+)/)?.[1];
  console.log("🆔 Extracted Job ID:", jobId);

  await navigateTo(page, LinkedinConfig.JOB_FILTER_URL(jobId));
  await page.waitForTimeout(5000);

  // ✅ Collect job IDs
  const jobIds = await page.$$eval('li[data-occludable-job-id]', els =>
    els.map(el => el.getAttribute('data-occludable-job-id')).filter(Boolean)
  );

  console.log("💼 Jobs Found:", jobIds.length);

  // ✅ Loop through job pages
  for (let j = 1; j <= 30; j++) {
    const jobPageStart = j * 25;

    for (let i = 0; i < jobIds.length; i++) {
      const currentJobId = jobIds[i];
      const jobUrl = LinkedinConfig.CURRENT_JOB_URL(currentJobId);
      console.log(`\n🔍 Processing Job ${i + 1}/${jobIds.length}: ${currentJobId}`);

      await navigateTo(page, jobUrl);
      await loginPage.applyToJob(currentJobId);
    }

    await page.waitForTimeout(5000);
    await pagination(jobPageStart);
  }
});
