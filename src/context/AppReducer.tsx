import { reducerActionType, userContextType } from "../interfaces"

export default (state: userContextType, action: reducerActionType) => {
  const reduceObj = {
    SIGN_IN: {
      loggedIn: true,
      displayName: action.payload.displayName,
      photoURL: action.payload.photoURL,
      uid: action.payload.uid,
      email: action.payload.email,
    },
    SIGN_OUT: {
      ...state,
      loggedIn: false,
    },
  }
  return reduceObj[action.type] ? reduceObj[action.type] : state
  // turnery for default return case, because switches are long winded and error prone
}