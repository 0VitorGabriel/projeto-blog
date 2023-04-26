const express = require('express')
const router = express.Router()

router.get('/', (request, response) => {
    response.render('admin/index')
})

router.get('/posts', (request, response) => {
    response.send('pagina de posts')
})

router.get('/categorias', (request, response) => {
    response.render('admin/categorias')
})

router.get('/categorias/add', (request, response) => {
    response.render('admin/add_categorias')
})

module.exports = router