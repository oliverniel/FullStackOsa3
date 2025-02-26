require('dotenv').config()
//*const http = require('http')*//
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/Person')

const app = express()

app.use(express.json())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))

const mongoUrl = process.env.MONGODB_URI
console.log('connecting to', mongoUrl)
mongoose.set('strictQuery', false)

mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB:', error.message))

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(error => next(error))
})

app.get('/info', async (req, res) => {
  const count = await Person.countDocuments()
  res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons/:_id', (req, res, next) => {
  Person.findById(req.params._id)
    .then(person => person ? res.json(person) : res.status(404).end())
    .catch(error => next(error))
})

app.delete('/api/persons/:_id', (req, res, next) => {
  Person.findByIdAndDelete(req.params._id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'Name and number are required' })
  }

  const person = new Person({ name, number })

  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(error => {
      if (error.name === 'ValidationError') {
        // Kerää validointivirheet listaksi ja yhdistä ne viestiksi
        const errorMessages = Object.values(error.errors).map(err => err.message)
        return res.status(400).json({ error: errorMessages.join(', ') })
      } else if (error.code === 11000) {
        // MongoDB duplicate key error (jos nimi on merkitty uniikiksi skeemassa)
        return res.status(400).json({ error: 'Name must be unique' })
      }
      next(error)
    })
})





app.use((error, req, res, next) => {
  console.error(error.message)

  if(error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
})

app.use((req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})