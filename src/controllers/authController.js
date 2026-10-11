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

export async function login(req,res){
    
    try {
        const {usuario,senha} = req.body

         if(!usuario || !senha){
            return res.status(400).json({mensagem: 'Usuário e senha são obrigatórios'})
        }

        const [usuarios] = await pool.query(
                'SELECT id, usuario, senha FROM usuarios WHERE usuario = ? LIMIT 1',
                [usuario]
            )

            if(usuarios.length === 0){
                return res.status(401).json({mensagem: 'Usuário ou senha inválidos'})
            }

            // pega as informações do usuario -> id, usuario e senha(hashSenha)
            const encontrado = usuarios[0]
            const senhaValida = await bcrypt.compare(senha, encontrado.senha)

            if(!senhaValida){
                return res.status(401).json({mensagem: 'Usuario ou senha inválidos'})
            }

            // criação de tokem com id e usuario do usuario
            const token = jwt.sign(
                {id: encontrado.id, usuario: encontrado.usuario},
                // palavra chave da jwt
                process.env.JWT_SECRET,
                // expiração do token
                {expiresIn: '1h' }
            )

            return res.json({
                mensagem: 'Login realizado com sucesso',
                usuario: {id: encontrado.id, usuario: encontrado.usuario},
                token
            })
        
    } catch (error) {
        console.erro(error)
        return res.status(500).json({mensagem: 'Erro no login'})
    }
    
} 

// agora que temos o token podemos criar roteas e funções que só podem ser acessadas se houver a autenticação


export async function listarUsuario(req,res){
    try {

        const [usuarios] = await pool.query(
            'SELECT id ,usuario, criado_em FROM usuarios ORDER BY id'
        )

        return res.json(usuarios)
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({mensagem: 'Erro ao listar os usuários'})
    }
}