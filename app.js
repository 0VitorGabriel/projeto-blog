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

        connection()
    // mongoose
        async function connection() {
            try {
                await mongoose.connect('mongodb://127.0.0.1/blog')

                console.log('banco conectado com sucesso')
            } catch (error) {
                console.log(error.message)
            }
        }
// rotas
    app.get('/', async (request, response) => {
        try {
            const postagens = await Postagem.find().lean().sort({data: 'desc'})

            response.render('index', {postagens: postagens})
        } catch (error) {
            request.flash('error_msg', 'erro no banco de dados')

            response.redirect('/404')
        }
    })

    app.get('/postagens/:slug', async (request, response) => {
        try {
            const postagem = await Postagem.findOne({slug: request.params.slug}).lean()

            if (postagem) {
                response.render('postagens/index', {postagens: postagem})
            } else {
                request.flash('error_msg', 'esta postagem não existe')

                response.redirect('/')
            }
           
        } catch (error) {
            request.flash('error_msg', 'erro no banco de dados')

            response.redirect('/404')
        }
    })

    app.get('/categorias', async (request, response) => {
        try {
            const categoria = await Categoria.find().lean()

            response.render('categorias/index', {categorias: categoria})
        } catch (error) {
            request.flash('error_msg', 'erro ao listar as categorias')
    
            response.redirect('/')
        }
    })

    app.get('/categorias/:slug', async (request, response) => {
        try {
            const categoria = await Categoria.findOne({slug: request.params.slug}).lean()

            if (categoria) {
                try {
                    const postagem = await Postagem.find({categoria: categoria._id}).lean()

                    response.render('categorias/postagens', {postagens: postagem, categorias: categoria})
                } catch (error) {
                    request.flash('error_msg', 'erro ao listar as postagen')

                    response.redirect('/')
                }
            } else {
                request.flash('error_msg', 'A categoria não existe')

                response.redirect('/')
            }
        } catch (error) {
            request.flash('error_msg', 'erro ao carregar a pagina dos posts da categoria')

            response.redirect('/')
        }
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
        console.log('servidor rodando na porta http://127.0.0.1:8081')
    })