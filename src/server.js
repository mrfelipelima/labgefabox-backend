require('dotenv').config({
  path: './.env'
})
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')

const app = express()

app.use(cors())

const server = require('http').Server(app)
const io = require('socket.io')(server)

io.on('connection', (socket) => {
  socket.on('connectRoom', (box) => {
    socket.join(box)
  })
})

console.log('Server started')

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USERNAME}:${
    process.env.MONGO_PASSWORD
  }@labgefabox.nvash.mongodb.net/${
    process.env.MONGO_DB
  }?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true
  }
)

app.use((req, res, next) => {
  req.io = io

  return next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/files', express.static(path.resolve(__dirname, '..', 'temp')))

app.use(require('./routes'))

server.listen(process.env.PORT || 3333)
