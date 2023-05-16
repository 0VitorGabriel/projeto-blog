const express = require('express')
const app = express()
const router = express.Router()
const mongoose = require('mongoose')
require('.././models/Usuario')
const Usuario = mongoose.model('usuarios')

router.get('/registro', (request, response) => {
    response.render('usuarios/registro')
})

module.exports = router