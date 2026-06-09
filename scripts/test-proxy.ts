import { getPlatformProxy } from 'wrangler';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
  console.log("CLOUDFLARE_API_TOKEN is set:", !!process.env.CLOUDFLARE_API_TOKEN);
  console.log("CLOUDFLARE_ACCOUNT_ID is set:", !!process.env.CLOUDFLARE_ACCOUNT_ID);
  
  try {
    const proxy = await getPlatformProxy({
      environment: undefined,
      persist: undefined,
      remoteBindings: true,
    });
    
    const d1 = proxy.env.D1;
    if (!d1) {
      console.log("D1 binding not found in proxy env!");
      return;
    }
    
    // Query payload_migrations
    const res = await d1.prepare("SELECT * FROM payload_migrations;").all();
    console.log("Migrations found through proxy:", res.results);
  } catch (err) {
    console.error("Error during proxy test:", err);
  }
}

run();
