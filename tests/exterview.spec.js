import { expect, test } from '@playwright/test'
import { LoginPage } from '../pages/exterview/loginpage';
import { TestData } from '../utils/testdata';
import path from 'path';
import fs from 'fs'
import { YopmailPage } from '../pages/exterview/yopmail';
import { log } from 'console';
import { DashboardPage } from '../pages/exterview/dashboardpage';
import { CandidatePage } from '../pages/exterview/candidatepage';
import { JobDetailsPage } from '../pages/exterview/jobdetailspage';
import { JobInterviewPage } from '../pages/exterview/JobInterview';
const AUTH_FILE = path.resolve("storage/exterview_auth.json");
test.describe('Exterview Flow', () => {
    test('Exterview Login and Save Session', async ({ browser }) => {
        if (fs.existsSync(AUTH_FILE) && fs.statSync(AUTH_FILE).size > 0) {
            console.log('Auth already exists, skipping login');
            test.skip();
        }
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto("https://app.exterview.ai/sign-in");

        const loginPage = new LoginPage(page);
        await loginPage.enterEmail(TestData.recruiterEmail);
        await loginPage.sendOtpButton();

        const yopmailTab = await context.newPage();
        const yopmailPage = new YopmailPage(yopmailTab);
        await yopmailTab.goto('https://yopmail.com');

        const otp = await yopmailPage.getOtp(TestData.recruiterEmail);

        await page.bringToFront();
        await loginPage.enterOtp(otp);

        await page.waitForSelector('text=Dashboard', { timeout: 20000 });

        await context.storageState({ path: AUTH_FILE });

        await context.close();
    })
    test('Create Job', async ({ browser }) => {
        const context = await browser.newContext({
            storageState: AUTH_FILE,
        });
        await context.grantPermissions(
            ['microphone', 'camera', 'clipboard-read', 'clipboard-write'],
            { origin: 'https://app.exterview.ai' }
        );
        const page = await context.newPage();
        await page.goto('https://app.exterview.ai/admin/dashboard');
        await page.waitForTimeout(5000)
        const popupHeading = page.locator("text=What's new in Exterview");
        
        if (await popupHeading.isVisible({ timeout: 3000 }).catch(() => false)) {
            await page.keyboard.press('Escape');
        }

        await page.keyboard.press('Escape');
        await page.keyboard.press('Escape');
        const dashboardpage = new DashboardPage(page)
        await dashboardpage.createJob()
        await dashboardpage.selectChoiceInterview()
        await dashboardpage.clickContinueBtn()
        await dashboardpage.uploadFile(TestData.jdFile)
        await expect(page.locator('text=jd.pdf')).toBeVisible();
        await dashboardpage.clickContinueBtn()
        // await page.waitForTimeout(15000)
        // City
        const candidatePage = new CandidatePage(page);
        await candidatePage.selectCityOption();
        await candidatePage.enterCTC()
        await candidatePage.avatarInterview()
        await candidatePage.clickContinueBtn();
        // await page.waitForTimeout(15000)
        //add Questionaries
        await candidatePage.clickContinueBtn();
        await candidatePage.clickContinueBtn();
        await candidatePage.gotoJobs()
        //GO to Jobs
        const jobdetailspage = new JobDetailsPage(page)
        await jobdetailspage.addBtn()
        await jobdetailspage.uploadResume(TestData.resume)
        await jobdetailspage.uploadButtonClick()
        // await page.waitForTimeout(15000)
        //clipboard
        // await page.goto();
        const copylink = await jobdetailspage.copyLinkKeyboard()
        console.log(copylink);
        const interviewPage = await context.newPage()
        const jobinterview = new JobInterviewPage(interviewPage)
        await interviewPage.goto("https://app.exterview.ai/video-interview/69798827a56d79943660dd6f")
        await jobinterview.continueInterview()
        await interviewPage.waitForTimeout(3000)
        await jobinterview.captureOrRetake()
        await jobinterview.uplaodImageBtn()
        await jobinterview.startInterview();
        await jobinterview.endBtnClick()
        await jobinterview.rateInterview()
        await jobinterview.submitFeedback()
    })
})

