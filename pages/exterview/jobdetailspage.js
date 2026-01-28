export class JobDetailsPage {
    constructor(page) {
        this.page = page
        this.addCandidate = page.locator("//button[normalize-space()='Add']")
        this.addResumeInput = page.locator("//input[@type='file']")
        this.uploadBtn = page.locator("//button[normalize-space()='Upload']")
        this.copyLink = page.locator("//td[@class='p-2 whitespace-nowrap'][2]")
    }
    async copyLinkKeyboard() {
        await this.copyLink.click();
        await this.page.waitForTimeout(500); // small wait helps clipboard stabilize
        const copiedText = await this.page.evaluate(() => navigator.clipboard.readText());
        console.log("Copied Link:", copiedText);
        return copiedText;
    }
    async addBtn() {
        await this.addCandidate.click()
    }
    async uploadButtonClick() {
        await this.uploadBtn.click()
    }
    async uploadResume(filepath) {
        await this.addResumeInput.setInputFiles(filepath)
    }
}