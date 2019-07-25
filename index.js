const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3001
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const uuid = require('uuid/v4')

let rooms = []
let messages = []
let userCount = 0

// middleware
app.use(cors())
app.use(bodyParser.json())

app.get('/room/:roomId', (req, res) => {
  const room = rooms.find(room => {
    return room.roomId = req.params.roomId
  })
  res.status(200).json(room)
})

app.get('/chatinfo', (req, res) => {
  res.status(200).json({
    onlineUsers: userCount,
    totalMsgs: messages.length
  })
})

app.get('/rooms', (req, res) => {
  res.status(200).json(rooms)
})

app.post('/room', (req, res) => {
  const { roomId, roomName, roomOwner } = req.body

  if (!roomId || !roomName || !roomOwner) res.status(400).json({ msg: 'fields missing' })

  const uid = uuid()
  const newRoom = { roomId: uid, roomName, roomOwner, messages: [], onlineUsers: [] }
  rooms = [...rooms, newRoom]
  console.log(newRoom)
  res.status(200).json({ msg: 'room created', room: newRoom })
})

//chat socket
io.on('connection', socket => {
  console.log('user connected')

  // room creation
  socket.on('room-created', () => {
    // emit room list
    io.emit('chat-list', rooms)
  })

  // room closed
  socket.on('room-closed', () => {
    // emit room list
    io.emit('chat-list', rooms)
  })

  // message
  socket.on('msg', msg => {
    // add message to room obj
    const roomIndex = rooms.findIndex(room => room.roomId === msg.roomId)
    rooms[roomIndex].messages = [...rooms[roomIndex].messages, msg]

    // emmit message
    io.emit('msg-' + msg.roomId, msg)
  })

  // userCount++
  // io.emit('chatInfo', {
  //   onlineUsers: userCount,
  //   totalMsgs: messages.length
  // })

  // socket.on('msg', msg => {
  //   messages.push(msg)
  //   io.emit('newMsg', msg)
  //   io.emit('chatInfo', {
  //     onlineUsers: userCount,
  //     totalMsgs: messages.length
  //   })
  // })

  // socket.on('disconnect', (a) => {
  //   userCount--
  //   io.emit('chatInfo', {
  //     onlineUsers: userCount,
  //     totalMsgs: messages.length
  //   })
  // })
})

// server running
http.listen(port, err => {
  if (err) throw err
  console.log(`Server running [${port}]`)
})
