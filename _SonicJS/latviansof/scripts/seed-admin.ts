import { bootstrapDocumentTypes, RbacService } from '@sonicjs-cms/core'
import { getPlatformProxy } from 'wrangler'

/**
 * Seed script to create initial admin user
 *
 * Admin credentials:
 * Email: latviansof@gmail.com
 * Password: [as entered during setup]
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

async function seed() {
  const isRemote = process.argv.includes('--remote')
  const email = (process.env.admin_email || process.env.ADMIN_EMAIL || 'latviansof@gmail.com').trim().toLowerCase()
  const password = (process.env.admin_pass || process.env.ADMIN_PASS || 'SlavaUkraine@').trim()

  console.log(`Seeding admin credentials (${isRemote ? 'REMOTE' : 'LOCAL'}) for: ${email}`)
  const passwordHash = await hashPassword(password)
  const nowMs = Date.now()

  if (isRemote) {
    const { execSync } = await import('child_process')
    const fs = await import('fs')
    const path = await import('path')

    const adminId = 'admin-user-01'
    const sql = `
INSERT INTO auth_user (id, email, first_name, last_name, role, is_active, created_at, updated_at, name)
VALUES ('${adminId}', '${email}', 'Admin', 'User', 'admin', 1, ${nowMs}, ${nowMs}, 'Admin User')
ON CONFLICT(email) DO UPDATE SET role = 'admin', is_active = 1, updated_at = ${nowMs};

INSERT INTO auth_account (id, user_id, account_id, provider_id, password, created_at, updated_at)
VALUES ('acc-${adminId}', '${adminId}', '${adminId}', 'credential', '${passwordHash}', ${nowMs}, ${nowMs})
ON CONFLICT(id) DO UPDATE SET password = '${passwordHash}', updated_at = ${nowMs};
`
    const sqlPath = path.join(process.cwd(), 'scripts', 'seed-admin.sql')
    fs.writeFileSync(sqlPath, sql.trim())
    console.log(`[seed] Applying admin seed to remote D1...`)
    execSync(`npx wrangler d1 execute DB --remote --file="${sqlPath}" -c wrangler.jsonc`, {
      stdio: 'inherit',
      env: process.env,
    })
    console.log('✓ Remote admin user seeded successfully!')
    return
  }

  const { env, dispose } = await getPlatformProxy({ configPath: 'wrangler.jsonc' })

  if (!env?.DB) {
    console.error('❌ Error: DB binding not found. Run migrations first: npm run db:migrate:local')
    process.exit(1)
  }

  console.log(`Seeding local admin credentials for: ${email}`)

  try {

    // Check if admin user already exists
    const existing = await env.DB.prepare('SELECT id FROM auth_user WHERE email = ?').bind(email).first()

    let userId: string

    if (existing) {
      userId = existing.id as string
      console.log(`✓ User ${email} already exists (id: ${userId}), updating password and admin role...`)

      const existingAccount = await env.DB.prepare(
        "SELECT id FROM auth_account WHERE user_id = ? AND provider_id = 'credential'"
      ).bind(userId).first()

      if (existingAccount) {
        await env.DB.prepare(
          "UPDATE auth_account SET password = ?, updated_at = ? WHERE id = ?"
        ).bind(passwordHash, nowMs, existingAccount.id).run()
      } else {
        await env.DB.prepare(
          'INSERT INTO auth_account (id, user_id, account_id, provider_id, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(crypto.randomUUID(), userId, userId, 'credential', passwordHash, nowMs, nowMs).run()
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
        ).bind(crypto.randomUUID(), userId, userId, 'credential', passwordHash, nowMs, nowMs),
      ])
    }

    await bootstrapDocumentTypes(env.DB)
    const rbac = new RbacService(env.DB)
    await rbac.ensureSystemRbacSeed()
    await rbac.addUserRoleByName(userId, 'admin')

    console.log('✓ Admin user created / updated successfully')
    console.log(`  Email: ${email}`)
    console.log(`  Role: admin`)
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
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
