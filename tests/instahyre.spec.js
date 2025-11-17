import { test } from '@playwright/test';
import path from 'path';
import { utils } from '../utils/constants';
import { Instahyre } from '../pages/instahyre';
import { EnvInstaHyre } from '../utils/env.js';
import { log } from 'console';
import { navigateTo } from '../helpers/actions.js';

const COOKIE_PATH = path.resolve("storage/instahyreCookies.json");
test('Instahyre Login', async ({ page }) => {
    const instahyre = new Instahyre(page);
    await utils.loadCookies(COOKIE_PATH)
    await instahyre.openInstaHyreLogin()
    if (!page.url().includes('/candidate/opportunities')) {
        await instahyre.login(EnvInstaHyre.INSTAHYRE_EMAIL, EnvInstaHyre.INSTAHYRE_PASSWORD)
    } else {
        console.log("✅ Login not required — valid cookies detected");
    }
    await page.waitForTimeout(5000)
    await navigateTo(page, EnvInstaHyre.JOB_URL)
    await page.waitForTimeout(5000)
    await page.locator('//*[@id="interested-btn"]').first().click()
    await page.locator("//button[contains(@class,'new-btn') and contains(@class,'btn-primary')]").first().click()
    const modalClose = await page.locator('.application-modal-close').first();
    const applyBtn = await page.locator("//button[normalize-space()='Apply']").first();
    const bulkModal = await page.locator("//h4[contains(text(),'Want to apply to other similar jobs')]/ancestor::div[contains(@class,'application-modal-wrap')]");

    // Wait max 20 seconds for any modal to appear
    await page.waitForSelector('.application-modal-close', { timeout: 20000 }).catch(() => { });

    while (await modalClose.isVisible()) {

        // check if Apply button exists AND is enabled
        if (await applyBtn.isVisible()) {
            const isEnabled = await applyBtn.isEnabled();

            if (isEnabled) {
                await applyBtn.click();
                console.log("Clicked Apply");
            } else {
                console.log("⚠ Apply button disabled — breaking loop");
                break; // stop infinite loop
            }
        }

        // Handle Bulk Apply Modal
        if (await bulkModal.isVisible()) {
            const isEnabledBulk = await applyBtn.isEnabled();
            if (isEnabledBulk) {
                await applyBtn.click();
                console.log("Clicked Bulk Apply");
            } else {
                console.log("⚠ Bulk Apply disabled — breaking");
            }
        }

        await page.waitForTimeout(1500);
    }

})