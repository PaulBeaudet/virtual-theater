// app.mjs Copyright 2020 Paul Beaudet
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
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'
import socket from './socket.mjs'

const app = express()
let port = process.env.PORT ? process.env.PORT : 8000
const TABLES = 19
const SEATS = 6
const moduleURL = new URL(import.meta.url)
const __dirname = path.dirname(moduleURL.pathname)

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// placeholder for available user seats
export const emptySeat = {
  displayName: '',
  photoURL: '',
  uid: '',
  oid: '',
  timeout: null,
}

// TEMP create room virtually in server memory
export const roomLayout = []
export const resetLayout = () => {
  for (let table = 0; table < TABLES; table++) {
    roomLayout[table] = [];
    for (let seat = 0; seat < SEATS; seat++) {
      roomLayout[table][seat] = { ...emptySeat }
    }
  }
}
resetLayout()


// matching algorithm helper
const checkForEmpty = (tableNumber) => {
  if (tableNumber > -1) {
    for (let i in roomLayout[tableNumber]) {
      if (roomLayout[tableNumber][i].oid === '') {
        return Number(i)
      }
    }
  }
  return -1
}

// matching algorithm helper
const tableWithAmount = (counts, amount) => {
  let table = -1
  for (let i = 0; i < roomLayout.length; i++) {
    if (table === -1 && counts[i] === 0) {
      table = Number(i)
    } else if (counts[i] === amount) {
      table = Number(i)
      break
    }
  }
  return table
}

// initial matching algorithm
export const findSomeone = () => {
  const spot = {
    table: -1,
    seat: -1,
  }
  const tableCounts = []
  for (let table = 0; table < roomLayout.length; table++) {
    let peeps = 0
    for (let seat in roomLayout[table]) {
      if (roomLayout[table][seat].oid !== 'BLOCKED' && roomLayout[table][seat].oid !== '') {
        peeps++
      }
    }
    tableCounts.push(peeps)
  }
  for (let i = 1; i < roomLayout.length; i++) {
    spot.table = tableWithAmount(tableCounts, i)
    spot.seat = checkForEmpty(spot.table)
    if (spot.seat > -1) { return spot }
  }
  return spot // no seats left case
}

// helper function to locate user location
const findSeat = (id, action, type) => {
  let found = false
  roomLayout.find((tables, tIdx) => {
    tables.find((seat, sIdx) => {
      if (seat[type] === id) {
        action(tIdx, sIdx)
        found = true
      }
      return found
    })
    return found
  })
  return found
}

const findSeatByOid = (oid, action) => {
  return findSeat(oid, action, 'oid')
}

const findSeatByUid = (uid, action) => {
  return findSeat(uid, action, 'uid')
}

// Seat reassignment when participant desires to move tables
export const switchTable = (oid, table) => {
  let openSeat = -1
  // find an open seat at desired table
  roomLayout[table].find((seat, index) => {
    openSeat = seat.oid === '' ? index : -1
    return seat.oid === ''
  })
  if (openSeat > -1) {
    // find current position
    findSeatByOid(oid, (tableIdx, seatIdx) => {
      // switch to new seat
      roomLayout[table][openSeat] = { ...roomLayout[tableIdx][seatIdx] }
      // vacate old seat
      roomLayout[tableIdx][seatIdx] = { ...emptySeat }
    })
  }
  // determine positive or negative response outside function
  return openSeat
}

// keep oid property out of user's hands & private to server
// Could safely give it to them, however...
// There is too much temptation to pass back that info direct from clients
// which is where clients can exploit the api posing as other users
const roomWithoutOid = () => {
  return roomLayout.map((tables) => {
    return tables.map((seat) => {
      const { displayName, photoURL } = seat
      return {
        displayName,
        photoURL,
      }
    })
  })
} // This might be expensive but it protects us from ourselves

// API endpoint: participant enters room
socket.on('new-user', ({ uid, displayName, photoURL }, resFunc, oid) => {
  // give this participant details of current layout
  resFunc({
    action: 'LOAD_ROOM',
    roomLayout: roomWithoutOid(),
  })
  const found = findSeatByUid(uid, (table, seat) => {
    // make sure user is kept in memory
    clearTimeout(roomLayout[table][seat].timeout)
    // update oid if this is just a reload
    roomLayout[table][seat].oid = oid
    // remind user who they are
    resFunc({
      action: 'ADD_SELF',
      user: {
        displayName: roomLayout[table][seat].displayName,
        photoURL: roomLayout[table][seat].photoURL
      },
      table,
      seat,
    })
  })
  // no need for seat finding logic if one is already assigned
  if (found) { return }
  const spot = findSomeone()
  if (spot.seat > -1) {
    roomLayout[spot.table][spot.seat] = {
      uid,
      oid,
      displayName,
      photoURL,
      timeout: null
    }
    const user = {
      displayName,
      photoURL,
    }
    // update the requester for self awareness purposes
    resFunc({
      action: 'ADD_SELF',
      user,
      ...spot,
    })
    // incrementally update all participants when new ones are added
    socket.broadcast({
      action: 'ADD_USER',
      user,
      ...spot,
    }, oid) // NOTE: caller is ignored by passing oid
  } else {
    resFunc({
      action: 'ROOM_FULL',
    })
  }
})

// API endpoint: participant switches seats
socket.on('switch_table', ({ table }, sendFunc, oid) => {
  const potentialSeat = switchTable(oid, table)
  if (potentialSeat > -1) {
    sendFunc({
      action: "UPDATE_SELF",
      table,
      seat: potentialSeat
    })
    // brute force have everyone reload the room for change
    socket.broadcast({
      action: 'LOAD_ROOM',
      roomLayout: roomWithoutOid(),
    }, oid)
  } else {
    // tell user table is full
    sendFunc({
      action: 'TABLE_TAKEN',
    })
  }
})

// API endpoint: participant logs out of application
socket.on('logout', ({ uid }, sendFunc, oid) => {
  findSeatByOid(oid, (table, seat) => {
    // vacate participant's seat
    roomLayout[table][seat] = { ...emptySeat }
    socket.broadcast({
      action: 'LOAD_ROOM',
      roomLayout: roomWithoutOid(),
    }, oid)
  })
})

// API endpoint for when participant closes or reloads their browser window
socket.on('unload', ({ uid }, sendFunc, oid) => {
  findSeatByOid(oid, (table, seat) => {
    roomLayout[table][seat].timeout = setTimeout(() => {
      // vacate participant's seat
      roomLayout[table][seat] = { ...emptySeat }
      socket.broadcast({
        action: 'LOAD_ROOM',
        roomLayout: roomWithoutOid(),
      }, oid)
    }, 5000)
  })
})

socket.on('TABLE_MAX', ({ table, max }, sendFunc, oid) => {
  let currentBlocked = 0
  roomLayout[table].forEach(seat => {
    if (seat.oid === 'BLOCKED') { currentBlocked++ }
  })
  // figure how many seats need to be removed to meet max
  let seatsToRemove = SEATS - max
  let seatsToAdd = SEATS - max
  if (currentBlocked > seatsToRemove) {
    seatsToAdd = currentBlocked - seatsToAdd
    seatsToRemove = 0
  } else {
    seatsToRemove = seatsToAdd - currentBlocked
    seatsToAdd = 0
  }
  // Come up with a table arrangement without those seats
  const newArrangement = roomLayout[table].map((seat) => {
    if (seatsToAdd) {
      if (seat.oid === 'BLOCKED') {
        if (seatsToAdd > 0) {
          seat.oid = ''
          seat.displayName = ''
          seatsToAdd--
        }
      }
    } else {
      if (seat.oid === 'BLOCKED') {
        if (seatsToRemove > 0) {
          seatsToRemove--
        }
      } else if (seat.oid === '') {
        if (seatsToRemove > 0) {
          seat.oid = 'BLOCKED'
          seat.displayName = 'BLOCKED'
          seatsToRemove--
        }
      }
    }
    return seat
  })
  // ignore non-sense request
  if (seatsToRemove > 0 || seatsToAdd > 0) {
    console.log(`Still had ${seatsToRemove} to remove & ${seatsToAdd} to add`)
    return
  }
  roomLayout[table] = newArrangement
  socket.broadcast({
    action: 'LOAD_ROOM',
    roomLayout: roomWithoutOid(),
  })
})

// serve production app on this port ('npm run build' to test)
app.use(express.static(path.join(__dirname, '../build')))
const web_server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
socket.init(web_server)
