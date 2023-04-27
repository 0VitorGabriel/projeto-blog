const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const categoria = mongoose.model('categorias')

router.get('/', (request, response) => {
    response.render('admin/index')
})

router.get('/posts', (request, response) => {
    response.send('pagina de posts')
})

router.get('/categorias', (request, response) => {
    categoria.find().lean().sort({data: 'desc'})
    .then((categorias) => {
        response.render('admin/categorias', {categorias: categorias})
    }).catch((err) => {
        request.flash('error_msg', 'erro ao enviar a categoria')
        response.redirect('/admin')
    })
})

router.post('/categorias/nova', (request, response) => {
    const nova_categoria = {
        nome: request.body.nome,
        slug: request.body.slug
    }

    new categoria(nova_categoria).save()
    .then(() => {
        request.flash('success_msg', 'categoria enviada com sucesso')
        response.redirect('/admin/categorias')
    }).catch((err) => {
        request.flash('error_msg', 'erro ao enviar a categoria')
        response.redirect('/admin')
    })
})

router.get('/categorias/add', (request, response) => {
    response.render('admin/add_categorias')
})

module.exports = router