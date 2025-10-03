import { Squirrel } from '../types/index.js'
import { readSquirrels, writeSquirrels } from '../utils/dataStore.js'
import { generateId } from '../utils/idGenerator.js'

export const getAllSquirrels = async (): Promise<Squirrel[]> => {
  return readSquirrels()
}

export const getSquirrelById = async (id: string): Promise<Squirrel | undefined> => {
  const squirrels = await readSquirrels()
  return squirrels.find(squirrel => squirrel.id === id)
}

export const createSquirrel = async (squirrelData: Omit<Squirrel, 'id'>): Promise<Squirrel> => {
  const squirrels = await readSquirrels()
  
  const newSquirrel: Squirrel = {
    id: generateId(),
    ...squirrelData
  }
  
  squirrels.push(newSquirrel)
  await writeSquirrels(squirrels)
  
  return newSquirrel
}

export const updateSquirrel = async (id: string, updates: Partial<Omit<Squirrel, 'id'>>): Promise<Squirrel | null> => {
  const squirrels = await readSquirrels()
  const index = squirrels.findIndex(squirrel => squirrel.id === id)
  
  if (index === -1) {
    return null
  }
  
  squirrels[index] = { ...squirrels[index], ...updates }
  await writeSquirrels(squirrels)
  
  return squirrels[index]
}

export const deleteSquirrel = async (id: string): Promise<boolean> => {
  const squirrels = await readSquirrels()
  const filteredSquirrels = squirrels.filter(squirrel => squirrel.id !== id)
  
  if (filteredSquirrels.length === squirrels.length) {
    return false
  }
  
  await writeSquirrels(filteredSquirrels)
  return true
}

