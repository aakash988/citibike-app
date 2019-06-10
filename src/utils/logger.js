const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  format: format.combine(
      format.timestamp(),
      format.json(),
      format.printf(info => `${JSON.stringify({level: info.level, message: info.message, requestParameters: info.requestParameters, timestamp: info.timestamp})}`)
    ),
    silent: process.env.NODE_ENV === 'test',
  transports: [
    new transports.Console()
  ]
});
module.exports = logger