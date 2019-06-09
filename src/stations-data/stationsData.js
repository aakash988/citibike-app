const fetch = require('node-fetch')

let cache = {}
const jsonStations = async () => {
    const url = 'https://feeds.citibikenyc.com/stations/stations.json'
    try {
        if (url in cache) {
            return cache[url]
        }
        const response = await fetch (url)
        const jsonData = await response.json();
        cache[url] = jsonData.stationBeanList
        return jsonData.stationBeanList
    }
    catch (error) {
        cache = {}
        throw error
    }
}


module.exports = jsonStations