const express = require('express')
const app = express()
const port = '4000'
const logger = require('./utils/logger')

//require routers that are used to create endpoints
const stationRouter = require('./routers/stations')
const dockableRouter = require('./routers/dockable')

app.use(express.json())
app.use(stationRouter)
app.use(dockableRouter)

//Handles invalid routes
app.use((req, res) => {
    logger.error('Invalid Request', {requestParameters: {
        arguments: {...req.params},
        path: req.path
    }});
    res.status(404).send({error: 'Invalid request'});
});

app.listen(port, (req, res) => {
    console.log('Server is up on port ' + port)
})

module.exports = app