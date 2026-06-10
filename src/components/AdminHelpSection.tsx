'use client'

import React from 'react'
import styles from './AdminHelpSection.module.css'

export const AdminHelpSection = () => {
  return (
    <div className={styles.helpContainer}>
      <hr />
      <div className={styles.helpContent}>
        <h2>📖 Getting Started with the Admin Panel</h2>

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
              stored in R2 and served via CDN.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h3>Settings</h3>
          <ul>
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
              <strong>Drafts & Autosave</strong> — All content saves automatically as drafts. Click
              the "Publish" button to make content live on the website.
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
              <strong>Image Recommendations</strong> — Hero/Content blocks: 1200+ width. Events:
              1200 × 800+ landscape. Social sharing: 1200 × 630 exactly.
            </li>
            <li>
              <strong>URL Slugs</strong> — Use lowercase letters, numbers, and hyphens only (e.g.,
              <code>about-us</code>, <code>member-benefits</code>).
            </li>
            <li>
              <strong>SEO Fields</strong> — Optional on pages. Leave blank to auto-generate from
              English title and excerpt. Set <code>noIndex</code> to hide a page from search.
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
