import { loadSquirrelDataFromAPI } from '../utils/loadData.js'
import { runMigrations } from '../database/migrations.js'
import { pool } from '../config/database.js'

const seed = async () => {
  try {
    console.log('Starting data seed...')
    
    await runMigrations()
    
    await loadSquirrelDataFromAPI()
    
    console.log('✨ Data seed completed successfully!')
    
    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('Failed to seed data:', error)
    await pool.end()
    process.exit(1)
  }
}

seed()

