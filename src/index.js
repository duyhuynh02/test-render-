const express = require('express')
const morgan = require('morgan')
const app = express()

//*exercise 3.8
morgan.token('personNameAndNumber', (request) => {
  const { name, number } = request.body 
  return `{"name": "${name}", "number": "${number}"}` 
})


const handleMiddleware = (request, response, next) => {
  if (request.method === 'POST') {
    morgan(':method :url :status :response-time[3] :personNameAndNumber')(request, response, next)
  } else {
    morgan('tiny')(request, response, next)
  }
}

app.use(express.static('dist'))
app.use(express.json())
app.use(handleMiddleware)

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons', (request, response) => {
  //exercise 3.1
    response.json(persons)
})

app.get('/info', (request, response) => {
  //exercise 3.2
    const count = Object.keys(persons).length
    request.startTime = new Date();
    const receivedTime = request.startTime.toLocaleString()
    response.send(`<div>Phone book has infor for ${count} people </br>${receivedTime}</div>`)
})

app.get('/api/persons/:id', (request, response) => {
  //exercise 3.3
  const id = request.params.id 
  const person = persons.find(person => person.id == id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

})

app.delete('/api/persons/:id', (request, response) => {
  //exercise 3.4
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})


app.post('/api/persons', (request, response) => {
  //exercise 3.5 & exercise 3.6 
  const new_person = request.body 
  const new_id = Math.floor(Math.random() * (65535)) + 1
  const isAvailable = persons.filter(person => person.name === new_person.name)

  if (!new_person.name || !new_person.number) {
    return response.status(400).json({
      error: "Missing name or number of a person. Check again."
    })
  }

  if (isAvailable.length !== 0) {
    return response.status(400).json({
      error: "This person is already there. Check again..."
    })
  }
  
  new_person.id = new_id 
  persons = persons.concat(new_person)

  response.json(new_person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}\n`)
})