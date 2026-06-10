import { getPayload } from 'payload';
import config from '../src/payload.config';
import { getPlatformProxy } from 'wrangler';

async function run() {
  console.log('Initializing Payload...');
  const payload = await getPayload({ config });

  console.log('Creating a special page...');
  const page = await payload.create({
    collection: 'special-pages',
    data: {
      adminTitle: 'Test Page',
      slug: 'test-page',
      en: {
        title: 'Test English',
        content: 'Test content',
      },
      lv: {
        title: 'Test Latvian',
        content: 'Testa saturs',
      },
      _status: 'published',
    },
  });

  console.log('Created page:', JSON.stringify(page, null, 2));

  // Now query SQLite directly to see where the data went
  const proxy = await getPlatformProxy();
  const db = proxy.env.D1 as any;
  
  const tables = ['special_pages', '_special_pages_v', 'payload_locked_documents', 'payload_locked_documents_rels'];
  for (const table of tables) {
    try {
      const res = await db.prepare(`SELECT * FROM \`${table}\`;`).all();
      console.log(`\nTable ${table}:`, JSON.stringify(res.results, null, 2));
    } catch (e) {
      console.error(`Error reading table ${table}:`, e);
    }
  }

  await proxy.dispose();
  process.exit(0);
}

run().catch(console.error);
