import { getPayload } from 'payload';
import config from '../src/payload.config';

async function updateDonationSettings() {
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

  try {
    console.log('Updating donation-settings global...');
    const result = await payload.updateGlobal({
      slug: 'donation-settings',
      data: {
        en: {
          bankName: 'Bendigo Bank',
          bsb: '633-000',
          accountNumber: '210814547',
          accountName: 'Latvian Association of Darwin',
          payId: 'support@latviansofdarwin.org.au',
          instructions: 'Direct bank transfers and PayID payments carry no processing fees. 100% of donations go to our programs. We can issue a receipt on request. Email us with your transfer details.',
        },
        lv: {
          bankName: 'Bendigo Bank',
          bsb: '633-000',
          accountNumber: '210814547',
          accountName: 'Latvian Association of Darwin Inc',
          payId: 'support@latviansofdarwin.org.au',
          instructions: 'Tiešie bankas pārskaitījumi un PayID maksājumi neprasa apstrādes maksas. 100% ziedojumu nonāk mūsu programmās. Mēs varam izsniegt kvīti pēc pieprasījuma. Nosūtiet mums e-pastu ar pārskaitījuma detaļām.',
        },
      },
      user: admin,
    });

    console.log('Donation settings updated successfully!');
    console.log('Updated data:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error updating donation settings:', error);
    process.exit(1);
  }

  process.exit(0);
}

updateDonationSettings().catch(console.error);
