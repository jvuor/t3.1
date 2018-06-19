const mongoose = require('mongoose')

const dburl = process.env.MONGOURL
mongoose.connect(dburl)

const personSchema = new mongoose.Schema({
    name : String,
    number: String,
    id: Number
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 2) {
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(`${person.name}: ${person.number}`)
            })
            mongoose.connection.close()
        })
} else if (process.argv.length === 4) {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3],
    })

    console.log(`lisätään henkilö ${person.name} numero ${person.number} tietokantaan`)

    person 
        .save()
        .then(result => {
            console.log('valmis')
            mongoose.connection.close()
        })
}