'use client'

import React from 'react'
import styles from './AdminHelpSection.module.css'

export const AdminHelpSection = () => {
  return (
    <div className={styles.helpContainer}>
      <hr />
      <div className={styles.helpContent}>
        <h2>Getting Started with the Admin Panel</h2>

        <section className={styles.section}>
          <h3>Available Collections</h3>
          <ul>
            <li>
              <strong>Pages</strong> — Create and edit the website's main editorial pages with
              bilingual English/Latvian content. Add blocks (Hero, Content, Call to Action) to
              customize page layouts. Set SEO fields and publish when ready.
            </li>
            <li>
              <strong>Events</strong> — Manage event listings with titles, descriptions, accent
              colors, and images. Track event visibility with draft/publish status.
            </li>
            <li>
              <strong>Media</strong> — Upload images with alt text for accessibility. Images are
              stored in the configured Cloudflare R2 bucket.
            </li>
            <li>
              <strong>Users</strong> — Manage administrator accounts. This project currently uses
              one authenticated user type without separate editor roles.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h3>Settings</h3>
          <ul>
            <li>
              <strong>Homepage</strong> — Edit the bilingual hero, hero buttons, background image,
              and Events section heading and introduction.
            </li>
            <li>
              <strong>Main Menu</strong> — Configure the website header navigation. Add bilingual
              menu labels and customize links for internal pages or external URLs.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h3>Quick Tips</h3>
          <ul>
            <li>
              <strong>Drafts & Autosave</strong> — Pages and Events support drafts, autosave, and
              publishing. Homepage, Main Menu, and Media changes save directly.
            </li>
            <li>
              <strong>Bilingual Editing</strong> — Toggle between English and Latvian tabs to edit
              both languages independently.
            </li>
            <li>
              <strong>Block Builder</strong> — On pages, use blocks to compose layouts flexibly.
              Drag to reorder, add multiple instances, or delete as needed.
            </li>
            <li>
              <strong>Image Recommendations</strong> — Hero and Content blocks: at least 1200 pixels
              wide. Events: 1200 × 800 or larger landscape images. Social sharing: 1200 × 630.
            </li>
            <li>
              <strong>URL Slugs</strong> — Use lowercase letters, numbers, and hyphens only (e.g.,
              <code>about-us</code>, <code>member-benefits</code>).
            </li>
            <li>
              <strong>SEO Fields</strong> — Optional on pages. Leave blank to auto-generate from
              English title and excerpt. Set <code>noIndex</code> to hide a page from search.
            </li>
            <li>
              <strong>Ordering</strong> — Page order controls homepage cards, Event order controls
              event cards, and Main Menu order controls header navigation.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h3>Need Help?</h3>
          <p>
            For questions about how to edit content, refer to the tips above. For technical issues,
            contact a developer.
          </p>
        </section>
      </div>
    </div>
  )
}
