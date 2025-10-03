import styles from './Header.module.css'

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <span className={styles.icon}>🐿️</span>
          <h1 className={styles.title}>Central Park Squirrels</h1>
        </div>
        <p className={styles.subtitle}>2018 Census Interactive Map</p>
      </div>
    </header>
  )
}

export default Header

