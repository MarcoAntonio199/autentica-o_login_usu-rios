import mysql from 'mysql2/promise'
import 'dotenv/config'

// criação do banco de dados com createPool e variaveis de ambiente
export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    // aguarda para a conexão
    waitForConnections: true,
    // determina o limite de conexão
    connectionLimit: 10,
    // limite da fila de espera para a conexão, caso tenha mais de 10 conexões
    queueLimit: 0
    
})