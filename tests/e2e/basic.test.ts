import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Theatergruppe Kleinraming - Basic Navigation', () => {
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

  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Theatergruppe Kleinraming/);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  });

  test('should navigate to theatermenschen', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Theatermenschen');
    await expect(page).toHaveURL(/\/theatermenschen/);
    await expect(page.getByRole('heading', { level: 1 }).first()).toContainText(
      'Mitglieder',
    );
  });

  test('should navigate to stuecke archive', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Stücke');
    await expect(page).toHaveURL(/\/stuecke/);
    await expect(page.getByRole('heading', { level: 1 }).first()).toContainText(
      'Bisherige Stücke',
    );
  });

  test('should navigate to and load piece detail page with cast and fallback photo', async ({
    page,
  }) => {
    await page.goto('/stuecke/altes-stueck');
    await expect(page.getByRole('heading', { level: 1 }).first()).toContainText(
      'Ein tolles altes Stück',
    );
    await expect(page.getByRole('heading', { level: 3 }).first()).toContainText(
      'Besetzung',
    );

    // Check for Max Mustermann (uses spieler_foto)
    await expect(page.locator('text=Max Mustermann')).toBeVisible();
    await expect(page.locator('text=Hauptrolle')).toBeVisible();
    await expect(page.locator('text=Ein wichtiger Charakter')).toBeVisible();

    // Check Erika Musterfrau (uses fallback photo)
    await expect(page.locator('text=Erika Musterfrau')).toBeVisible();
    await expect(page.locator('text=Nebenrolle')).toBeVisible();
    await expect(page.locator('text=Ein netter Nachbar')).toBeVisible();

    // Verify both cast member photos are rendered (images using the mock IDs)
    const photos = page.locator('img.cast-photo');
    await expect(photos).toHaveCount(2);

    const src1 = await photos.nth(0).getAttribute('src');
    expect(src1).toContain('special-role-photo'); // verifies that spieler_foto is used when present

    const src2 = await photos.nth(1).getAttribute('src');
    expect(src2).toContain('erika-photo'); // verifies that fallback photo is used when spieler_foto is null
  });
});

test.describe('Performance & Layout Stability (CLS)', () => {
  const pages = [
    { name: 'Startseite', path: '/' },
    { name: 'Stücke', path: '/stuecke' },
    { name: 'Stück Details', path: '/stuecke/altes-stueck' },
    { name: 'Theatermenschen', path: '/theatermenschen' },
    { name: 'Tickets', path: '/tickets' },
    { name: 'Mitwirken', path: '/mitmachen' },
    { name: 'Sponsoren', path: '/sponsoren' },
  ];

  for (const pageInfo of pages) {
    test(`should have a low CLS score on ${pageInfo.name}`, async ({
      page,
      request,
    }) => {
      // Ensure we are in a mode where the page exists (for tickets)
      const MOCK_API = 'http://localhost:3333';
      await request.get(`${MOCK_API}/__set_mode?mode=ticket_promotion`);

      await page.goto(pageInfo.path, { waitUntil: 'networkidle' });

      // Evaluate CLS
      const cls: number = await page.evaluate(() => {
        return new Promise((resolve) => {
          let cumulativeLayoutShiftScore = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                cumulativeLayoutShiftScore += (entry as any).value;
              }
            }
          });
          observer.observe({ type: 'layout-shift', buffered: true });

          // Wait a bit to capture shifts
          setTimeout(() => {
            observer.disconnect();
            resolve(cumulativeLayoutShiftScore);
          }, 1500); // Wait slightly longer to be sure
        });
      });

      console.log(`CLS Score for ${pageInfo.name}: ${cls}`);
      expect(cls).toBeLessThan(0.1);
    });
  }
});
