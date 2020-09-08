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

export const emptySeat = {
  displayName: '',
  photoURL: '',
  uid: '',
  email: '',
}

export const roomLayout = [];
for (let table = 0; table < TABLES; table++) {
  roomLayout[table] = [];
  for (let seat = 0; seat < SEATS; seat++) {
    roomLayout[table][seat] = { ...emptySeat }
  }
}

var complexity = 0

const checkForEmpty = (tableNumber) => {
  if (tableNumber > -1) {
    for (let i in roomLayout[tableNumber]) {
      complexity++
      if (roomLayout[tableNumber][i].uid === '') {
        return Number(i)
      }
    }
  }
  return -1
}

const tableWithAmount = (counts, amount) => {
  let table = -1
  for (let i = 0; i < roomLayout.length; i++) {
    complexity++
    if (table === -1 && counts[i] === 0) {
      table = Number(i)
    } else if (counts[i] === amount) {
      table = Number(i)
      break
    }
  }
  return table
}

export const findSomeone = () => {
  const spot = {
    table: -1,
    seat: -1,
  }
  const tableCounts = []
  for (let table = 0; table < roomLayout.length; table++) {
    complexity++
    let peeps = 0
    for (let seat in roomLayout[table]) {
      complexity++
      if (roomLayout[table][seat].uid !== '') {
        peeps++
      }
    }
    tableCounts.push(peeps)
  }
  for (let i = 1; i < roomLayout.length; i++) {
    complexity++
    spot.table = tableWithAmount(tableCounts, i)
    spot.seat = checkForEmpty(spot.table)
    if (spot.seat > -1) { return spot }
  }
  return spot // no seats left case
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
  const spot = findSomeone(newParticipant)
  console.log(`Ran findSomeone with complexity of: ${complexity}`)
  roomLayout[spot.table][spot.seat] = newParticipant
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

// serve production app on this port ('npm run build' to test)
app.use(express.static(path.join(__dirname, '../build')))
const web_server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
socket.init(web_server)
