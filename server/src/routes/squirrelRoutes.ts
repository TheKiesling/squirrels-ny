import { Router } from 'express'
import * as squirrelController from '../controllers/squirrelController.js'

const router = Router()

router.get('/', squirrelController.getSquirrels)
router.get('/:id', squirrelController.getSquirrelById)
router.post('/', squirrelController.createSquirrel)
router.put('/:id', squirrelController.updateSquirrel)
router.delete('/:id', squirrelController.deleteSquirrel)

export default router

