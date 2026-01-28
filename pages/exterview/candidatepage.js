export class CandidatePage {
    constructor(page) {
        this.page = page
        this.cityInput = this.page.locator("(//button[@role='combobox'])[3]")
        this.typeCity = this.page.getByPlaceholder('Type a city…');
        this.selectOption = this.page.locator("(//div[@role='option'])[last()]")
        this.continueBtn = page.locator("//button[normalize-space()='Continue']");
        this.CTCInput = this.page.locator('//input[@placeholder="Enter CTC"]')
        this.type = this.page.locator("(//button[@role='combobox'])[2]")
        this.avatarIcon = page.locator("//div[@title='Avatar Interview']")
        this.goToJobBtn = page.locator("//button[normalize-space()='Go to Jobs']")
    }
    async avatarInterview() {
        await this.avatarIcon.click()
    }
    async uploadResume(filepath){
        await this.addResumeInput.setInputFiles(filepath)
    }
    async clickContinueBtn() {
        await this.continueBtn.click();
    }
    async uploadButtonClick(){
        await this.uploadBtn.click()
    }
    
    async selectCityOption() {
        const selectedValue = this.cityInput.locator("span").innerText();
        if (selectedValue != 'Select City' || selectedValue.trim() === '') {
            await this.cityInput.click()
            await this.typeCity.fill("Hyderabad, Telangana, India")
            await this.selectOption.click()
        }
        else {
            console.log(`Already selected: ${selectedValue} → skipping`);
        }
    }
    async enterCTC() {
        const selectedValue = await this.CTCInput.inputValue();
        console.log(selectedValue);

        if (!selectedValue || selectedValue === '') {
            await this.CTCInput.fill("10000")
        } else {
            console.log(`Already selected: ${selectedValue} → skipping`);

        }
    }
    async selectType() {
        const selectedValue = this.type.locator("span").innerText();
        if (!selectedValue || selectedValue.trim() === '') {
            console.log("No value selected → selecting Remote");

            await typeDropdown.click();
            await page.getByText("Remote", { exact: true }).click();
        } else {
            console.log(`Already selected: ${selectedValue} → skipping`);
        }
    }
    async addCandidateClick(){
        await this.addCandidate.click()
    }
    async gotoJobs(){
        await this.goToJobBtn.click();
    }

}