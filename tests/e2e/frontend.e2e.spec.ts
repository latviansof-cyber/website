import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/Latvian Association of Darwin/)
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible()
  })

  test('can navigate to about page', async ({ page }) => {
    await page.goto('http://localhost:3000/about')
    await expect(page).toHaveTitle(/About/)
    const heading = page.locator('h1').first()
    await expect(heading).toHaveText(/About/)
  })
})
