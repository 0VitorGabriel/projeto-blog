const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')

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

    Postagem.find().lean().populate({path: 'categorias', strictPopulate: false}).sort({data: 'desc'})

    .then((postagens) => {
        response.render('admin/postagens', {postagens: postagens})
    }) 

    .catch((err) => {
        request.flash('error_msg', 'erro ao listar as categorias')
        response.redirect('/admin')
        console.log(err)
    })
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

router.post('/postagens/nova', (request, response) => {
    var erros = []

    if (request.body.categoria == '0') {
        erros.push({texto: 'nenhuma categoria registrada, nâo poderá criar uma nova postagem'})
    }

    if (erros.length > 0) {
        response.render('admin/add_postagem', {erros: erros})
    } else {
        const nova_postagem = {
            titulo: request.body.titulo,
            slug: request.body.slug,
            descricao: request.body.descricao,
            conteudo: request.body.conteudo,
            categoria: request.body.categoria
        }

        new Postagem(nova_postagem).save()

        .then(() => {
            request.flash('success_msg', 'postagem criada com sucesso')
            response.redirect('/admin/postagens')

            console.log('postagem criada com sucesso')
        })

        .catch((err) => {
            request.flash('error_msg', 'erro ao criar a postagem')
            response.redirect('/admin/postagens')

            console.log('erro ao criar a postagem ' + err)
        })
    }
})

router.get('/postagens/edit/:id', (request, response) => {

    Postagem.findOne({_id: request.params.id}).lean()

    .then((postagem) => {

        Categoria.find().lean()

        .then((categoria) => {
            response.render('admin/edit_postagens', {categorias: categoria, postagens: postagem})
        })

        .catch((err) => {
            request.flash('error_msg', 'erro ao listar as categorias')
            
            response.redirect('/admin/postagens')
        })
    })

    .catch((err) => {
        request.flash('error_msg', 'erro ao carregar o formulario')

        response.redirect('/admin/postagens')
    })

})

router.post('/postagens/edit', (request, response) => {

    Postagem.findOne({ _id: request.body.id })

    .then((postagem) => {
        postagem.titulo = request.body.titulo
        postagem.slug = request.body.slug
        postagem.descricao = request.body.descricao
        postagem.conteudo = request.body.conteudo
        postagem.categoria = request.body.categoria

        postagem.save()

        .then((postagens) => {
            request.flash('success_msg', 'postagem salva com sucesso')
            response.redirect('/admin/postagens')
        })

        .catch((err) => {
            request.flash('error_msg', 'erro ao salvar a postagem')
            response.redirect('/admin/postagens')
        })
    })

    .catch((err) => {
        request.flash('error_msg', 'erro ao editar a postagem')
        response.redirect('/admin/postagens')

        console.log(err)
    })
})

module.exports = router