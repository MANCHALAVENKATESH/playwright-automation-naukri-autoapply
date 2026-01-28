export class DashboardPage {
    constructor(page) {
        this.page = page
        this.createJobBtn = page.locator("//button[normalize-space()='Create Job']")
        this.continueBtn = page.locator("//button[normalize-space()='Continue']");
        this.file = page.locator("//input[@type='file']")
        this.avatarIcon = page.locator("//div[@title='Avatar Interview']")
    }
    async avatarInterview(){
       await this.avatarIcon.click()
    }
    async createJob(){
        await this.createJobBtn.click();
    }
    async selectChoiceInterview(){
        await this.page.getByText('AI & Human Interview').click()
    }
    async clickContinueBtn(){
       await this.continueBtn.click()
    }
    async uploadFile(filepath){
        await this.file.setInputFiles(filepath)
    }

}