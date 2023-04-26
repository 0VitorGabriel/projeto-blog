const mongoose = require('mongoose')
const schema = mongoose.schema

const Categoria = new mongoose.schema({
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