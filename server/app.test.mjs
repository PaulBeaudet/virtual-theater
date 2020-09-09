import {
  emptySeat,
  findSomeone,
  roomLayout,
  switchTable,
  resetLayout,
} from './app.mjs'
import socket from './socket.mjs'

let testExitCase = 0

// returns test exit case
const mockTest = (what, testFunc) => {
  try {
    const passed = testFunc()
    console.log(`test ${passed ? 'passed' : 'failed'}: ${what}`)
    return passed ? 0 : 1
  } catch (error) {
    console.error(`test throws "${error}" for: ${what}`)
    return 1
  }

}

testExitCase = mockTest('adds over 100 users', () => {
  let seatsFilled = 0
  const addUsers = () => {
    const newEntry = { ...emptySeat }
    newEntry.oid = socket.createOid()
    const spot = findSomeone(newEntry)
    // base case for recursing
    if (spot.table === -1 || spot.seat === -1) {
      return seatsFilled
    }
    roomLayout[spot.table][spot.seat] = newEntry
    seatsFilled++
    return addUsers()
  }
  // expect(usersAdded).toBeGreaterThan(99)
  return addUsers() > 100
})

// reset room layout for next test
resetLayout()

testExitCase = mockTest('adds over 100 while randomly switching tables', () => {
  let seatsFilled = 0
  const addUsers = () => {
    const newEntry = { ...emptySeat }
    const oid = socket.createOid()
    newEntry.oid = oid
    const spot = findSomeone(newEntry)
    // base case for recursing
    if (spot.table === -1 || spot.seat === -1) {
      return seatsFilled
    }
    roomLayout[spot.table][spot.seat] = newEntry
    seatsFilled++
    // 50% chance of moving
    if (Math.random() >= 0.5) {
      // take a random table & switch to it
      const table = Math.floor(Math.random() * roomLayout.length)
      switchTable(oid, table)
    }
    return addUsers()
  }

  return addUsers() > 100
})

process.exit(testExitCase)
