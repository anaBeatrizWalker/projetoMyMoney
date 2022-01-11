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