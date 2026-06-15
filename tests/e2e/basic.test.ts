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
});

test.describe('Performance & Layout Stability (CLS)', () => {
  const pages = [
    { name: 'Startseite', path: '/' },
    { name: 'Stücke', path: '/stuecke' },
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
