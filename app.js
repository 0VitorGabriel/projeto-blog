// modulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const app = express()
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

// outros
    const port = 8081
    app.listen(port, () => {
        console.log('servidor rodando')
    })