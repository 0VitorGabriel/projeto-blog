// modulos
    const express = require('express')
    const app = express()
    const handlebars = require('express-handlebars')
    const admin = require('./routes/admin')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')
    const moment = require('moment')
    require('./models/Postagem')
    const Postagem = mongoose.model('postagens')
    require('./models/Categoria')
    const Categoria = mongoose.model('categorias')
    const usuarios = require('./routes/usuario')
    const passport = require('passport')
    require('./config/auth')(passport)
// configuracao
    // sessão
        app.use(session({
            secret: "cursoNode",
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())

        app.use(flash())
    // midleware
        app.use((request, response, next) => {
            response.locals.success_msg = request.flash('success_msg')
            response.locals.error_msg = request.flash('error_msg')
            response.locals.error = request.flash('error')
            response.locals.user = request.user || null
            next()
        })
    // express
        app.use(express.urlencoded({extended: true}))
        app.use(express.json())
    // handlebars
        app.engine('handlebars', handlebars.engine({
            defaultLayout: 'main',
            helpers: {
                formatDate: (date) => {
                    return moment(date).format('DD/MM/YYYY')
                }
            }
        }))
        app.set('view engine', 'handlebars')
        app.set('views', './views')
    // mongoose
        mongoose.Promise = global.Promise
        mongoose.connect('mongodb+srv://Vitor20100:Vitor20100@blog.jv3clak.mongodb.net/blog').then(() => {
            console.log('banco conectado com sucesso')
        }).catch((err) => {
            console.log('erro ao se conectar ' + err)
        })
// rotas
    app.get('/', (request, response) => {
        Postagem.find().lean().sort({data: 'desc'})

        .then((postagens) => {
            response.render('index', {postagens: postagens})
        })

        .catch((err) => {
            request.flash('error_msg', 'erro no banco de dados')

            response.redirect('/404')
        })
    })

    app.get('/postagens/:slug', (request, response) => {
        Postagem.findOne({slug: request.params.slug}).lean()

        .then((postagens) => {
            if (postagens) {
                response.render('postagens/index', {postagens: postagens})
            } else {
                request.flash('error_msg', 'esta postagem não existe')

                response.redirect('/')
            }
        })

        .catch((err) => {
            request.flash('error_msg', 'erro no banco de dados')

            response.redirect('/404')
        })
    })

    app.get('/categorias', (request, response) => {
        Categoria.find().lean()

        .then((categorias) => {
            response.render('categorias/index', {categorias: categorias})
        })

        .catch((err) => {
            request.flash('error_msg', 'erro ao listar as categorias')

            response.redirect('/')
        })
    })

    app.get('/categorias/:slug', (request, response) => {
        Categoria.findOne({slug: request.params.slug}).lean()

        .then((categorias) => {
            if (categorias) {

                Postagem.find({categoria: categorias._id}).lean()

                .then((postagens) => {
                    response.render('categorias/postagens', {postagens: postagens, categorias: categorias})
                })

                .catch((err) => {
                    request.flash('error_msg', 'erro ao listar as postagen')

                    response.redirect('/')
                })

            } else {
                request.flash('error_msg', 'A categoria não existe')

                response.redirect('/')
            }
        })

        .catch((err) =>{
            request.flash('error_msg', 'erro ao carregar a pagina dos posts da categoria')

            response.redirect('/')
        })
    })

    app.get('/404', (request, response) => {
        response.send('Erro 404')
    })

    app.get('/posts', (request, response) => {
        response.send('pagina de posts')
    })

    app.use('/admin', admin)
    app.use('/usuarios', usuarios)
// outros
    const port = 8081
    app.listen(port, () => {
        console.log('servidor rodando')
    })