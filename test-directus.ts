import { createDirectus, rest, readSingleton, readItem } from '@directus/sdk';

const client = createDirectus('https://admin.theater-kleinraming.at').with(
  rest(),
);

async function run() {
  try {
    const data = await client.request(
      readItem(
        'startseite' as any,
        {
          fields: [
            'emotionen_titel',
            'emotionen_bild',
            'impressionen_gallerie.*',
          ],
        } as any,
      ),
    );
    console.log('readItem result:', data);
  } catch (e: any) {
    console.error('readItem error:', e.message);
  }

  try {
    const data = await client.request(
      readSingleton('startseite', {
        fields: [
          'emotionen_titel',
          'emotionen_bild',
          'impressionen_gallerie.*',
        ],
      }),
    );
    console.log('readSingleton result:', data);
  } catch (e: any) {
    console.error('readSingleton error:', e.message);
  }
}
run();
