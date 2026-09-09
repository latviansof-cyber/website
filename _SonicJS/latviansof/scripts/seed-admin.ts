import { bootstrapDocumentTypes, RbacService } from '@sonicjs-cms/core'
import { getPlatformProxy } from 'wrangler'
import fs from 'fs'
import path from 'path'

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
  const devVarsPath = path.join(process.cwd(), '.dev.vars')
  let devVars: Record<string, string> = {}
  if (fs.existsSync(devVarsPath)) {
    const lines = fs.readFileSync(devVarsPath, 'utf8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx !== -1) {
        const key = trimmed.substring(0, eqIdx).trim()
        let val = trimmed.substring(eqIdx + 1).trim()
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1)
        }
        devVars[key] = val
      }
    }
  }

  const getEnv = (key: string) => process.env[key] || devVars[key]

  const admins: Array<{ email: string; password: string; id: string }> = []

  const admin1Email = (getEnv('admin1_email') || getEnv('ADMIN1_EMAIL') || 'latviansof@gmail.com').trim().toLowerCase()
  const admin1Pass = (getEnv('admin1_pass') || getEnv('ADMIN1_PASS') || 'SlavaUkraine@').trim()
  admins.push({ id: 'admin-user-1', email: admin1Email, password: admin1Pass })

  const admin2Email = (getEnv('admin2_email') || getEnv('ADMIN2_EMAIL') || 'latviansofdarwin@gmail.com').trim().toLowerCase()
  const admin2Pass = (getEnv('admin2_pass') || getEnv('ADMIN2_PASS') || 'PriceOfFreedom!@12').trim()
  admins.push({ id: 'admin-user-2', email: admin2Email, password: admin2Pass })

  // Also support the 'darmin' typo alias if admin2Email is darwin
  if (admin2Email.includes('darwin')) {
    const aliasEmail = admin2Email.replace('darwin', 'darmin')
    admins.push({ id: 'admin-user-3', email: aliasEmail, password: admin2Pass })
  } else if (admin2Email.includes('darmin')) {
    const aliasEmail = admin2Email.replace('darmin', 'darwin')
    admins.push({ id: 'admin-user-3', email: aliasEmail, password: admin2Pass })
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

    let sql = 'PRAGMA foreign_keys = OFF;\n'
    
    admins.forEach((admin, idx) => {
      const adminId = admin.id
      const hash = passwordHash[idx]
      // Delete any previous account/user by id or email
      sql += `DELETE FROM auth_account WHERE user_id = '${adminId}';\n`
      sql += `DELETE FROM auth_user WHERE id = '${adminId}' OR email = '${admin.email}';\n`
      sql += `INSERT INTO auth_user (id, email, first_name, last_name, role, is_active, created_at, updated_at, name) VALUES ('${adminId}', '${admin.email}', 'Admin', 'User', 'admin', 1, ${nowMs}, ${nowMs}, 'Admin User');\n`
      sql += `INSERT INTO auth_account (id, user_id, account_id, provider_id, password, created_at, updated_at) VALUES ('acc-${adminId}', '${adminId}', '${adminId}', 'credential', '${hash}', ${nowMs}, ${nowMs});\n`
      // RBAC user role in documents
      sql += `DELETE FROM documents WHERE id = 'rbac-user-${adminId}' OR (type_id = 'rbac_user_roles' AND slug = '${adminId}');\n`
      sql += `INSERT INTO documents (id, root_id, type_id, type_version, version_number, is_current_draft, is_published, status, parent_root_id, slug, title, sort_order, visible, tenant_id, locale, translation_group_id, data, metadata, created_at, updated_at) VALUES ('rbac-user-${adminId}', 'rbac-user-${adminId}', 'rbac_user_roles', 1, 1, 1, 1, 'published', '', '${adminId}', 'Admin User Role', 0, 1, 'default', 'default', '', '{"roleIds":["role-admin"]}', '{}', ${nowMs}, ${nowMs});\n`
    })

    // Ensure quill-editor plugin is active in documents
    sql += `INSERT OR REPLACE INTO documents (id, root_id, type_id, type_version, version_number, is_current_draft, is_published, status, parent_root_id, slug, title, sort_order, visible, tenant_id, locale, translation_group_id, data, metadata, created_at, updated_at) VALUES ('plugin-quill-editor', 'plugin-quill-editor', 'plugin', 1, 1, 1, 1, 'published', '', 'quill-editor', 'Quill Rich Text Editor', 0, 1, 'default', 'default', '', '{"name":"quill-editor","displayName":"Quill Editor","description":"Quill rich text editor integration for SonicJS.","version":"1.0.0","author":"SonicJS Team","category":"editor","icon":"✒️","status":"active","isCore":false,"settings":{"defaultHeight":300,"defaultToolbar":"full","placeholder":"Enter content..."},"permissions":[],"dependencies":[],"downloadCount":0,"rating":0,"activatedAt":1788775630,"errorMessage":null}', '{}', ${nowMs}, ${nowMs});\n`
    
    sql += 'PRAGMA foreign_keys = ON;\n'
    
    const sqlPath = path.join(process.cwd(), 'scripts', 'seed-admin.sql')
    fs.writeFileSync(sqlPath, sql.trim())
    console.log(`[seed] Applying ${admins.length} admin user(s) to remote D1...`)
    admins.forEach(admin => console.log(`  - ${admin.email} (${admin.id})`))
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
