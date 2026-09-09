/**
 * Production Tailwind Configuration and Visual Tokens
 * Exact match with _Payload/src/app/(frontend)/globals.css
 */

export const siteStyles = `
  :root {
    --font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    --font-serif: 'Lora', Georgia, 'Times New Roman', serif;
    --color-ink: #1e1b26;
    --color-ink-light: #2d2938;
    --color-cream: #fdfaf6;
    --color-sunset-orange: #f97316;
    --color-sunset-red: #be123c;
    --color-sunset-gold: #fbbf24;
    --color-sunset-peach: #ffedd5;
    --color-latvian-red: #7a2231;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
  }

  body {
    font-family: var(--font-sans);
    color: var(--color-ink);
    background-color: var(--color-cream);
  }

  ::selection {
    background: var(--color-sunset-gold);
    color: var(--color-ink);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-serif);
    letter-spacing: -0.01em;
  }

  .glass-panel {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  }

  .glass-panel-dark {
    background: rgba(30, 27, 38, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  .glass-panel-latvian {
    background: rgba(122, 34, 49, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 25px 50px -12px rgba(122, 34, 49, 0.3);
  }

  .text-glow {
    text-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
  }

  .text-glow-orange {
    text-shadow: 0 0 20px rgba(249, 115, 22, 0.4);
  }

  /* Rich text styles for content pages */
  .prose-custom p {
    margin-bottom: 1.25rem;
    line-height: 1.8;
    font-size: 1.125rem;
  }

  .prose-custom h2 {
    font-family: var(--font-serif);
    font-size: 1.75rem;
    font-weight: 700;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--color-ink);
  }

  .prose-custom ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1.25rem;
  }

  .prose-custom li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }

  .prose-custom iframe.ql-video,
  .prose-custom iframe {
    width: 100%;
    aspect-ratio: 16 / 9;
    height: auto;
    margin-block: 1.75rem;
    border: 0;
    border-radius: 1rem;
    background: #000;
  }

  .prose-custom img {
    max-width: 100%;
    height: auto;
    border-radius: 0.75rem;
    margin-block: 1.5rem;
  }
`

export const tailwindConfigScript = `
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          ink: {
            DEFAULT: '#1e1b26',
            light: '#2d2938',
          },
          cream: '#fdfaf6',
          sunset: {
            orange: '#f97316',
            red: '#be123c',
            gold: '#fbbf24',
            peach: '#ffedd5',
          },
          latvian: {
            red: '#7a2231',
          },
          accent: {
            emerald: '#059669',
            amber: '#d97706',
            sky: '#0284c7',
            rose: '#e11d48',
            violet: '#7c3aed',
            slate: '#475569',
          }
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
          serif: ['Lora', 'Georgia', 'serif'],
        }
      }
    }
  }
`
