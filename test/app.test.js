const chai = require('chai')
const chai_http = require('chai-http')
const chai_subset = require('chai-subset')

chai.use(chai_http)
chai.use(chai_subset)

const arquiveApp = require('../app')

describe('teste das rotas principais', () => {
    it('/categorias - GET', () => {
        chai.request(arquiveApp)
            .get('/categorias')
            .end((err, res) => {
                chai.expect(err).to.be.null 
                chai.expect(res).to.have.status(200)
            })
    })

    it('/ - GET', () => {
        chai.request(arquiveApp)
            .get('/')
            .end((err, res) => {
                chai.expect(err).to.be.null 
                chai.expect(res).to.have.status(200)
            })
    })
})