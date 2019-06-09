'use strict'
const chai = require('chai')
const chaiHTTP = require('chai-http')
const server = require('../src/app')
const expect = chai.expect
const jsonStations = require('../src/stations-data/stationsData')

chai.use(chaiHTTP)

describe('Getting stations', () => {
    it('should get all the stations from fetch', (done) => {
        chai.request(server)
        .get('/stations')
        .end((err, result) => {
            expect(result).to.have.status(200)
            expect(result).to.have.header('content-type', 'application/json; charset=utf-8')
            expect(result).to.be.json
            expect(result.body).to.be.an('array')
            expect(result.body[0]).to.be.an('object')
            expect(result.body[0]).to.not.have.property('id')
            expect(result.body[0]).to.have.property('stationName')
            expect(result.body[0]).to.have.property('stAddress1')
            expect(result.body[0]).to.have.property('stAddress2')
            expect(result.body[0]).to.have.property('totalDocks')
            expect(result.body[0]).to.have.property('availableBikes')
            done()
        })
    })
    it('should return 20 results when using valid page number as query parameter', (done) => {
        chai.request(server)
        .get('/stations?page=1')
        .end((err, result) => {
            expect(result).to.have.status(200)
            expect(result).to.have.header('content-type', 'application/json; charset=utf-8')
            expect(result.body).to.be.an('array')
            expect(result.body[0]).to.be.an('object')
            expect(result).to.be.json
            expect(result.body.length).to.be.equal(20)
            expect(result.body[0]).to.not.have.property('id')
            expect(result.body[0]).to.have.property('stationName')
            expect(result.body[0]).to.have.property('stAddress1')
            expect(result.body[0]).to.have.property('stAddress2')
            expect(result.body[0]).to.have.property('totalDocks')
            expect(result.body[0]).to.have.property('availableBikes')
            done()
        })
    })
    it('should return a 400 status due to invalid page request', (done) => {
        chai.request(server)
        .get('/stations?page=thisisapage')
        .end((err, result) => {
            expect(result).to.have.status(400)
            expect(result.body).to.have.property('error').equal('Invalid request')
            done()
        })
    })
    it('should return a 404 status due to page requested exceeding page limit', (done) => {
        chai.request(server)
        .get('/stations?page=50')
        .end((err, result) => {
            expect(result).to.have.status(404)
            expect(result.body).to.have.property('error').equal('Requested page not found')
            done()
        })
    })
    it('should get all the stations that are in service', (done) => {
        chai.request(server)
        .get('/stations/in-service')
        .end((err, result) => {
            expect(result).to.have.status(200)
            expect(result).to.have.header('content-type', 'application/json; charset=utf-8')
            expect(result).to.be.json
            expect(result.body).to.be.an('array')
            expect(result.body[0]).to.be.an('object')
            expect(result.body[0]).to.not.have.property('id')
            expect(result.body[0]).to.have.property('stationName')
            expect(result.body[0]).to.have.property('stAddress1')
            expect(result.body[0]).to.have.property('stAddress2')
            expect(result.body[0]).to.have.property('totalDocks')
            expect(result.body[0]).to.have.property('availableBikes')
            done()
        })
    })
    it('should get all the stations that are in service from page 5', (done) => {
        chai.request(server)
        .get('/stations/in-service?page=5')
        .end((err, result) => {
            expect(result).to.have.status(200)
            expect(result).to.have.header('content-type', 'application/json; charset=utf-8')
            expect(result).to.be.json
            expect(result.body).to.be.an('array')
            expect(result.body[0]).to.be.an('object')
            expect(result.body[0]).to.not.have.property('id')
            expect(result.body[0]).to.have.property('stationName')
            expect(result.body[0]).to.have.property('stAddress1')
            expect(result.body[0]).to.have.property('stAddress2')
            expect(result.body[0]).to.have.property('totalDocks')
            expect(result.body[0]).to.have.property('availableBikes')
            done()
        })
    })
    it('should return a 400 status due to invalid page request', (done) => {
        chai.request(server)
        .get('/stations/in-service?page=thisisapage')
        .end((err, result) => {
            expect(result).to.have.status(400)
            expect(result.body).to.have.property('error').equal('Invalid request')
            done()
        })
    })
    it('should get all the stations that are not in service', (done) => {
        chai.request(server)
        .get('/stations/not-in-service')
        .end((err, result) => {
            expect(result).to.have.status(200)
            expect(result).to.have.header('content-type', 'application/json; charset=utf-8')
            expect(result).to.be.json
            expect(result.body).to.be.an('array')
            expect(result.body[0]).to.be.an('object')
            expect(result.body[0]).to.not.have.property('id')
            expect(result.body[0]).to.have.property('stationName')
            expect(result.body[0]).to.have.property('stAddress1')
            expect(result.body[0]).to.have.property('stAddress2')
            expect(result.body[0]).to.have.property('totalDocks')
            expect(result.body[0]).to.have.property('availableBikes')
            done()
        })
    })
    it('should get all the stations that are not in service on page 2', (done) => {
        chai.request(server)
        .get('/stations/not-in-service?page=2')
        .end((err, result) => {
            expect(result).to.have.status(200)
            expect(result).to.have.header('content-type', 'application/json; charset=utf-8')
            expect(result).to.be.json
            expect(result.body).to.be.an('array')
            expect(result.body[0]).to.be.an('object')
            expect(result.body[0]).to.not.have.property('id')
            expect(result.body[0]).to.have.property('stationName')
            expect(result.body[0]).to.have.property('stAddress1')
            expect(result.body[0]).to.have.property('stAddress2')
            expect(result.body[0]).to.have.property('totalDocks')
            expect(result.body[0]).to.have.property('availableBikes')
            done()
        })
    })
    it('should return a 400 status due to invalid page request', (done) => {
        chai.request(server)
        .get('/stations/not-in-service?page=thisisanumber')
        .end((err, result) => {
            expect(result).to.have.status(400)
            expect(result.body).to.have.property('error').equal('Invalid request')
            done()
        })
    })
    it('should get all the stations that have hudson in their name/address', (done) => {
        chai.request(server)
        .get('/stations/hudson')
        .end((err, result) => {
            expect(result).to.have.status(200)
            expect(result).to.have.header('content-type', 'application/json; charset=utf-8')
            expect(result).to.be.json
            expect(result.body).to.be.an('array')
            expect(result.body[0]).to.be.an('object')
            expect(result.body[0]).to.not.have.property('id')
            expect(result.body[0].stationName.toLowerCase()).include('hudson')
            expect(result.body[0].stAddress1.toLowerCase()).include('hudson')
            expect(result.body[0]).to.have.property('stAddress2')
            expect(result.body[0]).to.have.property('totalDocks')
            expect(result.body[0]).to.have.property('availableBikes')
            done()
        })
    })
    it('should return a 404 status because requested station id was not found', (done) => {
        chai.request(server)
        .get('/stations/thisisarandomstationid')
        .end((err, result) => {
            expect(result).to.have.status(404)
            expect(result.body[0]).to.equal(undefined)
            expect(result.body).to.have.property('error').equal('Station not found')
            done()
        })
    })
    it('should return a 404 status because the route was invalid', (done) => {
        chai.request(server)
        .get('/testing/stations')
        .end((err, result) => {
            expect(result).to.have.status(404)
            expect(result.body[0]).to.equal(undefined)
            expect(result.body).to.have.property('error').equal('Invalid request')
            done()
        })
    })
    it('should return a json of all the stations data from data source', async () => {
        const stationData = await jsonStations()
        expect(stationData).to.be.an('array')
        expect(stationData[0]).to.be.an('object')
    })    
})