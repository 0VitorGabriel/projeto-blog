// modulos
    const express = require('express')
    const app = express()
    const handlebars = require('express-handlebars')
    const admin = require('./routes/admin')
    const mongoose = require('mongoose')
// configuracao
    // express
        app.use(express.urlencoded({extended: true}))
        app.use(express.json())
    // handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
        app.set('views', './views')
    // mongoose
        mongoose.Promise = global.Promise
        mongoose.connect('mongodb://127.0.0.1/blog').then(() => {
            console.log('banco conectado com sucesso')
        }).catch((err) => {
            console.log('erro ao se conectar ' + err)
        })
// rotas
    app.get('/', (request, response) => {
        response.send('pagina principal')
    })

    app.get('/posts', (request, response) => {
        response.send('pagina de posts')
    })

    app.use('/admin', admin)
// outros
    const port = 8081
    app.listen(port, () => {
        console.log('servidor rodando')
    })