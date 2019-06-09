const express = require ('express')
const logger = require('../utils/logger')
const getCitiStations = require('../stations-data/stationsData')
const router = new express.Router()

router.get('/dockable/:stationid/:bikestoreturn', async (req, res) => {
    logger.info('Checking to see if stations can dock requested bicycles', {requestParameters: {
        arguments: {...req.params},
        path: req.route.path
    }});

    const stationID = parseInt(req.params.stationid)
    const bikesToReturn = parseInt(req.params.bikestoreturn)

    //validate params
    if (isNaN(stationID) || isNaN(bikesToReturn)) {
        logger.error('The request parameters are invalid', {requestParameters: {
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

    //check if station ID exists
    let stationFind = stations.filter((station) => {
        return stationID == station.id
    })

    if (stationFind.length == 0) {
        logger.error('The requested station ID does not exist', {requestParameters: {
            arguments: {...req.params},
            path: req.route.path
        }});
        return res.status(404).send({error: 'Station ID not found'})
    }

    const availableDocks = stationFind[0].availableDocks
    
    if (availableDocks >= bikesToReturn) {
        return res.status(200).send({
            dockable: true,
            message: 'There are enough available docks for the bikes requested.'
        })
    }
    res.status(400).send({
        dockable: false,
        message: 'There are not enough available docks for the bikes requested.'
    })
})

module.exports = router