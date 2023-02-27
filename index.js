const { json } = require('body-parser')
const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

let data = [
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

app.use( 
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  })
)

app.get('/api/persons', (request, response) => {
    response.json(data)
})

app.get('/info', (request,response) => {
    const text_element = `<p> Phonebook has info for ${data.length} people</p>`

    response.send(text_element + Date())
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    data = data.filter(person => person.id !== id)
    // console.log("removed ", id)
    response.status(204).end()

})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = data.find(person => person.id === id)
    // console.log("Number: ", id, " and person: ", person)
    if (person) response.json(person)
    else response.status(404).end()
    
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    // console.log("headers: ", request.headers)
    // console.log("body: ", body)
    if(!body || !body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const search = data.find(n => JSON.stringify(n) === JSON.stringify(body.name))
    if (search) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random()*1000)
    }
    // console.log(person)
    data = data.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => { 
  console.log(`Server running on port ${PORT}`)
}) 


