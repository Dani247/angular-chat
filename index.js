const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3001
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const messages = []
let userCount = 0

// middleware
app.use(cors())

app.get('/getMessages', (req, res) => {
  res.status(200).json(messages)
})

//chat socket
io.on('connection', socket => {
  console.log('user connected')
  userCount++
  socket.emit('userCount', userCount)

  socket.on('msg', msg => {
    messages.push(msg)
    socket.emit('newMsg', msg)
  })

  socket.on('disconnect', (a) => {
    userCount--
    socket.emit('userCount', userCount)
  })
})

// server running
http.listen(port, err => {
  if (err) throw err
  console.log(`Server running [${port}]`)
})
