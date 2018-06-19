const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
var morgan = require('morgan')
const Person = require('./models/person')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

morgan.token('reqcontent', function getContent (req) {
  if (!req.body) {
    return 'N/A'
  } else {
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] :reqcontent - :response-time ms'))

/*    pre-db
var persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Database Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  },
  {
    "name": "Mikko Nimimies",
    "number": "044-12341234",
    "id": 5
  },
  {
    "name": "Esa Esimerkki",
    "number": "050-987654",
    "id": 6
  }
]
*/

const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(formatPerson))
    })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id

  Person
    .findById(id)
    .then(person => {
      if (person) {
        response.json(formatPerson(person))
      } else {
        response.status(404).end()
      }
    })  
    .catch(error => {
      console.log(error.message)
      response.status(400).send({error: 'malformatted id'})
    })
 })

app.get('/info', (req, res) => {
  var content = []
  var date = new Date()

  Person
    .count({}, count = (err, count) => {
      content.push(`puhelinluettelossa ${count} tietoa <br />`)
      content.push(date.toString())
      console.log(content)
      res.send(content.join('<br />'))
    }) 
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  const newname = body.name
  const newnumber = body.number
  console.log(newname, newnumber)

  if (newname === undefined) {
    return response.status(400).json({error: 'name missing'})
  } else if (newnumber === undefined) {
    return response.status(400).json({error:'number missing'})
  } 

  Person
    .find({name: newname})
    .then(result => {
      if (Object.keys(result).length !== 0) {
        return response.status(400).json({error:'name has to be unique'})
      } else {
        const person = new Person({
          name: newname,
          number: newnumber
        })
      
        person
          .save()
          .then(savedPerson => response.json(formatPerson(savedPerson)))
      }
    })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  
  Person
    .findByIdAndRemove(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({error:'malformatted id'})
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})