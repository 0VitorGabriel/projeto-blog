const mongoose = require('mongoose')
const schema = mongoose.Schema

const Categoria = new schema({
    nome: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('categorias', Categoria)