import { getPayload } from 'payload';
import config from '../src/payload.config';
import { sql } from 'drizzle-orm';

async function run() {
  console.log('Initializing Payload...');
  const payload = await getPayload({ config });
  const db = payload.db.drizzle;

  // Let's print the table names and schema metadata from Drizzle
  console.log('Drizzle tables:');
  const tables = Object.keys(payload.db.tables || {});
  console.log(tables);

  const specialPagesTable = (payload.db.tables as any)['special_pages'];
  if (!specialPagesTable) {
    console.error('special_pages table not found in Drizzle!');
    return;
  }

  console.log('Querying special_pages using Drizzle select...');
  const query = db.select().from(specialPagesTable);
  const sqlQuery = query.toSQL();
  console.log('SQL Query:', sqlQuery.sql);
  console.log('SQL Params:', sqlQuery.params);

  const results = await query;
  console.log('Drizzle results length:', results.length);
  console.log('Drizzle results:', JSON.stringify(results.map(r => ({ id: r.id, slug: r.slug, status: r._status || r.status })), null, 2));

  process.exit(0);
}

run().catch(console.error);
