import { getPayload } from 'payload';
import config from '../src/payload.config';

async function run() {
  console.log('Initializing Payload...');
  const payload = await getPayload({ config });

  console.log('Finding special pages with overrideAccess...');
  const res = await payload.find({
    collection: 'special-pages',
    overrideAccess: true,
  });

  console.log('Found documents:', res.docs.length);
  console.log('Documents list:', JSON.stringify(res.docs.map(d => ({ id: d.id, slug: d.slug, title: d.adminTitle })), null, 2));

  process.exit(0);
}

run().catch(console.error);
