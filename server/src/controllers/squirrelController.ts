import { Request, Response } from 'express'
import * as squirrelService from '../services/squirrelService.js'
import { validateSquirrelData } from '../utils/validation.js'

export const getSquirrels = async (_req: Request, res: Response): Promise<void> => {
  try {
    const squirrels = await squirrelService.getAllSquirrels()
    res.json(squirrels)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch squirrels' })
  }
}

export const getSquirrelById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const squirrel = await squirrelService.getSquirrelById(id)
    
    if (!squirrel) {
      res.status(404).json({ error: 'Squirrel not found' })
      return
    }
    
    res.json(squirrel)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch squirrel' })
  }
}

export const createSquirrel = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationError = validateSquirrelData(req.body)
    
    if (validationError) {
      res.status(400).json({ error: validationError })
      return
    }
    
    const newSquirrel = await squirrelService.createSquirrel(req.body)
    res.status(201).json(newSquirrel)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create squirrel' })
  }
}

export const updateSquirrel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const updatedSquirrel = await squirrelService.updateSquirrel(id, req.body)
    
    if (!updatedSquirrel) {
      res.status(404).json({ error: 'Squirrel not found' })
      return
    }
    
    res.json(updatedSquirrel)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update squirrel' })
  }
}

export const deleteSquirrel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const deleted = await squirrelService.deleteSquirrel(id)
    
    if (!deleted) {
      res.status(404).json({ error: 'Squirrel not found' })
      return
    }
    
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete squirrel' })
  }
}

