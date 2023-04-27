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
    response.render('admin/categorias')
})

router.post('/categorias/nova', (request, response) => {
    const nova_categoria = {
        nome: request.body.nome,
        slug: request.body.slug
    }

    new categoria(nova_categoria).save()
    .then(() => {
        console.log('categoria salva')
    }).catch((err) => {
        console.log('categoria não salva' + err)
    })
})

router.get('/categorias/add', (request, response) => {
    response.render('admin/add_categorias')
})

module.exports = router