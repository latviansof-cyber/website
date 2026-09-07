import { bootstrapDocumentTypes, RbacService } from '@sonicjs-cms/core'
import { getPlatformProxy } from 'wrangler'

/**
 * Seed script to create/update admin users
 *
 * Admin credentials from .dev.vars:
 * - admin1_email / admin1_pass
 * - admin2_email / admin2_pass
 */

async function hashPassword(password) {
  const iterations = 100000
  const salt = new Uint8Array(16)
  crypto.getRandomValues(salt)
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const hashBuffer = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, keyMaterial, 256)
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('')
  const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
  return `pbkdf2:${iterations}:${saltHex}:${hashHex}`
}

function getAdminCredentials() {
  const admins = []
  
  // Check for admin1
  const admin1Email = (process.env.admin1_email || process.env.ADMIN1_EMAIL)?.trim().toLowerCase()
  const admin1Pass = (process.env.admin1_pass || process.env.ADMIN1_PASS)?.trim()
  if (admin1Email && admin1Pass) {
    admins.push({ email: admin1Email, password: admin1Pass })
  }
  
  // Check for admin2
  const admin2Email = (process.env.admin2_email || process.env.ADMIN2_EMAIL)?.trim().toLowerCase()
  const admin2Pass = (process.env.admin2_pass || process.env.ADMIN2_PASS)?.trim()
  if (admin2Email && admin2Pass) {
    admins.push({ email: admin2Email, password: admin2Pass })
  }
  
  // Fallback to single admin if no numbered vars found
  if (admins.length === 0) {
    const email = (process.env.admin_email || process.env.ADMIN_EMAIL || 'latviansof@gmail.com').trim().toLowerCase()
    const password = (process.env.admin_pass || process.env.ADMIN_PASS || 'SlavaUkraine@').trim()
    admins.push({ email, password })
  }
  
  return admins
}

async function seed() {
  const isRemote = process.argv.includes('--remote')
  const admins = getAdminCredentials()

  console.log(`Seeding ${admins.length} admin(s) (${isRemote ? 'REMOTE' : 'LOCAL'})...`)
  const passwordHash = await Promise.all(admins.map(a => hashPassword(a.password)))
  const nowMs = Date.now()

  if (isRemote) {
    const { execSync } = await import('child_process')
    const fs = await import('fs')
    const path = await import('path')

    let sql = ''
    admins.forEach((admin, idx) => {
      const adminId = `admin-user-${idx + 1}`
      sql += `
INSERT INTO auth_user (id, email, first_name, last_name, role, is_active, created_at, updated_at, name)
VALUES ('${adminId}', '${admin.email}', 'Admin', 'User', 'admin', 1, ${nowMs}, ${nowMs}, 'Admin User')
ON CONFLICT(email) DO UPDATE SET role = 'admin', is_active = 1, updated_at = ${nowMs};

INSERT INTO auth_account (id, user_id, account_id, provider_id, password, created_at, updated_at)
VALUES ('acc-${adminId}', '${adminId}', '${adminId}', 'credential', '${passwordHash[idx]}', ${nowMs}, ${nowMs})
ON CONFLICT(id) DO UPDATE SET password = '${passwordHash[idx]}', updated_at = ${nowMs};
`
    })
    
    const sqlPath = path.join(process.cwd(), 'scripts', 'seed-admin.sql')
    fs.writeFileSync(sqlPath, sql.trim())
    console.log(`[seed] Applying ${admins.length} admin user(s) to remote D1...`)
    admins.forEach(admin => console.log(`  - ${admin.email}`))
    execSync(`npx wrangler d1 execute DB --remote --file="${sqlPath}" -c wrangler.jsonc`, {
      stdio: 'inherit',
      env: process.env,
    })
    console.log('✓ Remote admin users seeded successfully!')
    return
  }

  const { env, dispose } = await getPlatformProxy({ configPath: 'wrangler.jsonc' })

  if (!env?.DB) {
    console.error('❌ Error: DB binding not found. Run migrations first: npm run db:migrate:local')
    process.exit(1)
  }

  console.log(`Seeding ${admins.length} admin user(s) locally...`)

  try {
    for (let i = 0; i < admins.length; i++) {
      const { email, password } = admins[i]
      const hash = passwordHash[i]
      console.log(`\n[${i + 1}/${admins.length}] Processing: ${email}`)

      // Check if admin user already exists
      const existing = await env.DB.prepare('SELECT id FROM auth_user WHERE email = ?').bind(email).first()

      let userId: string

      if (existing) {
        userId = existing.id as string
        console.log(`  ✓ User exists, updating password and admin role...`)

        const existingAccount = await env.DB.prepare(
          "SELECT id FROM auth_account WHERE user_id = ? AND provider_id = 'credential'"
        ).bind(userId).first()

        if (existingAccount) {
          await env.DB.prepare(
            "UPDATE auth_account SET password = ?, updated_at = ? WHERE id = ?"
          ).bind(hash, nowMs, existingAccount.id).run()
        } else {
          await env.DB.prepare(
            'INSERT INTO auth_account (id, user_id, account_id, provider_id, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
          ).bind(crypto.randomUUID(), userId, userId, 'credential', hash, nowMs, nowMs).run()
        }

        await env.DB.prepare(
          'UPDATE auth_user SET role = ?, is_active = 1, updated_at = ? WHERE id = ?'
        ).bind('admin', nowMs, userId).run()
      } else {
        userId = `admin-${nowMs}-${Math.random().toString(36).substr(2, 9)}`

        await env.DB.batch([
          env.DB.prepare(
            'INSERT INTO auth_user (id, email, first_name, last_name, role, is_active, created_at, updated_at, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
          ).bind(userId, email, 'Admin', 'User', 'admin', 1, nowMs, nowMs, 'Admin User'),
          env.DB.prepare(
            'INSERT INTO auth_account (id, user_id, account_id, provider_id, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
          ).bind(crypto.randomUUID(), userId, userId, 'credential', hash, nowMs, nowMs),
        ])
        console.log(`  ✓ User created`)
      }

      await bootstrapDocumentTypes(env.DB)
      const rbac = new RbacService(env.DB)
      await rbac.ensureSystemRbacSeed()
      await rbac.addUserRoleByName(userId, 'admin')
    }

    console.log(`\n✓ All ${admins.length} admin user(s) seeded successfully!`)
  } catch (error) {
    console.error('❌ Error seeding admin users:', error)
    await dispose()
    process.exit(1)
  }

  await dispose()
}

seed()
  .then(() => {
    console.log('✓ Seeding complete')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
