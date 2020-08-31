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