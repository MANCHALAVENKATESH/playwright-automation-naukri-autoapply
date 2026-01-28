export class YopmailPage {
    constructor(page) {
        this.page = page;
        this.loginInput = page.locator('#login');
        this.sendButton = page.locator('#refreshbut button');
        this.refreshBtn = page.locator('#refresh');
    }

    async getOtp(email) {
        await this.page.goto('https://yopmail.com');
        await this.loginInput.fill(email);
        await this.sendButton.click();

        const inboxFrame = this.page.frameLocator('#ifinbox');
        const mailFrame = this.page.frameLocator('#ifmail');

        let otp;
        await this.refreshBtn.click();

        try {
            const firstMail = inboxFrame.locator('button.lm').first();
            await firstMail.waitFor({ timeout: 2000 });
            await firstMail.click();

            const otpLocator = mailFrame.locator('strong');
            await otpLocator.waitFor({ timeout: 3000 });

            otp = await otpLocator.textContent();
            if (otp) return otp.trim();
        } catch (e) {
            await this.page.waitForTimeout(1000);
        }
    }
}
