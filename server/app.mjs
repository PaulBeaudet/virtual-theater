import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'
import socket from './socket.mjs'

const app = express();
const port = 8000;
const TABLES = 19;
const SEATS = 6;
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
  email: '',
  oid: ''
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
      if (roomLayout[table][seat].oid !== '') {
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
const findSeat = (oid, action) => {
  let found = false
  roomLayout.find((tables, tIdx) => {
    tables.find((seat, sIdx) => {
      if (seat.oid === oid) {
        action(tIdx, sIdx)
        found = true
      }
      return found
    })
    return found
  })
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
    findSeat(oid, (tableIdx, seatIdx) => {
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
      const sanitizedSeat = { ...seat }
      delete sanitizedSeat.oid
      return sanitizedSeat
    })
  })
} // This might be expensive but it protects us from ourselves

// API endpoint: participant enters room
socket.on('new-user', (user, resFunc, oid) => {
  // give this participant details of current layout
  resFunc({
    action: 'load_room',
    roomLayout: roomWithoutOid(),
  })
  const newParticipant = {
    displayName: user.displayName,
    photoURL: user.photoURL,
    uid: user.uid,
    email: user.email,
    oid: oid
  }
  const spot = findSomeone(newParticipant)
  if (spot.seat > -1) {
    roomLayout[spot.table][spot.seat] = { ...newParticipant }
    delete newParticipant.oid
    socket.broadcast({
      action: 'new_user',
      user: newParticipant,
      ...spot,
    })
  } else {
    resFunc({
      action: 'room full',
    })
  }
})

// API endpoint: participant switches seats
socket.on('switch_table', ({ table }, sendFunc, oid) => {
  const potentialSeat = switchTable(oid, table)
  if (potentialSeat > -1) {
    // brute force have everyone reload the room for change
    socket.broadcast({
      action: 'load_room',
      roomLayout: roomWithoutOid(),
    })
  } else {
    // tell user table is full
    sendFunc({
      action: 'table_taken',
    })
  }
})

// API endpoint: participant logs out of application
socket.on('logout', ({ uid }, sendFunc, oid) => {
  findSeat(oid, (table, seat) => {
    socket.broadcast({
      action: 'remove_user',
      // Only trust our uid associated with oid
      uid: roomLayout[table][seat].uid,
    }, oid)
    // vacate participant's seat
    roomLayout[table][seat] = emptySeat
  })
})

// serve production app on this port ('npm run build' to test)
app.use(express.static(path.join(__dirname, '../build')))
const web_server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
socket.init(web_server)
