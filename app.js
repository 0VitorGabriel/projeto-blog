// modulos
    const express = require('express')
    const app = express()
    const handlebars = require('express-handlebars')
    const admin = require('./routes/admin')
    const bodyparser = require('body-parser')
    //const mongoose = require('mongoose')
// configuracao
    // body parser
        app.use(bodyparser.urlencoded({extended: true}))
        app.use(bodyparser.json())
    // handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
        app.set('views', './views')
    // mongoose
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