import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { Squirrel } from '../types/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_FILE = path.join(__dirname, '../data/squirrels.json')

const ensureDataFile = async (): Promise<void> => {
  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2))
  }
}

export const readSquirrels = async (): Promise<Squirrel[]> => {
  await ensureDataFile()
  const data = await fs.readFile(DATA_FILE, 'utf-8')
  return JSON.parse(data)
}

export const writeSquirrels = async (squirrels: Squirrel[]): Promise<void> => {
  await fs.writeFile(DATA_FILE, JSON.stringify(squirrels, null, 2))
}

