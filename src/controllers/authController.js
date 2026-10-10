import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../config/db.js'

/* 
 * funções : 1.cadastrar usuario -> precisar do usuario e senha 
             2.login 
             3.rotas protegidas -> testar token
*/

export async function cadastrar(req,res){
    try {
        const {usuario, senha} = req.body

        if(!usuario || !senha){
            return res.status(400).json({mensagem: 'Usuário e senha são obrigatórios'})
        }

        if(senha.length < 4){
            return res.status(400).json({mensagem: 'A senha deve ter pelo menos 4 carácteres'})
        }

        // verifica se o usuário ja foi cadastrado
        const [existentes] = await pool.query(
            'SELECT id FROM usuarios WHERE usuario = ?',
            [usuario]
        )

        if(existentes.length > 0){
            return res.status(400).json({mensagem: 'O usuário já existente'})
        }

        const senhaHash = await bcrypt.hash(senha, 10)

        const [resultado] = await pool.query(
            'INSERT INTO usuarios (usuario, senha) VALUES(?,?)',
            [usuario, senhaHash]
        );

        return res.status(201).json({
            mensagem: 'Usuario cadastrado com sucesso',
            usuario: {id: resultado.insertId, usuario}
        })


    } catch (erro) {

        // erro que aparece no terminal - dev
        console.error(erro)

        // retorna o erro no frontend - cliente
        return res.status(500).json({mensagem: 'Erro ao cadastrat usuário'})
    }
}