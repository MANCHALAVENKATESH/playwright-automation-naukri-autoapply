import fs from 'fs';
import path from 'path';
import { LinkedinConfig } from '../../utils/env.js';
import { click, fill, implicitWait } from '../../helpers/actions.js';

const COOKIE_PATH = path.resolve('storage/linkedinCookies.json');

export class LinkedinLogin {
  constructor(page) {
    this.page = page;
  }

  emailTextbox = 'input#username';
  passwordTextbox = 'input#password';
  loginButton = '//button[@type="submit"]';

  async openLinkedin() {
    await this.page.goto(LinkedinConfig.LOGIN_URL, {
      timeout: 60000,
      waitUntil: 'load',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
  }

  async enterEmail(email) {
    await click(this.page, this.emailTextbox);
    await fill(this.page, this.emailTextbox, email);
  }

  async enterPassword(password) {
    await click(this.page, this.passwordTextbox);
    await fill(this.page, this.passwordTextbox, password);
  }

  async submit() {
    await click(this.page, this.loginButton);
  }

  async saveCookies() {
    const cookies = await this.page.context().cookies();
    fs.writeFileSync(COOKIE_PATH, JSON.stringify(cookies, null, 2));
    console.log('🍪 Cookies saved to', COOKIE_PATH);
  }

  async loadCookies() {
    if (fs.existsSync(COOKIE_PATH)) {
      try {
        const data = fs.readFileSync(COOKIE_PATH, 'utf-8');
        if (!data) return console.log('⚠️ Cookie file empty');

        const cookies = JSON.parse(data);
        await this.page.context().addCookies(cookies);
        console.log('🍪 Cookies loaded successfully');
        return true;
      } catch (err) {
        console.log('⚠️ Failed to load cookies:', err.message);
      }
    } else {
      console.log('⚠️ No cookie file found — fresh login needed');
    }
    return false;
  }

  async login(email, password) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.submit();
    await implicitWait(3000);
    await this.saveCookies();
  }



  async applyToJob(currentJobId) {
    console.log(`🚀 Applying to Job ID: ${currentJobId}`);


    const nextButton = this.page.locator("//button[@aria-label='Continue to next step']");
    const reviewButton = this.page.locator("//button[@aria-label='Review your application']");
    const submitButton = this.page.locator("//button[@aria-label='Submit application']");

    // 🔁 Loop until Review/Submit phase
    while (
      await nextButton.isVisible().catch(() => false) ||
      (await reviewButton.isVisible().catch(() => false))
    ) {
      console.log("➡️ Checking and filling fields in current step...");
      await this.fillFormFields();

      if (await reviewButton.isVisible().catch(() => false)) {
        console.log("📝 Clicking Review...");
        await this.page.waitForTimeout(1500);
        // 🔍 Recheck required fields inside Review modal
        console.log("🔍 Checking required fields in Review step...");
        await this.fillFormFields();
        await reviewButton.click();
        break; // exit after review
      } else if (await nextButton.isVisible().catch(() => false)) {
        console.log("➡️ Clicking Next...");
        await nextButton.click();
        await this.page.waitForTimeout(2000);
      } else {
        console.log("⚠️ No Next or Review button found. Exiting loop.");
        break;
      }
    }

    // 🚀 Submit final application
    if (await submitButton.isVisible().catch(() => false)) {
      console.log("🚀 Submitting application...");
      await submitButton.click();
    } else {
      console.log("⚠️ No Submit button visible!");
    }
  }

  // async fillFormFields() {
  //   const fields = await this.page.$$(
  //     "//div[contains(@class, 'artdeco-text-input--container') or contains(@class, 'jobs-easy-apply-form-element')] | //select | //fieldset[@data-test-form-builder-radio-button-form-component='true']"
  //   );

  //   for (const field of fields) {
  //        // 🔹 Handle input fields — fill only if EMPTY
  //     const input = await field.$("input");
  //     if (input) {
  //       const label = await field.$("label");
  //         const spanLabel = await field.$(
  //                 "xpath=preceding::span[contains(@class,'jobs-easy-apply-form-section__group-title')][1]"

  //         );

  //         let labelText = "";

  //         if (label) {
  //           const txt = await label.innerText();
  //           labelText = txt?.toLowerCase().trim();
  //         } else if (spanLabel) {
  //           const txt = await spanLabel.innerText();
  //           labelText = txt?.toLowerCase().trim();
  //         } else {
  //           labelText = ""; 
  //         }

  //         const value = await input.inputValue();


  //       if (!value || value.trim() === "") {
  //         console.log(`⚠️ Empty input found: ${labelText}`);

  //         if (labelText.includes("experience")) {
  //           await input.fill("3");
  //         } else if (labelText.includes("linkedin profile")) {
  //           await input.fill("https://www.linkedin.com/in/venkatesh967");
  //         } 
  //         else if(labelText.includes("location (city)")){
  //           await input.fill("Hyderabad, Telangana, India");
  //         }
  //         else if (
  //           labelText.includes("current salary") ||
  //           labelText.includes("current ctc")
  //         ) {
  //           await input.fill("800000");
  //         } else if (
  //           labelText.includes("expected salary") ||
  //           labelText.includes("expected ctc")
  //         ) {
  //           await input.fill("1400000");
  //         } else if (labelText.includes("notice period") || labelText.includes("days") || labelText.includes("join")) {
  //           await input.fill("30");
  //         } else if (labelText.includes("mobile")) {
  //           await input.fill("7288967072");
  //         }else if(labelText.includes("Headline")){
  //           await input.fill("Software Engineer | Java | MERN | Playwright & Appium Automation | AWS | Docker | Flutter Developer | Building Scalable & High-Quality Applications");
  //         }else if(labelText.includes("Summary")){
  //           await input.fill("I’m a Software Engineer with 3+ years of experience building, testing, and delivering scalable applications across Web, Mobile, and Backend ecosystems. I specialize in Java, MERN stack, Automation Testing, and Cloud services, with a strong focus on writing clean code and building reliable, high-quality applications.")
  //         }else if(labelText.includes("location")){
  //           await input.fill("Hyderabad")
  //         }
  //         else {
  //           await input.fill("Yes");
  //         }
  //       }

  //       continue; // skip to next field
  //     }

  //     // 🔹 Handle Dropdowns inside the same field
  //     const dropdown = await field.$("select");
  //     if (dropdown) {
  //         const label = await field.$("label");
  //        const labelText = (await label.innerText()).toLowerCase().trim();

  //       const currentValue = await dropdown.inputValue();

  //       if (!currentValue || currentValue.trim() === "") {
  //         console.log(`⚠️ Empty dropdown: ${labelText}`);

  //         if (labelText.includes("salary")) {
  //           await dropdown.selectOption({ index: 1 });
  //         } else if (labelText.includes("notice")) {
  //           const option = await dropdown
  //             .locator("option", { hasText: /30/ })
  //             .first()
  //             .getAttribute("value");
  //           await dropdown.selectOption(option);
  //         }
  //       }

  //       continue;
  //     }

  //     // 🔹 Handle Radio Buttons
  //     const radioYes = await field.$("//label[normalize-space()='Yes']");
  //     const radioNo = await field.$("//label[normalize-space()='No']");

  //     if (radioYes || radioNo) {
  //       const label = await field.$("label");
  //       const labelText = (await label.innerText()).toLowerCase().trim();

  //       console.log(`⚠️ Radio found: ${labelText}`);

  //       if (labelText.includes("18 years")) {
  //         await radioYes.click();
  //       } else if (labelText.includes("legally authorized")) {
  //         await radioYes.click();
  //       } else if (labelText.includes("sponsorship")) {
  //         await radioYes.click();
  //       } else if (labelText.includes("relatives")) {
  //         await radioNo.click();
  //       }
  //     }
  //   }
  // }
 async fillFormFields() {

  // ===========================================================
  // ✅ Corrected Field Locator — always captures label + field
  // ===========================================================
  const fields = await this.page.$$(
    "//div[contains(@class, 'artdeco-text-input--container') \
       or contains(@class, 'jobs-easy-apply-form-element') \
       or @data-test-text-entity-list-form-component] \
     | //fieldset[@data-test-form-builder-radio-button-form-component='true']"
  );

  for (const field of fields) {

    // ===========================================================
    // 0️⃣ COMMON — SAFE LABEL EXTRACTION
    // ===========================================================
    let labelText = "";
    try {
      const lbl1 = await field.$("label span[aria-hidden='true']");
      if (lbl1) {
        labelText = (await lbl1.innerText())?.toLowerCase().trim();
      } else {
        const lbl2 = await field.$("label");
        if (lbl2) {
          labelText = (await lbl2.innerText())?.toLowerCase().trim();
        }
      }
    } catch (e) {
      labelText = "";
    }

    // ===========================================================
    // 1️⃣ INPUT FIELDS
    // ===========================================================
    const input = await field.$("input");
    if (input) {
      const value = await input.inputValue();

      if (!value || value.trim() === "") {
        console.log(`⚠️ Empty Input: ${labelText}`);

        if (labelText.includes("experience")) {
          await input.fill("3");
        } else if (labelText.includes("linkedin profile")) {
          await input.fill("https://www.linkedin.com/in/venkatesh967");
        } else if (labelText.includes("location (city)")) {
          await input.fill("Hyderabad, Telangana, India");
        } else if (labelText.includes("current salary") || labelText.includes("current ctc")) {
          await input.fill("800000");
        } else if (labelText.includes("expected salary") || labelText.includes("expected ctc")) {
          await input.fill("1400000");
        } else if (labelText.includes("notice period") || labelText.includes("days") || labelText.includes("join")) {
          await input.fill("30");
        } else if (labelText.includes("mobile")) {
          await input.fill("7288967072");
        } else if (labelText.includes("headline")) {
          await input.fill(
            "Software Engineer | Java | MERN | Playwright & Appium Automation | AWS | Docker | Flutter Developer"
          );
        } else if (labelText.includes("summary")) {
          await input.fill(
            "Software Engineer with 3+ years of experience in Java, MERN, Automation Testing, and Cloud."
          );
        } else if (labelText.includes("location")) {
          await input.fill("Hyderabad");
        } else {
          await input.fill("Yes");
        }
      }

      continue;
    }

    // ===========================================================
    // 2️⃣ DROPDOWNS
    // ===========================================================
    const dropdown = await field.$("select");
    if (dropdown) {
      let currentValue = "";

      try {
        currentValue = await dropdown.inputValue();
      } catch {
        currentValue = "";
      }

      if (!currentValue || currentValue.trim() === "" || currentValue.toLowerCase().trim().includes("option") || currentValue.toLowerCase().trim().includes("select") || !currentValue.toLowerCase().trim().includes("yes") || !currentValue.toLowerCase().trim().includes("no")) {
        console.log(`⚠️ Empty Dropdown: ${labelText}`);

        if (labelText.includes("salary")) {
          await dropdown.selectOption({ index: 1 });
        } else if (labelText.includes("notice")) {
          const optionValue = await dropdown
            .locator("option", { hasText: /30|1 month/i })
            .first()
            .getAttribute("value");

          if (optionValue) await dropdown.selectOption(optionValue);
        } else {
          // default select 2nd option (1st is usually placeholder)
          const options = await dropdown.$$("option");
          if (options.length > 1) {
            const value = await options[1].evaluate(el => el.value);
            await dropdown.selectOption(value);
          }
        }
      }

      continue;
    }

    // ===========================================================
    // 3️⃣ RADIO BUTTONS
    // ===========================================================
    const radioYes = await field.$("//label[normalize-space()='Yes']");
    const radioNo = await field.$("//label[normalize-space()='No']");

    if (radioYes || radioNo) {
      console.log(`⚠️ Radio Field: ${labelText}`);

      if (labelText.includes("18 years")) {
        await radioYes.click();
      } else if (labelText.includes("legally authorized")) {
        await radioYes.click();
      } else if (labelText.includes("sponsorship")) {
        await radioYes.click();
      } else if (labelText.includes("relatives")) {
        await radioNo.click();
      } else {
        await radioYes.click();
      }

      continue;
    }
  }
}




  /**
   * ✅ Handle required fields appearing in Review modal
   */
  async handleReviewStep() {
    let missingFields = true;

    while (missingFields) {
      missingFields = false;

      const fields = await this.page.$$(
        "//div[contains(@class, 'artdeco-text-input--container') or contains(@class, 'jobs-easy-apply-form-element')]"
      );

      for (const field of fields) {
        const label = await field.$("label");
        if (!label) continue;

        const labelText = (await label.innerText()).toLowerCase().trim();
        const isRequired = labelText.includes("*");

        const input = await field.$("input");
        const dropdown = await field.$("select");
        const customDropdown = await field.$("button[aria-haspopup='listbox'], button[aria-expanded]");

        if (!isRequired) continue;

        // 🧩 Fill missing input
        if (input) {
          const value = await input.inputValue().catch(() => "");
          if (!value) {
            console.log(`⚠️ Filling missing input in Review: ${labelText}`);
            await input.fill("Yes");
            missingFields = true;
          }
        }

        // 🧩 Fill native dropdown
        if (dropdown) {
          const options = await dropdown.$$("option");
          const selected = await dropdown.inputValue().catch(() => "");
          if (options.length > 0 && (!selected || isRequired)) {
            console.log(`📋 Selecting dropdown in Review: ${labelText}`);
            try {
              await dropdown.selectOption({ label: "Yes" });
            } catch {
              await dropdown.selectOption({ index: 1 });
            }
            missingFields = true;
          }
        }

        // 🧩 Handle custom dropdowns in review modal
        if (customDropdown) {
          console.log(`📋 Handling custom dropdown in Review: ${labelText}`);
          await customDropdown.click();
          await this.page.waitForTimeout(500);

          const yesOption = this.page.locator("//span[normalize-space()='Yes']");
          if (await yesOption.isVisible().catch(() => false)) {
            await yesOption.click();
            console.log(`✅ Selected 'Yes' for ${labelText}`);
          } else {
            const firstOption = this.page.locator(
              "(//div[@role='option' or @role='menuitem'])[1]"
            );
            if (await firstOption.isVisible().catch(() => false)) {
              await firstOption.click();
              console.log(`⚙️ Selected first option for ${labelText}`);
            }
          }
          await this.page.waitForTimeout(500);
          missingFields = true;
        }
      }

      if (missingFields) {
        console.log("🔁 Some required fields were filled — rechecking...");
        await this.page.waitForTimeout(1000);
      }
    }
    console.log("✅ All required fields in Review step are filled!");
  }



}