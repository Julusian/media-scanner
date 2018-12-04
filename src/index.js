const pino = require('pino')
const config = require('./config')
const PouchDB = require('pouchdb-node')
const scanner = require('./scanner')
const previews = require('./previews')
const app = require('./app')
const startWatchDog = require('./watchDog')

const logger = pino(Object.assign({}, config.logger, {
  serializers: {
    err: pino.stdSerializers.err
  }
}))

const db = new PouchDB('_media') // `http://localhost:${config.http.port}/db/_media`)

logger.info(config)

scanner({ logger, db, config })
app({ logger, db, PouchDB, config }).listen(config.http.port)

if (config.previews.enable) {
  previews({ logger, db, config })
}
startWatchDog(logger, db)
