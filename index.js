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

app.get('/messages', (req, res) => {
  res.status(200).json(messages)
})

app.get('/chatinfo', (req, res) => {
  res.status(200).json({
    onlineUsers:userCount,
    totalMsgs:messages.length
  })
})

//chat socket
io.on('connection', socket => {
  console.log('user connected')
  userCount++
  io.emit('chatInfo', {
    onlineUsers:userCount,
    totalMsgs:messages.length
  })

  socket.on('msg', msg => {
    messages.push(msg)
    io.emit('newMsg', msg)
    io.emit('chatInfo', {
      onlineUsers:userCount,
      totalMsgs:messages.length
    })
  })

  socket.on('disconnect', (a) => {
    userCount--
    io.emit('chatInfo', {
      onlineUsers:userCount,
      totalMsgs:messages.length
    })
  })
})

// server running
http.listen(port, err => {
  if (err) throw err
  console.log(`Server running [${port}]`)
})
