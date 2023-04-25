// modulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const app = express()
    const admin = require('./routes/admin')
    //const mongoose = require('mongoose')
// configuracao
    // express
        app.use(express.urlencoded({extended: true}))
        app.use(express.json())
    // handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: "main"}))
        app.set('view engine', 'handlebars')
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