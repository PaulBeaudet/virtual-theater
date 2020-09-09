import { reducerActionType, GlobalContextType } from "../interfaces"
import { roomLayout } from "./GlobalState"

export default (state: GlobalContextType, action: reducerActionType) => {
  if (action.type === "SIGN_IN") {
    return {
      ...state,
      loggedIn: {
        displayName: action.payload.displayName,
        photoURL: action.payload.photoURL,
        uid: action.payload.uid,
      },
    }
  } else if (action.type === "SIGN_OUT") {
    return {
      loggedIn: {},
      participants: roomLayout
    }
  } else if (action.type === "LOAD_ROOM") {
    return {
      ...state,
      participants: action.payload,
    }
  } else if (action.type === "ADD_USER") {
    const { seat, table, user } = action.payload
    const newParticipants = [...state.participants]
    newParticipants[table][seat] = user
    return {
      ...state,
      participants: newParticipants,
    }
  } else {
    return state;
  }
}