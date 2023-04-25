const express = require('express')
const router = express.Router()

router.get('/', (request, response) => {
    response.send('pagina principal')
})

router.get('/posts', (request, response) => {
    response.send('pagina de posts')
})

router.get('/categorias', (request, response) => {
    response.send('pagina de categorias')
})

module.exports = router