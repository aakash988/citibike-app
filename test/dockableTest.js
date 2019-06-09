const chai = require('chai')
const chaiHTTP = require('chai-http')
const server = require('../src/app')
const expect = chai.expect

chai.use(chaiHTTP)

describe('Post Dockable stations', () => {
    it('should return a message to indicate that there are docks available for bikes requested', (done) => {
        chai.request(server)
        .get('/dockable/291/1')
        .end((err, result) => {
            expect(result).to.have.status(200)
            expect(result).to.have.header('content-type', 'application/json; charset=utf-8')
            expect(result).to.be.json
            expect(result.body).to.be.an('object')
            expect(result.body).to.have.property('dockable').to.be.true
            expect(result.body).to.have.property('message').to.equal('There are enough available docks for the bikes requested.')
            done()
        })
    })
    it('should return a message to indicate that the bikes requested exceeds number of docks available', (done) => {
        chai.request(server)
        .get('/dockable/291/100')
        .end((err, result) => {
            expect(result).to.have.status(400)
            expect(result).to.have.header('content-type', 'application/json; charset=utf-8')
            expect(result).to.be.json
            expect(result.body).to.be.an('object')
            expect(result.body).to.have.property('dockable').to.be.false
            expect(result.body).to.have.property('message').to.equal('There are not enough available docks for the bikes requested.')
            done()
        })
    })
    it('should return a 404 because station was not found', (done) => {
        chai.request(server)
        .get('/dockable/300/1')
        .end((err, result) => {
            expect(result).to.have.status(404)
            expect(result).to.have.header('content-type', 'application/json; charset=utf-8')
            expect(result).to.be.json
            expect(result.body).to.be.an('object')
            expect(result.body).to.have.property('error').equal('Station ID not found')
            done()
        })
    })
    it('should return a 400 due to invalid request parameter', (done) => {
        chai.request(server)
        .get('/dockable/300/thisisatest')
        .end((err, result) => {
            expect(result).to.have.status(400)
            expect(result).to.have.header('content-type', 'application/json; charset=utf-8')
            expect(result).to.be.json
            expect(result.body).to.be.an('object')
            expect(result.body).to.have.property('error').equal('Invalid request')
            done()
        })
    })
})