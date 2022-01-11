//Middleware que valida o tokencJWT que veio a partir da requisição para as routas protegidas e garantE que a API esteja protegida.

const jwt = require('jsonwebtoken')
const env = require('../.env')

module.exports = (req, res, next) => {
    // CORS preflight request
    if(req.method === 'OPTIONS') { //não valida caso o método seja options
        next()

    } else {
        //token pode vir do body, da query...
        const token = req.body.token || req.query.token ||req.headers['authorization']

        if(!token) {
            return res.status(403).send({errors: ['No token provided.']})
        }
        //Verifica e valida o token, passando o token decodificado
        jwt.verify(token, env.authSecret, function(err, decoded) {
            if(err) {
                return res.status(403).send({
                    errors: ['Failed to authenticate token.']
                })
            } else {
                // req.decoded = decoded
                next()
            }
        })
    }
}
