const express = require('express')
const app = express()
const router = express.Router()
const mongoose = require('mongoose')
require('.././models/Usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')
const passport = require('passport')

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

        Usuario.findOne({email: request.body.email}).lean()

        .then((usuario) => {
            if (usuario) {
                request.flash('error_msg', 'email ja usado')
                response.redirect('/usuarios/registro')
            } else {

                const novoUsuario = new Usuario({
                    nome: request.body.nome,
                    email: request.body.email,
                    senha: request.body.senha
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if (erro) {
                            request.flash('error_msg', 'erro ao cadastar o usuario')

                            response.redirect('/')
                        } else {
                            novoUsuario.senha = hash

                            novoUsuario.save()

                            .then(() => {
                                request.flash('success_msg', 'usuario cadastrado com sucesso')

                                response.redirect('/')
                            })

                            .catch((err) => {
                                request.flash('error_msg', 'erro ao salvar usuario')

                                response.redirect('/usuarios/registro')
                            })
                        }
                    })
                })

            }
        })

        .catch((err) => {
            request.flash('error_msg', 'erro ao consultar o banco de dados')

            response.redirect('/')
        })
    }
})

router.get('/login', (request, response) => {
    response.render('usuarios/login')
})

router.post('/login', (request, response, next) => {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    }) (request, response, next)

})

module.exports = router