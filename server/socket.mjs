// socket.mjs Copyright 2020 Paul Beaudet
// This file is part of Virtual-Theater.

// Virtual-Theater is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Virtual-Theater is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Virtual-Theater.  If not, see <https://www.gnu.org/licenses/>.
import WebSocket from 'ws'

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
  incoming: (event, sendFunc, oid) => {
    let req = { action: null }
    // if error we don't care there is a default object
    try {
      req = JSON.parse(event)
    } catch (error) {
      console.log(error)
    }
    for (let h = 0; h < socket.handlers.length; h++) {
      if (req.action === socket.handlers[h].action) {
        socket.handlers[h].func(req, sendFunc, oid)
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

export default socket