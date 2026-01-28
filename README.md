# Exterview End-to-End Automation Framework

This repository contains a complete end-to-end automation solution
designed to validate the **AI Avatar Interview flow** on the Exterview
platform.

The objective of this framework is to demonstrate real-world SDET skills including:
- OTP-based authentication  
- Email workflows (YOPmail)  
- File uploads  
- Multi-tab handling  
- End-to-end journey validation  
- Clean automation design using Page Object Model  
- Session reuse using storage state (cookies persistence)

------------------------------------------------------------------------

## Application Under Test

-   URL: https://app.exterview.ai/sign-in\
-   Interview Type: AI Avatar Interview\
-   Roles Covered: Recruiter & Candidate

------------------------------------------------------------------------

## Test Flow Automated

1. Login using email  
2. Fetch OTP dynamically from YOPmail inbox  
3. Validate successful navigation to dashboard  
4. Store authenticated session in storage state  
5. Create a new job with JD upload  
6. Configure interview type (Avatar Interview)  
7. Upload candidate resume  
8. Send candidate invitation  
9. Handle email-based candidate flow  
10. Validate candidate added to job  
11. Validate report availability

------------------------------------------------------------------------

## Tech Stack

-   Playwright\
-   Javascript\
-   Node.js\
-   Playwright Test Runner\
-   Page Object Model (POM)

------------------------------------------------------------------------

## Project Structure

exterview-automation/ - tests/ - /test-results - pages/ - utils/ - testdata/ -
playwright.config.ts - README.md

------------------------------------------------------------------------

## Setup Instructions

``` bash
npm install
npx playwright install
```

------------------------------------------------------------------------

## Run Tests

``` bash
npx playwright test
```

``` bash
npx playwright test --headed
```
## Session Handling (Storage State)

This framework uses Playwright's storageState feature to improve stability and speed.

After successful OTP login, session data (cookies & localStorage) is saved into:

/storage/exterview_auth .json


Subsequent tests reuse this authenticated session without performing login again.

This approach reflects real-world automation best practices.

------------------------------------------------------------------------

## Author

Venkatesh Manchala\
Software Engineer / SDET
