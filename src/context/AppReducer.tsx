import { reducerActionType, GlobalContextType } from "../interfaces"

export default (state: GlobalContextType, action: reducerActionType) => {
  if (action.type === "SIGN_IN") {
    return {
      ...state,
      loggedIn: {
        displayName: action.payload.displayName,
        photoURL: action.payload.photoURL,
        uid: action.payload.uid,
        email: action.payload.email,
      }
    }
  } else if (action.type === "SIGN_OUT") {
    return {
      ...state,
      loggedIn: null
    }
  } else if (action.type === "LOAD_ROOM") {
    return {
      ...state,
      participants: action.payload,
    }
  } else {
    return state;
  }
}