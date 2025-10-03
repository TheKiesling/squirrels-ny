import { Squirrel } from '../types/index.js'

type SquirrelInput = Omit<Squirrel, 'id'>

export const validateSquirrelData = (data: Partial<SquirrelInput>): string | null => {
  if (!data.latitude || typeof data.latitude !== 'number') {
    return 'Latitude is required and must be a number'
  }
  
  if (!data.longitude || typeof data.longitude !== 'number') {
    return 'Longitude is required and must be a number'
  }
  
  if (!data.uniqueSquirrelId || typeof data.uniqueSquirrelId !== 'string') {
    return 'Unique squirrel ID is required'
  }
  
  if (!data.hectare || typeof data.hectare !== 'string') {
    return 'Hectare is required'
  }
  
  if (!data.shift || typeof data.shift !== 'string') {
    return 'Shift is required'
  }
  
  if (!data.date || typeof data.date !== 'string') {
    return 'Date is required'
  }
  
  if (data.hectareSquirrelNumber === undefined || typeof data.hectareSquirrelNumber !== 'number') {
    return 'Hectare squirrel number is required and must be a number'
  }
  
  return null
}

