import {Router} from 'express'
import { cadastrar, login, listarUsuario } from '../controllers/authController.js'
import { autenticar } from '../middlewares/authMiddlewares.js'

const router = Router()

router.post('/usuarios', cadastrar)
router.post('/login', login)
router.get('/usuarios', autenticar, listarUsuario)

export default router