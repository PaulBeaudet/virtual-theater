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
  createOid: function () {
    const increment = Math.floor(Math.random() * (16777216)).toString(16)
    const pid = Math.floor(Math.random() * (65536)).toString(16)
    const machine = Math.floor(Math.random() * (16777216)).toString(16)
    const timestamp = Math.floor(new Date().valueOf() / 1000).toString(16)
    return '00000000'.substr(0, 8 - timestamp.length) +
      timestamp + '000000'.substr(0, 6 - machine.length) +
      machine + '0000'.substr(0, 4 - pid.length) +
      pid + '000000'.substr(0, 6 - increment.length) + increment;
  },
  init: function (server) {
    socket.server = new WebSocket.Server({
      server: server,
      autoAcceptConnections: false
    })
    socket.server.on('connection', function connection(ws) {
      const connectionId = socket.createOid()
      const sendFunc = socket.send(ws)
      socket.connections.push({ connectionId: connectionId, sendFunc: sendFunc })
      ws.on('message', function incoming(message) {
        socket.incoming(message)
      });
      ws.on('disconnect', () => {
        console.log('someone disconnected')
      })
    });
  },
  send: function (ws) {
    return function (msgObj) {
      let msg = ''
      try { msg = JSON.stringify(msgObj); } catch (err) { console.log(err); }
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(msg)
        return true
      } else { return false }
    };
  },
  sendTo: function (oid, msgObj) {
    let msg = ''
    try { msg = JSON.stringify(msgObj) } catch (err) { console.log(err) }
    console.log('response from server ' + msg)
    for (var i = 0; i < socket.connections.length; i++) {
      if (socket.connections[i].connectionId === oid) {
        if (socket.connections[i].sendFunc(msgObj)) { return true }
        else { return false }
      }
    }
    return false
  },
  on: function (action, func) {
    socket.handlers.push({ action: action, func: func })
  },
  handlers: [{
    action: 'msg',
    func: function (req) { console.log(req.msg) }
  }],
  incoming: function (event) {
    let req = { action: null }
    // if error we don't care there is a default object
    try {
      req = JSON.parse(event)
    } catch (error) {
      console.log(error)
    }
    for (let h = 0; h < socket.handlers.length; h++) {
      if (req.action === socket.handlers[h].action) {
        socket.handlers[h].func(req)
        return
      }
    }
    console.log('no handler ' + event);
  }
}

const emptySeat = {
  displayName: '',
  photoURL: '',
  uid: '',
  email: '',
}

let roomLayout = [];
for (let table = 0; table < TABLES; table++) {
  roomLayout[table] = [];
  for (let seat = 0; seat < SEATS; seat++) {
    roomLayout[table][seat] = emptySeat;
  }
}

const findFreeSpot = (newParticipant) => {
  const newLayout = [...roomLayout]
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
        newLayout[table][seat] = { ...newParticipant }
        spot = {
          table,
          seat,
        }
        userAdded = true
        break
      }
    }
  }
  roomLayout = [...newLayout]
  return spot
}

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/sample-get-request', (req, res) => {
  res.json(req.query);
});
app.post('/sample-post-request', (req, res) => res.json(req.body));
app.post('/new-participant', (req, res) => {
  const newParticipant = {
    displayName: req.body.displayName,
    photoURL: req.body.photoURL,
    uid: req.body.uid,
    email: req.body.email,
  }
  const spot = findFreeSpot(newParticipant)
  socket.connections.forEach((user) => {
    setTimeout(() => {
      user.sendFunc({
        action: 'new_user',
        user: { ...newParticipant },
        ...spot,
      })
    }, 300)
  })
  res.json({ status: "ok" });
});
app.post('/logout-participant', (req, res) => {
  const { uid } = req.body
  roomLayout = roomLayout.forEach((tables, tIdx) => {
    tables.forEach((seat, sIdx) => {
      if (seat.uid === uid) {
        roomLayout[tIdx][sIdx] = emptySeat;
        // TODO: broadcast empty seat to other users
      }
    })
  })
});
app.get('/load-room', (req, res) => {
  res.json(roomLayout);
})

const web_server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
socket.init(web_server)
