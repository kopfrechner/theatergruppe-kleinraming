import { createDirectus, rest, readSingleton, readItems, readItem } from '@directus/sdk';

const client = createDirectus('https://cms.kopfarbeit.dev').with(rest());

async function run() {
  try {
    const data = await client.request(
      readItem('startseite', {
        fields: ['emotionen_titel', 'emotionen_bild', 'impressionen_gallerie.*']
      })
    );
    console.log("readItem result:", data);
  } catch (e) {
    console.error("readItem error:", e.message);
  }
  
  try {
    const data = await client.request(
      readSingleton('startseite', {
        fields: ['emotionen_titel', 'emotionen_bild', 'impressionen_gallerie.*']
      })
    );
    console.log("readSingleton result:", data);
  } catch (e) {
    console.error("readSingleton error:", e.message);
  }
}
run();
