import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import WebSocket from 'ws'

const app = express();
const port = 8000;
const TABLES = 19;
const SEATS = 6;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const socket = {
  server: null,
  connections: [],
  createOid: () => {
    const increment = Math.floor(Math.random() * (16777216)).toString(16)
    const pid = Math.floor(Math.random() * (65536)).toString(16)
    const machine = Math.floor(Math.random() * (16777216)).toString(16)
    const timestamp = Math.floor(new Date().valueOf() / 1000).toString(16)
    return '00000000'.substr(0, 8 - timestamp.length) +
      timestamp + '000000'.substr(0, 6 - machine.length) +
      machine + '0000'.substr(0, 4 - pid.length) +
      pid + '000000'.substr(0, 6 - increment.length) + increment;
  },
  init: (server) => {
    socket.server = new WebSocket.Server({
      server,
      autoAcceptConnections: false
    })
    socket.server.on('connection', (ws) => {
      const oid = socket.createOid()
      const sendFunc = socket.send(ws)
      socket.connections.push({
        oid,
        sendFunc,
      })
      ws.on('message', (message) => {
        socket.incoming(message, sendFunc, oid)
      })
    })
  },
  send: (ws) => {
    return (msgObj) => {
      let msg = ''
      try {
        msg = JSON.stringify(msgObj)
      } catch (err) {
        console.log(err)
      }
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(msg)
        return true
      } else {
        return false
      }
    }
  },
  sendTo: (oid, msgObj) => {
    let msg = ''
    try {
      msg = JSON.stringify(msgObj)
    } catch (err) {
      console.log(err)
    }
    for (let i = 0; i < socket.connections.length; i++) {
      if (socket.connections[i].oid === oid) {
        if (socket.connections[i].sendFunc(msg)) {
          return true
        } else {
          return false
        }
      }
    }
    return false
  },
  on: (action, func) => {
    socket.handlers.push({ action: action, func: func })
  },
  handlers: [{
    action: 'msg',
    func: function (req) { console.log(req.msg) }
  }],
  incoming: (event, sendFunc) => {
    let req = { action: null }
    // if error we don't care there is a default object
    try {
      req = JSON.parse(event)
    } catch (error) {
      console.log(error)
    }
    for (let h = 0; h < socket.handlers.length; h++) {
      if (req.action === socket.handlers[h].action) {
        socket.handlers[h].func(req, sendFunc)
        return
      }
    }
    console.log('no handler ' + event);
  },
  broadcast: (jsonMsg, exception) => {
    socket.connections.forEach((user) => {
      if (user.oid !== exception) {
        user.sendFunc(jsonMsg)
      }
    })
  }
}

const emptySeat = {
  displayName: '',
  photoURL: '',
  uid: '',
  email: '',
}

const roomLayout = [];
for (let table = 0; table < TABLES; table++) {
  roomLayout[table] = [];
  for (let seat = 0; seat < SEATS; seat++) {
    roomLayout[table][seat] = emptySeat;
  }
}

const findFreeSpot = (newParticipant) => {
  let spot = {}
  let userAdded = false
  for (let table = 0; table < TABLES; table++) {
    if (userAdded) { break }
    for (let seat = 0; seat < SEATS; seat++) {
      if (roomLayout[table][seat].uid) {
        if (roomLayout[table][seat].uid === newParticipant.uid) {
          spot = {
            table,
            seat,
          }
          userAdded = true
          break
        }
        console(`seat: ${seat} at table: ${table} has been taken`);
      } else {
        roomLayout[table][seat] = newParticipant
        spot = {
          table,
          seat,
        }
        userAdded = true
        break
      }
    }
  }
  return spot
}

socket.on('new-user', (user, resFunc) => {
  resFunc({
    action: 'load_room',
    roomLayout: roomLayout
  })
  const newParticipant = {
    displayName: user.displayName,
    photoURL: user.photoURL,
    uid: user.uid,
    email: user.email,
  }
  const spot = findFreeSpot(newParticipant)
  socket.broadcast({
    action: 'new_user',
    user: newParticipant,
    ...spot
  })
})

socket.on('logout', ({ uid }, sendFunc, oid) => {
  roomLayout.forEach((tables, tIdx) => {
    tables.forEach((seat, sIdx) => {
      if (seat.uid === uid) {
        roomLayout[tIdx][sIdx] = emptySeat;
        socket.broadcast({
          action: 'remove_user',
          uid,
        }, oid)
      }
    })
  })
})

const web_server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
socket.init(web_server)
