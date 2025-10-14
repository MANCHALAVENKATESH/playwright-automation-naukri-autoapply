export async function click(page, selector) {
  let locator;
  if (typeof selector === 'string') {
    locator = page.locator(selector);
  } else if (selector.role) {
    locator = page.getByRole(selector.role, {
      name: selector.name,
      exact: selector.exact,
    });
  }
  await locator.click();
}

export async function fill(page, selector, value) {
  let locator;
  if (typeof selector === 'string') {
    locator = page.locator(selector);
  } else if (selector.role) {
    locator = page.getByRole(selector.role, {
      name: selector.name,
      exact: selector.exact,
    });
  }
  await locator.fill(value);
}
export async function implicitWait(ms) {
  console.log(`⏳ Waiting for ${ms / 1000} seconds...`);
  await new Promise((resolve) => setTimeout(resolve, ms));
}

// ✅ Get text content
export async function getText(page, selector) {
  let locator;
  if (typeof selector === 'string') {
    locator = page.locator(selector);
  } else if (selector.role) {
    locator = page.getByRole(selector.role, {
      name: selector.name,
      exact: selector.exact,
    });
  }
  return await locator.textContent();
}


export async function waitForText(page, text, timeout = 30000) {
  await page.waitForFunction(
    (t) => document.body.innerText.includes(t),
    text,
    { timeout }
  );
}
export async function waitForNavigation(page, timeout = 30000) {
  await page.waitForNavigation({ timeout });
}
