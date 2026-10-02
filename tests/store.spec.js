const { test, expect } = require('@playwright/test');

async function login(page, password = 'secret_sauce') {
  await page.goto('/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
}

test('login, cart, removal, and logout', async ({ page }) => {
  await login(page);
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(page.locator('.inventory_item')).toHaveCount(6);
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  await page.locator('.shopping_cart_link').click();
  const item = page.locator('.cart_item');
  await expect(item).toHaveCount(1);
  await expect(item.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
  await expect(item.locator('.inventory_item_price')).toHaveText('$29.99');
  await expect(item.locator('.cart_quantity')).toHaveText('1');
  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
  await expect(page.locator('.cart_item')).toHaveCount(0);
  await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  await page.locator('#react-burger-menu-btn').click();
  await page.locator('#logout_sidebar_link').click();
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
});

test('wrong password is rejected', async ({ page }) => {
  await login(page, 'intentionally-wrong-password');
  await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  await expect(page).not.toHaveURL(/inventory\.html/);
});
