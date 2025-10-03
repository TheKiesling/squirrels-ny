import { runMigrations } from '../database/migrations.js'
import { pool } from '../config/database.js'

const migrate = async () => {
  try {
    await runMigrations()
    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    await pool.end()
    process.exit(1)
  }
}

migrate()

