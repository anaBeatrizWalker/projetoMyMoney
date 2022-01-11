const express = require('express')
const auth = require('./auth')

module.exports = function(server) {
    //ROTAS PROTEGIDAS PELO TOKEN
    const protectedApi = express.Router()
    server.use('/api', protectedApi)

    //passa pelo filtro de autenticação
    protectedApi.use(auth) 

    //rotas de Ciclo de Pagamento 
    const BillingCycle = require('../api/billingCycle/billingCycleService')
    BillingCycle.register(protectedApi, '/billingCycles')

    //ROTAS PÚBLICAS
    const openApi = express.Router()
    server.use('/oapi', openApi)

    //métodos de autenticação
    const AuthService = require('../api/user/AuthService')
    openApi.post('/login', AuthService.login)
    openApi.post('/signup', AuthService.signup)
    openApi.post('/validateToken', AuthService.validateToken)
}