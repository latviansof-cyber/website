import { getPayload } from 'payload';
import config from '../src/payload.config';

async function run() {
  console.log('Initializing Payload...');
  const payload = await getPayload({ config });
  const db = payload.db.drizzle;

  const versionsTable = (payload.db.tables as any)['_special_pages_v'];

  console.log('Inserting version for About page (id: 4)...');
  await db.insert(versionsTable).values({
    id: 2, // 1 is already taken by the test page (id: 5)
    parent_id: 4,
    version_admin_title: 'About the Association',
    version_slug: 'about',
    version_en_title: 'About the Association',
    version_en_content: 'The Latvian Association of Darwin...',
    version_lv_title: 'Par apvienību',
    version_lv_content: 'Dārvinas Latviešu Apvienība ir...',
    version_updated_at: new Date().toISOString(),
    version_created_at: new Date().toISOString(),
    version__status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    latest: 1,
    autosave: 0,
  });

  console.log('Finding special pages now...');
  const res = await payload.find({
    collection: 'special-pages',
    draft: true,
  });

  console.log('Found documents:', res.docs.length);
  console.log('Documents list:', JSON.stringify(res.docs, null, 2));

  process.exit(0);
}

run().catch(console.error);
