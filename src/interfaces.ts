export interface reducerActionType {
  type: string
  payload: any
}

export interface userType {
  displayName: string | null
  photoURL: string | null
  uid: string | null
  email: string | null
}

export interface GlobalContextType {
  // loggedIn: boolean // maybe refactor this to be an instance of a user
  participants: { displayName: string; photoURL: string; }[][]
  loggedIn: userType | null
}

interface xy {
  x: number
  y: number
}
export interface tableProps {
  tableObj: {
    width: number
    height: number
    y: number
    x: number
    id: string
    seats: xy[]
  }
  tableNumber: number
}

export interface seatProps {
  seatObj: xy
  tableNumber: number
  seatNumber: number
}