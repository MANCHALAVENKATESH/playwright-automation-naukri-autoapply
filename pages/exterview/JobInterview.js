export class JobInterviewPage {
    constructor(page) {
        this.page = page
        this.continueInterviewBtn = this.page.locator("//button[normalize-space()='Continue to the interview']")
        this.capture = this.page.locator("//button[normalize-space()='Capture']")
        this.uplaodImage = this.page.locator("//button[normalize-space()='Upload Image']")
        this.startInterviewBtn = this.page.locator("//button[normalize-space()='Start Interview']")
        this.rate = this.page.locator('//button[@aria-label="Rate 5 out of 5"]')
        this.endBtn = this.page.locator("//button[normalize-space()='End']")
        this.submitFeebackBtn = this.page.locator("//button[normalize-space()='Submit Feedback']")
        this.retake = this.page.locator("//button[normalize-space()='Re-take']")
    }
    async continueInterview() {
        await this.continueInterviewBtn.click()
    }
  async captureOrRetake() {
    if (await this.retake.isVisible()) {
        await this.retake.click();
    } else {
        await this.capture.click();
    }
}

    async uplaodImageBtn() {
        await this.uplaodImage.click()
    }
    async startInterview() {
        await this.startInterviewBtn.click()
        await this.page.waitForTimeout(20 * 1000);

    }
    async submitFeedback(){
        await this.submitFeebackBtn.click()
    }
    async rateInterview(){
        await this.rate.click()
    }
    async endBtnClick() {
        await this.page.waitForTimeout(90 * 1000);
        await this.endBtn.click()
    }
}