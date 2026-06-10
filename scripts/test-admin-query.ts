import { getPayload } from 'payload';
import config from '../src/payload.config';

async function run() {
  console.log('Initializing Payload...');
  const payload = await getPayload({ config });

  console.log('Fetching admin user...');
  const users = await payload.find({
    collection: 'users',
    limit: 1,
  });

  const admin = users.docs[0];
  if (!admin) {
    console.error('No admin user found!');
    process.exit(1);
  }
  console.log('Admin user found:', admin.email);

  console.log('Querying special pages as admin user...');
  const res = await payload.find({
    collection: 'special-pages',
    user: admin,
  });

  console.log('Found documents:', res.docs.length);
  console.log('Documents list:', JSON.stringify(res.docs.map(d => ({ id: d.id, slug: d.slug, title: d.adminTitle })), null, 2));

  process.exit(0);
}

run().catch(console.error);
