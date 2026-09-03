import styles from './AdminLogo.module.css'

export function AdminLogo() {
  return (
    <div className={styles.brand}>
      <img
        alt="Latvian Association of Darwin"
        className={styles.logo}
        src="/images/logo.png"
      />
      <span className={styles.title}>Latvian Association of Darwin</span>
      <span className={styles.subtitle}>Dārvinas Latviešu Apvienība</span>
    </div>
  )
}
