const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI') // gets the value from the default.json using config

const connectDB = async () => {
    try {
        await mongoose.connect(db, { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }) 
        console.log('mongodb connected!')
    } catch {
        console.error(err.message)
        // Exit process if failure
        process.exit(1)
    }
}

module.exports = connectDB