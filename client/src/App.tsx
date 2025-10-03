import Header from './components/Header'
import SquirrelMap from './components/SquirrelMap'
import './styles/global.css'
import styles from './App.module.css'

const App = () => {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <SquirrelMap />
      </main>
    </div>
  )
}

export default App
