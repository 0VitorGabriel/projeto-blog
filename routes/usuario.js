const express = require('express')
const app = express()
const router = express.Router()
const mongoose = require('mongoose')
require('.././models/Usuario')
const Usuario = mongoose.model('usuarios')

router.get('/registro', (request, response) => {
    response.render('usuarios/registro')
})

router.post('/registro', (request, response) => {
    var erros = []

    if (!request.body.nome || request.body.nome == undefined || request.body.nome == null) {
        erros.push({texto: 'nome inválido'})
    }

    if (!request.body.email || request.body.email == undefined || request.body.email == null) {
        erros.push({texto: 'email inválido'})
    }

    if (!request.body.senha || request.body.senha == undefined || request.body.senha == null) {
        erros.push({texto: 'senha inválido'})
    }

    if (request.body.senha.length < 8) {
        erros.push({texto: 'senha muito curta'})
    }

    if (request.body.senha != request.body.senha_repetida) {
        erros.push({texto: 'As senhas são diferentes'})
    }

    if (erros.length > 0) {

        response.render('usuarios/registro', {erros: erros})

    } else {

    }
})

module.exports = router