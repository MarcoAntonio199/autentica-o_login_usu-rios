import {Router} from 'express'
import { cadastrar } from '../controllers/authController.js'

const router = Router()

router.post('/usuarios', cadastrar)

export default router