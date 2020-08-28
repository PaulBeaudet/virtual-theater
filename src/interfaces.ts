export interface reducerActionType {
  type: string
  payload: any
}

export interface userType {
  display_name: string | null
  photoUrl: string | null
}

export interface userContextType extends userType {
  isLoggedIn: boolean
}