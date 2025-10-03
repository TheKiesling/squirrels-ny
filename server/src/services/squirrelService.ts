import { Squirrel } from '../types/index.js'
import * as squirrelRepository from '../repositories/squirrelRepository.js'
import { generateId } from '../utils/idGenerator.js'

export const getAllSquirrels = async (): Promise<Squirrel[]> => {
  return squirrelRepository.findAll()
}

export const getSquirrelById = async (id: string): Promise<Squirrel | null> => {
  return squirrelRepository.findById(id)
}

export const createSquirrel = async (squirrelData: Omit<Squirrel, 'id'>): Promise<Squirrel> => {
  const newSquirrel: Squirrel = {
    id: generateId(),
    ...squirrelData
  }
  
  return squirrelRepository.create(newSquirrel)
}

export const updateSquirrel = async (id: string, updates: Partial<Omit<Squirrel, 'id'>>): Promise<Squirrel | null> => {
  return squirrelRepository.update(id, updates)
}

export const deleteSquirrel = async (id: string): Promise<boolean> => {
  return squirrelRepository.remove(id)
}

