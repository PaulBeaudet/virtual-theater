import { emptySeat, findSomeone, roomLayout } from './app.mjs'
import socket from './socket.mjs'

let seatsFilled = 0
const addUsers = () => {
  const newEntry = { ...emptySeat }
  newEntry.uid = socket.createOid()
  const spot = findSomeone(newEntry)
  if (spot.table === -1 || spot.seat === -1) {
    return seatsFilled
  }
  roomLayout[spot.table][spot.seat] = newEntry
  seatsFilled++
  return addUsers()
}

test('Can add 100 users', () => {
  const usersAdded = addUsers()
  expect(usersAdded).toBeGreaterThan(99)
})
