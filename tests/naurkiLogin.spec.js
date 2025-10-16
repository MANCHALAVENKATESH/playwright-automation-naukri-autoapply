import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { USERNAME, PASSWORD, JOB_FILTER, pagination, CV } from '../utils/env.js';
import { ApplyJob } from '../pages/ApplyJobs.js';
import { getText } from '../helpers/actions.js';
import { saveCSVReport } from '../utils/reports.js';


test('Update Profile', async ({ page, context }) => {
    const loginPage = new LoginPage(page);
  // Load cookies if available
  await loginPage.loadCookies();

  // Open Naukri
  await loginPage.openNaukri();

  // Login only if cookies are not valid
  if (!page.url().includes('mnjuser')) {
    await loginPage.login(USERNAME, PASSWORD);
  } else {
    console.log("✅ Login not required, cookies are valid");
  }

  await page.getByRole('img', { name: 'naukri user profile img' }).click();
  await page.getByRole('link', { name: 'View & Update Profile' }).click();
  await page.setInputFiles('input#attachCV', CV);
  await page.locator('#lazyResumeHead').getByText('editOneTheme').click();
  await page.getByRole('button', { name: 'Save' }).click();
  })

test('Login to Naukri and fetch all job links', async ({ page, context }) => {
  const loginPage = new LoginPage(page);

  // Load cookies if available
  await loginPage.loadCookies();

  // Open Naukri
  await loginPage.openNaukri();

  // Login only if cookies are not valid
  if (!page.url().includes('mnjuser')) {
    await loginPage.login(USERNAME, PASSWORD);
  } else {
    console.log("✅ Login not required, cookies are valid");
  }

  // Go to Job Filter URL
  await page.goto(JOB_FILTER, { waitUntil: 'load' });

  // Wait for job listings to appear
  await page.waitForSelector('//div[@class="srp-jobtuple-wrapper"]//h2/a', { timeout: 30000 });

  // Create a Map to store index -> href
  const jobMap = new Map();

  // 🟢 First page job links
  const jobElements = await page.$$('//div[@class="srp-jobtuple-wrapper"]//h2/a');
  for (let i = 0; i < jobElements.length; i++) {
    const href = await jobElements[i].getAttribute('href');
    jobMap.set(i + 1, href);
  }

  console.log(`✅ Page 1: ${jobElements.length} jobs found`);

  // 🟢 Get total job count from ApplyJob class
  const applyJob = new ApplyJob(page);
  const countJobs = await applyJob.getNumberOfJob();

  console.log(`🔢 Total jobs across pages: ${countJobs}`);
    
  for (const [index, href] of jobMap.entries()) {
    console.log(`Job ${index} → ${href}`);
    await page.goto(href, { waitUntil: 'load' });
    await applyJob.jobApplyButtonText(href);  // assuming this is async
  }
  jobMap.clear()

  const pageNumLimit = Math.ceil(countJobs / 20);
  console.log(`📄 Total pages expected: ${pageNumLimit}`);

  // 🟢 Loop through pagination
  let currentIndex = jobElements.length;
  for (let pageNum = 2; pageNum <=3; pageNum++) {
    const nextPageURL = pagination(pageNum);
    await page.goto(nextPageURL, { waitUntil: 'load' });
    await page.waitForSelector('//div[@class="srp-jobtuple-wrapper"]//h2/a', { timeout: 30000 });

    const jobElementsPage = await page.$$('//div[@class="srp-jobtuple-wrapper"]//h2/a');
    for (let i = 0; i < jobElementsPage.length; i++) {
      const href = await jobElementsPage[i].getAttribute('href');
      jobMap.set(i + 1, href);
    }
    console.log(`✅ Page ${pageNum}: ${currentIndex} jobs added`);
    
     // Process each job (async safe)
  for (const [index, href] of jobMap.entries()) {
    console.log(`Job ${index} → ${href}`);
    await page.goto(href, { waitUntil: 'load' });
    await applyJob.jobApplyButtonText(href);  // assuming this is async
  }
    jobMap.clear()
  }
  
  console.log(`🎯 Total jobs collected: ${jobMap.size}`);
  console.log('🗺️ Job Map:', jobMap);
  await saveCSVReport()
});

