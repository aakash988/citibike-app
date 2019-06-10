const express = require ('express')
const logger = require('../utils/logger')
const getCitiStations = require('../stations-data/stationsData')
const router = new express.Router()

router.get('/stations', async (req, res) => {
    logger.info('Getting stations', {requestParameters: {
        arguments: {...req.params},
        path: req.route.path
    }});

    //validation for page query param
    let pageNumber = req.query.page
    if (pageNumber && (pageNumber <= 0 || isNaN(pageNumber))) {
        logger.error('Page should be a positive number', {requestParameters: {
            arguments: {...req.params},
            path: req.route.path
        }});
        return res.status(400).send({error: 'Invalid request'})
    }

    let stations;
    try {
        stations = await getCitiStations()
    }
    catch (error) {
        logger.error(error.message, {requestParameters: {
            arguments: {...req.params},
            path: req.route.path
    }});
        return res.status(500).send({error: 'Unable to fetch data'})
    }

    let filteredStations = stations.map(stationObject);

    if (!pageNumber) {
        return res.status(200).send(filteredStations)
    }

    //pagination
    const pageLimit = 20;
    const pageCount = Math.ceil(stations.length/pageLimit)

    if (pageNumber > pageCount) {
        logger.error('Page requested exceeds page limit', {requestParameters: {
            arguments: {...req.params},
            path: req.route.path
        }});
        return res.status(404).send({error: "Requested page not found"})
    }
    
    res.status(200).send(filteredStations.slice(pageNumber * 20 - 20, pageNumber * 20))
})

router.get('/stations/in-service', async (req, res) => {
    logger.info('Getting stations that are in service', { requestParameters: {
        arguments: {...req.params},
        path: req.route.path
    }});

    //validation for page query param
    let pageNumber = req.query.page
    if (pageNumber && (pageNumber <= 0 || isNaN(pageNumber))) {
        logger.error('Page should be a positive number', {requestParameters: {
            arguments: {...req.params},
            path: req.route.path
        }});
        return res.status(400).send({error: 'Invalid request'})
    }

    let stations;
    try {
        stations = await getCitiStations()
    }
    catch (error) {
        logger.error(error.message, {requestParameters: {
            arguments: {...req.params},
            path: req.route.path
        }});
        return res.status(500).send({error: 'Unable to fetch data'})
    }

    let filteredStations = stations
        .filter(station => station.statusValue == "In Service")
        .map(stationObject)

    if (!pageNumber) {
        return res.status(200).send(filteredStations)
    }

    //pagination
    const pageLimit = 20;
    const pageCount = Math.ceil(filteredStations.length/pageLimit)

    if (pageNumber > pageCount) {
        logger.error('Page requested exceeds page limit', {requestParameters: {
            arguments: {...req.params},
            path: req.route.path
        }});
        return res.status(404).send({error: "Requested page not found"})
    }
    
    res.status(200).send(filteredStations.slice(pageNumber * 20 - 20, pageNumber * 20))
})

router.get('/stations/not-in-service', async (req, res) => {
    logger.info('Getting stations that are not in service', { requestParameters: {
        arguments: {...req.params},
        path: req.route.path
    } });

    //validation for page query param
    let pageNumber = req.query.page
    if (pageNumber && (pageNumber <= 0 || isNaN(pageNumber))) {
        logger.error('Page should be a positive number', {requestParameters: {
            arguments: {...req.params},
            path: req.route.path
        }});
        return res.status(400).send({error: 'Invalid request'})
    }

    let stations;
    try {
        stations = await getCitiStations()
    }
    catch (error) {
        logger.error(error.message, {requestParameters: {
            arguments: {...req.params},
            path: req.route.path
        }});
        return res.status(500).send({error: 'Unable to fetch data'})
    }

    let filteredStations = stations
        .filter(station => station.statusValue !== "In Service")
        .map(stationObject)

    if (!pageNumber) {
        return res.status(200).send(filteredStations)
    }

    //pagination
    const pageLimit = 20;
    const pageCount = Math.ceil(filteredStations.length/pageLimit)

    if (pageNumber > pageCount) {
        logger.error('Page requested exceeds page limit', {requestParameters: {
            arguments: {...req.params},
            path: req.route.path
        }});
        return res.status(404).send({error: "Requested page not found"})
    }
    
    res.status(200).send(filteredStations.slice(pageNumber * 20 - 20, pageNumber * 20))
})

router.get('/stations/:searchstring', async (req, res) => {
    logger.info('Getting stations based on search query', { requestParameters: {
        arguments: {...req.params},
        path: req.route.path
    } });

    let stations;
    let searchString = req.params.searchstring.toLowerCase()

    try {
        stations = await getCitiStations()
    }
    catch (error) {
        logger.error(error.message, {requestParameters: {
            arguments: {...req.params},
            path: req.route.path
        }});
        return res.status(500).send({error: 'Unable to fetch data'})
    }
    
    let filteredStations = stations
        .filter((station) => {
            //case-insensitive
            const stationName = station.stationName.toLowerCase()
            const stationAddress = station.stAddress1.toLowerCase()
            return stationName.includes(searchString) || stationAddress.includes(searchString)
        })
        .map(stationObject);

    if (filteredStations.length == 0) {
        logger.error('Station not found using requested search parameter', {requestParameters: {
            arguments: {...req.params},
            path: req.route.path
        }});
        return res.status(404).send({error: 'Station not found'})
    }
    res.status(200).send(filteredStations)
})

const stationObject = (obj) => {
    const filteredObj = {
        stationName: obj.stationName,
        stAddress1: obj.stAddress1,
        stAddress2: obj.stAddress1,
        availableBikes: obj.availableBikes,
        totalDocks: obj.totalDocks
    }
    return filteredObj
}

module.exports = router 