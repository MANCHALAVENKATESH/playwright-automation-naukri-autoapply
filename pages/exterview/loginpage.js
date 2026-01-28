export class LoginPage {
    constructor(page) {
        this.page = page
        this.emailInput = page.locator('//*[@id="_r_0_-form-item"]');
        this.otpBoxes = page.locator("//input[@inputmode='numeric']");
        this.sendOtp = page.locator("//button[@type='submit']");
    }
    async enterEmail(email) {
        await this.emailInput.fill(email);
    }
    async sendOtpButton(){
        await this.sendOtp.click();
    }
    async enterOtp(otp) {
        for (let i = 0; i < otp.length; i++) {
            await this.otpBoxes.nth(i).fill(otp[i]);
        }
    }
}