import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import router from './routes/authRoutes.js'
import { pool } from './config/db.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(router)
// cors definido apenas para frontend espeficifico
//app.use(cors({ origin: 'http://localhost:5176' }))

// Rota de teste -> quando entrarmos no endereço '/' aparecera essa mensagem
app.get('/',(req,res)=>{
    res.json({mensagem: 'API de autenticação funcionando'})
})


async function iniciar(req,res){
    try {

        const connection = await pool.getConnection();
        console.log('MySql conectado com sucesso')
        connection.release()

        app.listen(PORT,()=>{
            console.log(`Servidor rodando em http://localhost:${PORT}`)
        })
        
    } catch (error) {
        console.error('Erro ao conectar no MySql', error.message)
        process.exit(1)
    }
}

iniciar()