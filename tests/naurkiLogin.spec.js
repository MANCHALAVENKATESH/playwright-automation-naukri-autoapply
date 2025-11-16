import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { USERNAME, PASSWORD, JOB_FILTER, pagination, CV } from '../utils/env.js';
import { ApplyJob } from '../pages/ApplyJobs.js';
import { getText, sleep } from '../helpers/actions.js';
import { saveCSVReport } from '../utils/reports.js';

test.describe("Naukri Test Suite", () => {

  // ========================
  //      UPDATE PROFILE
  // ========================

  test('UpdateProfile', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loadCookies();
    await loginPage.openNaukri();

    if (!page.url().includes('mnjuser')) {
      await loginPage.login(USERNAME, PASSWORD);
    }

    await page.getByRole('img', { name: 'naukri user profile img' }).click();
    await page.getByRole('link', { name: 'View & Update Profile' }).click();
    await page.setInputFiles('input#attachCV', CV);

    await page.locator('#lazyResumeHead').getByText('editOneTheme').click();
    await page.getByRole('button', { name: 'Save' }).click();

    console.log("✅ Profile has been updated successfully");
  });


  // ========================
  //       APPLY JOBS
  // ========================

  test('ApplyJobs', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const applyJob = new ApplyJob(page);

    // Load cookies
    await loginPage.loadCookies();
    await loginPage.openNaukri();

    if (!page.url().includes('mnjuser')) {
      await loginPage.login(USERNAME, PASSWORD);
    }

    // Load job filter page
    await page.goto(JOB_FILTER, { waitUntil: 'load' });

    await page.waitForSelector('//div[@class="srp-jobtuple-wrapper"]//h2/a');

    console.log("🔍 Collecting jobs from all pages...");

    const totalJobs = await applyJob.getNumberOfJob();
    const totalPages = Math.ceil(totalJobs / 20);

    console.log(`🔢 Total Jobs: ${totalJobs}`);
    console.log(`📄 Total Pages: ${totalPages}`);

    // Main Loop
    for (let pageIndex = 1; pageIndex <= totalPages; pageIndex++) {

      const pageURL = pagination(pageIndex);
      await page.goto(pageURL, { waitUntil: 'load' });

      await page.waitForSelector('//div[@class="srp-jobtuple-wrapper"]//h2/a', { timeout: 30000 });

      const jobLinks = await page.$$eval(
        '//div[@class="srp-jobtuple-wrapper"]//h2/a',
        (elements) => elements.map((el) => el.getAttribute('href'))
      );

      console.log(`\n📌 Page ${pageIndex} → Found ${jobLinks.length} jobs\n`);

      for (let i = 0; i < jobLinks.length; i++) {
        const jobHref = jobLinks[i];
        if (!jobHref) continue;

        console.log(`➡ Visiting Job ${i + 1}: ${jobHref}`);

        await sleep(2000);
        await page.goto(jobHref, { waitUntil: 'load' });
        await sleep(2000);

        await applyJob.jobApplyButtonText(jobHref);
      }
    }

    console.log("📁 Saving CSV Report...");
    await saveCSVReport();

    console.log("🎉 Job application script completed successfully!");

  });

});
