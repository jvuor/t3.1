const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
var morgan = require('morgan')

app.use(cors())
app.use(bodyParser.json())

morgan.token('reqcontent', function getContent (req) {
  if (!req.body) {
    return 'N/A'
  } else {
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] :reqcontent - :response-time ms'))

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


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id )

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (req, res) => {
  var content = []
  var date = new Date()

  content.push(`puhelinluettelossa ${persons.length} tietoa <br />`)
  content.push(date.toString())
  console.log(content)
  res.send(content.join('<br />'))
})

const generateId = () => {
  console.log('generoidaan id')
  var newID = (Math.floor(Math.random() * 10000000))
  console.log(Number(newID))
  return newID
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  const name = body.name
  const number = body.number
  console.log(name, number)

  if (name === undefined) {
    return response.status(400).json({error: 'name missing'})
  } else if (number === undefined) {
    return response.status(400).json({error:'number missing'})
  } else if (persons.find(person => person.name === name)) {
    return response.status(400).json({error:'name has to be unique'})
  }

  const person = {
    name: name,
    number: number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(note => note.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})