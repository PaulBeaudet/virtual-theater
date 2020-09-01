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

export interface userContextType extends userType {
  loggedIn: boolean
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
}