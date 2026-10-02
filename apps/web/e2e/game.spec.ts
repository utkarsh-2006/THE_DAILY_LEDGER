import { test, expect } from '@playwright/test';

test('vertical slice gameplay loop', async ({ page }) => {
  // Capture console errors to ensure no uncaught browser errors
  const errors: string[] = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  // 1. page loads
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // 2. board exists (Removed text assert since it changes dynamically based on turn)

  // 3. 40 spaces exist
  // Our spaces have id #00 to #39 or are inside the grid
  // We can count the spaces by looking for the elements with text like #00, #01, or looking for the grid children (minus center).
  // Actually, we can select the space elements by their class. We added `group` and `border-2 border-ink`
  // Count board space tiles — each has data-space attribute
  const boardSpaces = page.locator('[data-space]');
  await expect(boardSpaces).toHaveCount(40);

  // 4. Roll Dice exists
  const rollButton = page.locator('button:has-text("ROLL DICE")');
  await expect(rollButton).toBeVisible({ timeout: 10000 });

  // 5. clicking Roll Dice does not crash
  await rollButton.click();

  // 6. dice result appears in telegraph wire or via UI change
  // Wait for the Telegraph Wire to update with a "rolled" message
  await expect(page.locator('text=rolled')).toBeVisible({ timeout: 5000 });

  // 7. player position changes (and appropriate decision appears in sidebar)
  const buyButton = page.locator('button:has-text("BUY PROPERTY")');
  const passButton = page.locator('button:has-text("PASS / AUCTION")');
  const endTurnButton = page.locator('button:has-text("END TURN")');

  // Wait for a valid next action (we either landed on property, or end turn immediately available)
  await expect(buyButton.or(endTurnButton)).toBeVisible({ timeout: 5000 });

  if (await buyButton.isVisible()) {
      await buyButton.click();
  }

  // 8. next turn becomes active (after ending turn)
  await expect(endTurnButton).toBeVisible();
  await endTurnButton.click();

  // Wait for it to become P2's turn
  // P2 should not have "ROLL DICE" active because this page is connected as P1
  // Or actually, this is a local page so it connects as the first available player. 
  // We just ensure the turn completes.
  await expect(page.locator('text=Waiting for')).toBeVisible({ timeout: 5000 });

  // 9. no uncaught browser errors
  expect(errors).toHaveLength(0);
});
