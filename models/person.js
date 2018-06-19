const mongoose = require("mongoose")

const url = process.env.MONGOURL

mongoose.connect(url)
console.log(`connecting to db ${url}`)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

module.exports = Person