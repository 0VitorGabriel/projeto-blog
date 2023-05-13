const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')

router.get('/', (request, response) => {
    response.render('admin/index')
})

router.get('/posts', (request, response) => {
    response.send('pagina de posts')
})

router.get('/categorias', (request, response) => {
    Categoria.find().lean().sort({data: 'desc'})
    .then((categorias) => {
        response.render('admin/categorias', {categorias: categorias})
    }).catch((err) => {
        request.flash('error_msg', 'erro ao enviar a categoria')
        response.redirect('/admin')
    })
})

router.get('/categorias/edit/:id', (request, response) => {
    Categoria.findOne({_id: request.params.id}).lean().then((categorias) => {
        response.render('admin/edit_categorias', {categoria: categorias})
    }).catch((err) => {
        request.flash('error_msg', 'essa categoria não existe')
        response.redirect('/admin/categorias/')
    })
})

router.post('/categorias/edit', (request, response) => {
    let filter = { _id: request.body.id }
    let update = { nome: request.body.nome, slug: String(request.body.slug).toLowerCase() }

    Categoria.findOneAndUpdate(filter, update).then(() => {
        request.flash("success_msg", "Categoria atualizada")
        response.redirect('/admin/categorias/')
    }).catch((err) => {
        request.flash("error_msg", "Erro ao atualizar categoria")
        response.redirect('/admin/categorias/')
    })
})

router.post('/categorias/deletar', (request, response) => {
   Categoria.deleteOne({_id: request.body.id}).then(() => {
        request.flash('success_msg', 'categoria deletada com sucesso!')
        response.redirect('/admin/categorias')
        console.log('categoria deletada')
   }).catch((err) => {
        request.flash('error_msg', 'erro ao deletar a categoria')
        response.redirect('/admin/categorias')
        console.log('erro ao deletar a categoria ' + err)
   })
})

router.post('/categorias/nova', (request, response) => {
    const nova_categoria = {
        nome: request.body.nome,
        slug: String(request.body.slug).toLowerCase()
    }

    new Categoria(nova_categoria).save()
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

router.get('/postagens', (request, response) => {
    response.render('admin/postagens')
})

router.get('/postagens/add', (request, response) => {
    Categoria.find().lean()
    
    .then((categorias) => {
        response.render('admin/add_postagem', {categorias: categorias})
    }).catch((err) => {
        request.flash('error_msg', 'erro ao caregar o formulario')
        response.redirect('/admin')
    })
})

module.exports = router