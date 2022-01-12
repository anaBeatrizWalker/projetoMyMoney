//Serviços relativos a autenticação (criar novo, login, validação...)

//Dependências
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./user')
const env = require('../../.env')

//Expressões regulares para validar email e senha
const emailRegex = /\S+@\S+\.\S+/ //sequencia de caracteres com arroba, dominínio e ponto mais sequencia de caracteres
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/ //senha tem que ter digítos, letras minúculas e maiúsculas, algum caractere especial, entre 6 e 20

//Tratamento de erros de banco de dados
const sendErrorsFromDB = (res, dbErrors) => {
    const errors = []
    _.forIn(dbErrors.errors, error => errors.push(error.message))
    return res.status(400).json({errors})
}

//Método de Login
const login = (req, res, next) => {
    const email = req.body.email || '' //request do email
    const password = req.body.password || ''
    
    //Busca dentro da coleção de usuários, um único user a partir do email
    User.findOne({email}, (err, user) => {
        if(err) {
            return sendErrorsFromDB(res, err)

        //Se user válido, compara a senha enviada com a senha criptografada do banco
        } else if (user && bcrypt.compareSync(password, user.password)) {
            //Gera um token a partir do user e do secret
            const token = jwt.sign({ ...user }, env.authSecret, {
                expiresIn: "1 day" //expiração do token de um dia (usuário pode ficar logado por 1 dia)
            })
            //Gera um json com as infos do usuário
            const { name, email } = user
            res.json({ name, email, token })
        
        } else {
            return res.status(400).send({errors: ['Usuário/Senha inválidos']})
        }
    })
}

//Valida token
const validateToken = (req, res, next) => {
    const token = req.body.token || '' //request do token

    //Alpica authSecret no token, caso não haja erro, retorna o token decodificado 
    jwt.verify(token, env.authSecret, function(err, decoded) {
        //Se não tiver erro, valid = true, senão valid = false
        return res.status(200).send({valid: !err})
    })
}

//Método de Cadastro
const signup = (req, res, next) => {
    //Request dos dados passados no formulário
    const name = req.body.name || ''
    const email = req.body.email || ''
    const password = req.body.password || ''
    const confirmPassword = req.body.confirm_password || ''

    //Validação do e-mail
    if(!email.match(emailRegex)) {
        return res.status(400).send({errors: ['O e-mail informado está inválido']})
    }

    //Validação da senha
    if(!password.match(passwordRegex)) {
        return res.status(400).send({
            errors: [
                "Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@#$%) e tamanho entre 6-20."
            ]
        })
    }
    
    //Hash da senha, compara a confirmação da senha
    const salt = bcrypt.genSaltSync()
    const passwordHash = bcrypt.hashSync(password, salt)
        if(!bcrypt.compareSync(confirmPassword, passwordHash)) {
            return res.status(400).send({errors: ['Senhas não conferem.']})
    }

    //Se o usuário já existe no banco
    User.findOne({email}, (err, user) => {
        //se deu erro
        if(err) {
            return sendErrorsFromDB(res, err)

        //se encontrou um user válido
        } else if (user) {
            return res.status(400).send({errors: ['Usuário já cadastrado.']})
        
        //se não, cadastra um novo user
        } else {
            const newUser = new User({ name, email, password: passwordHash })
            //salva usuário
            newUser.save(err => {
                if(err) {
                    return sendErrorsFromDB(res, err)
                //se não deu erro, loga usuário no sistema
                } else {
                    login(req, res, next)
                }
            })
        }
    })
}
module.exports = { login, signup, validateToken }