const app = require('./app')
//import app from './app'
//const http = require('./http')

const config = require('./utils/config')
const logger = require('./utils/logger')





const port = process.env.Port || 3001


// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
// })

// config.PORT
console.log("PORT " + config.PORT)
app.listen(config.PORT || 3001, () => {
    logger.info(`Server running on port ${config.PORT}`)
})
