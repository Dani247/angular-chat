const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3001
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const uuid = require('uuid/v4')

// middleware
app.use(cors())
app.use(bodyParser.json())

let rooms = []
let repeatedUsers = []

let directRooms = []
let onlineUsers = []

app.get('/dmroom/:roomId', (req, res) => {
  const { roomId } = req.params

  const room = directRooms.find(room => room.roomId === roomId)

  if (room) {
    res.status(200).json(room)
  } else {
    res.status(204).json({ msg: 'no content' })
  }
})

app.post('/dmroom', (req, res) => {
  const newRoom = req.body

  const roomExists = directRooms.find(room =>
    (room.user1.uid === newRoom.user1.uid && room.user2.uid === newRoom.user2.uid)
    ||
    (room.user1.uid === newRoom.user2.uid && room.user2.uid === newRoom.user1.uid)
  )

  if (roomExists) {
    res.status(200).json(roomExists)
  } else {
    newRoom.roomId = uuid()
    directRooms = [...directRooms, newRoom]
    res.status(200).json(newRoom)
  }
})

app.get('/who', (req, res) => {
  res.status(200).json(onlineUsers)
})

app.get('/room/:roomId', (req, res) => {
  const room = rooms.find(room => {
    return room.roomId === req.params.roomId
  })

  if (room) {
    res.status(200).json(room)
  } else {
    res.status(404).json({ msg: 'room not found' })
  }
})

app.get('/rooms', (req, res) => {
  res.status(200).json(rooms)
})

app.post('/room', (req, res) => {
  const { roomId, roomName, roomOwner } = req.body

  if (!roomId || !roomName || !roomOwner) {
    res.status(400).json({ msg: 'fields missing' })
  } else {
    const uid = uuid()
    const newRoom = { roomId: uid, roomName, roomOwner, messages: [], onlineUsers: [] }
    rooms = [...rooms, newRoom]

    io.emit('chat-list', rooms)
    res.status(200).json({ msg: 'room created', room: newRoom })
  }
})

app.patch('/roomname/:roomId', (req, res) => {
  const { roomName } = req.body
  const { roomId } = req.params

  const roomIndex = rooms.findIndex(room => {
    return room.roomId === req.params.roomId
  })

  if (roomIndex >= 0) {
    rooms[roomIndex].roomName = roomName
    io.emit('roomInfo-' + roomId, rooms[roomIndex])
    io.emit('chat-list', rooms)
    res.status(200).json(rooms)
  } else {
    res.status(404).json({ msg: 'room not found' })
  }
})

app.delete('/room/:roomId', (req, res) => {
  const room = rooms.find(room => {
    return room.roomId === req.params.roomId
  })

  if (room) {
    rooms = rooms.filter(room => {
      return room.roomId !== req.params.roomId
    })

    res.status(200).json(rooms)
  } else {
    res.status(404).json({ msg: 'room not found' })
  }
})

//chat socket
io.on('connection', socket => {
  // loged in
  socket.on('loggedIn', who => {
    onlineUsers = [who, ...onlineUsers]
    io.emit('who', onlineUsers)
  })

  // loged out
  socket.on('loggedOut', who => {
    console.log('user logged out', who)
    onlineUsers = onlineUsers.filter(user => user.uid !== who.uid)

    console.log('onlineUsers', onlineUsers)
    io.emit('who', onlineUsers)
  })

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

  // room deleted
  socket.on('room-deleted', (roomId) => {
    io.emit('deleted-' + roomId, true)
    io.emit('chat-list', rooms)
  })

  // room joined
  socket.on('join-room', ({ roomId, user }) => {
    if (!roomId || !user) return

    const roomIndex = rooms.findIndex(room => {
      return room.roomId === roomId
    })


    if (roomIndex >= 0) {
      // see if user is already in the room
      const findUser = rooms[roomIndex].onlineUsers.find(usr => usr.uid === user.uid)
      if (!findUser) {
        rooms[roomIndex].onlineUsers = [...rooms[roomIndex].onlineUsers, user]
        io.emit('roomInfo-' + roomId, rooms[roomIndex])
        io.emit('chat-list', rooms)
      } else {
        repeatedUsers = [...repeatedUsers, { uid: user.uid, roomId }]
      }
    }
  })

  // room left
  socket.on('leave-room', ({ roomId, user }) => {
    if (!roomId || !user) return

    const roomIndex = rooms.findIndex(room => {
      return room.roomId === roomId
    })

    if (roomIndex >= 0) {
      // see if its repeated
      const findRepeated = repeatedUsers.find(repeated => repeated.uid === user.uid && repeated.roomId === roomId)

      if (!findRepeated) {
        rooms[roomIndex].onlineUsers = rooms[roomIndex].onlineUsers.filter(u => u.uid !== user.uid)
        io.emit('roomInfo-' + roomId, rooms[roomIndex])
        io.emit('chat-list', rooms)
      } else {
        repeatedUsers = repeatedUsers.filter(repeated => repeated.uid !== user.uid && repeated.roomId !== roomId)
      }
    }
  })

  // message
  socket.on('msg', msg => {
    // add message to room obj
    const roomIndex = rooms.findIndex(room => room.roomId === msg.roomId)
    rooms[roomIndex].messages = [...rooms[roomIndex].messages, msg]
    // emmit message
    io.emit('msg-' + msg.roomId, msg)
  })

  // direct message
  socket.on('directMsg', msg => {
    // add message to room obj
    const roomIndex = directRooms.findIndex(room => room.roomId === msg.roomId)
    directRooms[roomIndex].messages = [...directRooms[roomIndex].messages, msg]
    // emmit message
    io.emit('directMsg-' + msg.roomId, msg)
  })
})

// server running
http.listen(port, err => {
  if (err) {
    console.lor(err)
  } else {
    console.log(`Server running [${port}]`)
  }
})
