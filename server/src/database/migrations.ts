import { pool } from '../config/database.js'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const runMigrations = async (): Promise<void> => {
  const client = await pool.connect()
  
  try {
    console.log('🔧 Running database migrations...')
    
    const schemaSQL = await fs.readFile(
      path.join(__dirname, 'schema.sql'),
      'utf-8'
    )
    
    await client.query(schemaSQL)
    
    console.log('✅ Database migrations completed successfully')
  } catch (error) {
    console.error('❌ Error running migrations:', error)
    throw error
  } finally {
    client.release()
  }
}

