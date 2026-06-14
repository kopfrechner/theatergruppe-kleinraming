import fs from 'fs';
import path from 'fs';

async function globalSetup() {
  const envPath = '.env.local';
  const mockUrl = 'http://localhost:3333';
  
  // Backup existing .env.local if it exists
  if (fs.existsSync(envPath)) {
    fs.renameSync(envPath, '.env.local.bak');
  }

  fs.writeFileSync(envPath, `PUBLIC_DIRECTUS_URL=${mockUrl}\nNODE_ENV=test\n`);
  console.log('Set up .env.local with mock URL');
}

export default globalSetup;
