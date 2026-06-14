import fs from 'fs';

async function globalTeardown() {
  const envPath = '.env.local';
  const backupPath = '.env.local.bak';

  if (fs.existsSync(envPath)) {
    fs.unlinkSync(envPath);
  }

  if (fs.existsSync(backupPath)) {
    fs.renameSync(backupPath, envPath);
  }
  
  console.log('Cleaned up .env.local');
}

export default globalTeardown;
