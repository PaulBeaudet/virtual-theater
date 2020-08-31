import { reducerActionType, userContextType } from "../interfaces"

export default (state: userContextType, action: reducerActionType) => {
  if (action.type === "SIGN_IN") {
    return {
      loggedIn: true,
      displayName: action.payload.displayName,
      photoURL: action.payload.photoURL,
      uid: action.payload.uid,
      email: action.payload.email,
    }
  } else if (action.type === "SIGN_OUT") {
    return {
      ...state,
      loggedIn: false
    }
  } else {
    return state;
  }
}