import { test, expect } from '@playwright/test';

const MOCK_API = 'http://localhost:3333';

test.describe.configure({ mode: 'serial' });

test.describe('Ticket Promotion States', () => {
  test.beforeAll(async ({ request }) => {
    // Warm up the server to avoid CONNECTION_REFUSED
    let retries = 5;
    while (retries > 0) {
      try {
        await request.get('http://localhost:4321/');
        break;
      } catch {
        retries--;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  });

  test('should show historical play fallback when ticket mode is inaktiv', async ({
    page,
    request,
  }) => {
    // Set mode via mock API
    await request.get(`${MOCK_API}/__set_mode?mode=inaktiv`);

    await page.goto('/', { waitUntil: 'networkidle' });

    // Check if the highlight tile shows the historical play from mock-api.ts
    const highlightTile = page.locator('.tile-next-play');
    await expect(highlightTile).toBeVisible();
    await expect(
      highlightTile.getByRole('heading', { level: 2 }),
    ).toContainText('Ein tolles altes Stück');
    await expect(highlightTile.locator('.play-status')).toContainText(
      'Rückblick',
    );

    // In 'inaktiv' mode, the Tickets page should redirect to home
    await page.goto('/tickets');
    await expect(page).toHaveURL('/');
  });

  test('should show preview content when ticket mode is vorab_reservierung', async ({
    page,
    request,
  }) => {
    await request.get(`${MOCK_API}/__set_mode?mode=vorab_reservierung`);

    await page.goto('/', { waitUntil: 'networkidle' });

    const highlightTile = page.locator('.tile-next-play');
    await expect(highlightTile).toBeVisible();
    await expect(
      highlightTile.getByRole('heading', { level: 2 }),
    ).toContainText('VORSCHAU: Sommernachtstraum');
    await expect(highlightTile.locator('.play-status')).toContainText(
      'Saison-Vorschau',
    );

    // Navigate to tickets page
    await page.goto('/tickets', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/tickets/);
    // Use a more specific selector for the title in tickets page
    await expect(page.locator('.flyer-title')).toContainText(
      'VORSCHAU: Sommernachtstraum',
    );
  });

  test('should show booking UI when ticket mode is ticket_promotion', async ({
    page,
    request,
  }) => {
    await request.get(`${MOCK_API}/__set_mode?mode=ticket_promotion`);

    await page.goto('/', { waitUntil: 'networkidle' });

    const highlightTile = page.locator('.tile-next-play');
    await expect(highlightTile).toBeVisible();
    await expect(
      highlightTile.getByRole('heading', { level: 2 }),
    ).toContainText('Hamlet');
    await expect(highlightTile.locator('.play-status')).toContainText(
      'Nächste Premiere',
    );

    await page.goto('/tickets', { waitUntil: 'networkidle' });
    await expect(page.locator('.flyer-title')).toContainText('Hamlet');
    await expect(page.locator('text=Online reservieren').first()).toBeVisible();
    await expect(
      page.locator('a[href="https://ticketlotse.test"]'),
    ).toBeVisible();
  });

  test('should show disabled reservation button when ticketlotse_link_aktiv is false', async ({
    page,
    request,
  }) => {
    await request.get(
      `${MOCK_API}/__set_mode?mode=ticket_promotion_inactive_link`,
    );

    await page.goto('/tickets', { waitUntil: 'networkidle' });

    // Based on src/pages/tickets.astro, line 222 shows "Online reservieren (inaktiv)"
    await expect(
      page.locator('text=Online reservieren (inaktiv)'),
    ).toBeVisible();
    // It should not be a functional link to ticketlotse
    await expect(
      page.locator('a[href="https://ticketlotse.test"]'),
    ).not.toBeVisible();
  });

  test('should show disabled reservation button when ticketlotse_link is missing', async ({
    page,
    request,
  }) => {
    await request.get(
      `${MOCK_API}/__set_mode?mode=ticket_promotion_missing_link`,
    );

    await page.goto('/tickets', { waitUntil: 'networkidle' });

    // Based on src/pages/tickets.astro line 209-224, if ticketlotse_link is null,
    // it falls back to the (inaktiv) block.
    await expect(
      page
        .locator('.flyer-sidebar')
        .locator('text=Online reservieren (inaktiv)'),
    ).toBeVisible();
    await expect(
      page.locator('.flyer-sidebar').locator('a.btn'),
    ).not.toBeVisible();
  });
});
