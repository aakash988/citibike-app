const fetch = require('node-fetch')
const LRU = require("lru-cache"), cache = new LRU({ max: 10, maxAge: 300000})

const getCitiStations = async () => {
    const url = 'https://feeds.citibikenyc.com/stations/stations.json'
    try {
        if (cache.get(url)) {
            return cache.get(url)
        }
        const response = await fetch (url)
        const jsonData = await response.json();
        cache.set(url, jsonData.stationBeanList)
        return jsonData.stationBeanList
    }
     catch (error) {
        cache.reset()
        throw error
    }
}

module.exports = getCitiStations