const chai = require('chai')
const chai_http = require('chai-http')
const chai_subset = require('chai-subset')

chai.use(chai_http)
chai.use(chai_subset)

const arquiveApp = require('.././routes/admin')


describe('testes das rotas administradoras', () => {
    it('/admin/categorias - GET', () => {
        chai.request(arquiveApp)
            .get('/categorias')
            .end((err, res) => {
                expect(err).to.be.null 
                expect(res).to.have.status(200)
            })
    })

    it('/admin/postagens - GET', () => {
        chai.request(arquiveApp)
            .get('/postagens')
            .end((err, res) => {
                expect(err).to.be.null 
                expect(res).to.have.status(200)
            })
    })
})